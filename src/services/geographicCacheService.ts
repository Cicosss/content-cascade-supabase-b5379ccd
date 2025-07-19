import { POI } from '@/types/poi';

interface GeographicTile {
  id: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  center: {
    lat: number;
    lng: number;
  };
  pois: POI[];
  fetchedAt: number;
  priority: number;
}

interface CachedPOI extends POI {
  tileId: string;
  priority: number;
  distance?: number;
}

interface GeographicCacheConfig {
  maxPOIs: number;
  maxTiles: number;
  tileSize: number; // in kilometers
  cacheTTL: number; // in milliseconds
  prefetchDistance: number; // in kilometers
}

class GeographicCacheService {
  private tiles = new Map<string, GeographicTile>();
  private poiCache = new Map<string, CachedPOI>();
  private config: GeographicCacheConfig;
  private lastUserPosition: { lat: number; lng: number } | null = null;
  private movementVector: { dx: number; dy: number } = { dx: 0, dy: 0 };
  private lastBoundsCheck: string | null = null;
  private boundsCheckCount = 0;
  private maxBoundsChecks = 5;

  constructor(config?: Partial<GeographicCacheConfig>) {
    this.config = {
      maxPOIs: 50,
      maxTiles: 12,
      tileSize: 5, // 5km tiles
      cacheTTL: 15 * 60 * 1000, // 15 minutes
      prefetchDistance: 10, // 10km
      ...config
    };
  }

  // Generate tile ID from coordinates
  private getTileId(lat: number, lng: number): string {
    const tileSize = this.config.tileSize / 111; // Approximate km to degrees
    const tileX = Math.floor(lng / tileSize);
    const tileY = Math.floor(lat / tileSize);
    return `${tileX},${tileY}`;
  }

  // Get tile bounds from tile ID
  private getTileBounds(tileId: string) {
    const [tileX, tileY] = tileId.split(',').map(Number);
    const tileSize = this.config.tileSize / 111;
    
    return {
      west: tileX * tileSize,
      east: (tileX + 1) * tileSize,
      south: tileY * tileSize,
      north: (tileY + 1) * tileSize
    };
  }

  // Calculate priority based on distance and POI rating
  private calculatePOIPriority(poi: POI, userLocation: { lat: number; lng: number }): number {
    const distance = this.calculateDistance(
      poi.latitude, poi.longitude,
      userLocation.lat, userLocation.lng
    );
    
    const rating = poi.avg_rating || 3;
    const distanceScore = Math.max(0, 20 - distance); // Max 20km, closer is better
    const ratingScore = rating * 2; // Max 10 points for rating
    
    return distanceScore + ratingScore;
  }

  // Calculate distance between two points
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Update movement vector for predictive fetching
  private updateMovementVector(newPosition: { lat: number; lng: number }) {
    if (this.lastUserPosition) {
      this.movementVector = {
        dx: newPosition.lng - this.lastUserPosition.lng,
        dy: newPosition.lat - this.lastUserPosition.lat
      };
    }
    this.lastUserPosition = newPosition;
  }

  // Get adjacent tile IDs based on movement direction
  private getAdjacentTileIds(centerTileId: string): string[] {
    const [centerX, centerY] = centerTileId.split(',').map(Number);
    const adjacentTiles: string[] = [];
    
    // All 8 adjacent tiles
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        adjacentTiles.push(`${centerX + dx},${centerY + dy}`);
      }
    }

    // Prioritize tiles in movement direction
    if (Math.abs(this.movementVector.dx) > 0.001 || Math.abs(this.movementVector.dy) > 0.001) {
      adjacentTiles.sort((a, b) => {
        const [aX, aY] = a.split(',').map(Number);
        const [bX, bY] = b.split(',').map(Number);
        
        const aDotProduct = (aX - centerX) * this.movementVector.dx + (aY - centerY) * this.movementVector.dy;
        const bDotProduct = (bX - centerX) * this.movementVector.dx + (bY - centerY) * this.movementVector.dy;
        
        return bDotProduct - aDotProduct; // Higher dot product first
      });
    }

    return adjacentTiles;
  }

  // Get cached POIs for current viewport with stability controls
  getCachedPOIs(userLocation: { lat: number; lng: number }, maxDistance: number = 15): POI[] {
    // Prevent excessive calls
    const locationKey = `${userLocation.lat.toFixed(3)},${userLocation.lng.toFixed(3)}`;
    if (this.lastBoundsCheck === locationKey) {
      this.boundsCheckCount++;
      if (this.boundsCheckCount > this.maxBoundsChecks) {
        console.warn('🚫 Cache check throttled - too many consecutive calls');
        return Array.from(this.poiCache.values()).slice(0, this.config.maxPOIs);
      }
    } else {
      this.boundsCheckCount = 0;
      this.lastBoundsCheck = locationKey;
    }

    this.updateMovementVector(userLocation);
    
    const cachedPOIs: CachedPOI[] = [];
    
    // Get POIs from cache with distance calculation
    this.poiCache.forEach(poi => {
      const distance = this.calculateDistance(
        poi.latitude, poi.longitude,
        userLocation.lat, userLocation.lng
      );
      
      if (distance <= maxDistance) {
        cachedPOIs.push({
          ...poi,
          distance,
          priority: this.calculatePOIPriority(poi, userLocation)
        });
      }
    });

    // Sort by priority and limit
    return cachedPOIs
      .sort((a, b) => b.priority - a.priority)
      .slice(0, this.config.maxPOIs)
      .map(poi => ({
        id: poi.id,
        name: poi.name,
        description: poi.description,
        category: poi.category,
        latitude: poi.latitude,
        longitude: poi.longitude,
        address: poi.address,
        target_audience: poi.target_audience,
        images: poi.images,
        price_info: poi.price_info,
        avg_rating: poi.avg_rating
      }));
  }

  // Store POIs in cache with geographic indexing
  storePOIs(pois: POI[], bounds: any): void {
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    const tileId = this.getTileId(centerLat, centerLng);
    
    // Create or update tile
    const tile: GeographicTile = {
      id: tileId,
      bounds,
      center: { lat: centerLat, lng: centerLng },
      pois,
      fetchedAt: Date.now(),
      priority: 1
    };

    this.tiles.set(tileId, tile);

    // Add POIs to cache
    pois.forEach(poi => {
      const cachedPOI: CachedPOI = {
        ...poi,
        tileId,
        priority: this.calculatePOIPriority(poi, { lat: centerLat, lng: centerLng })
      };
      this.poiCache.set(poi.id, cachedPOI);
    });

    // Cleanup if needed
    this.performMemoryCleanup();
    
    console.log(`🗂️ Stored ${pois.length} POIs in tile ${tileId}. Cache size: ${this.poiCache.size}`);
  }

  // Check if bounds need fresh data
  needsFreshData(bounds: any): boolean {
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    const tileId = this.getTileId(centerLat, centerLng);
    
    const tile = this.tiles.get(tileId);
    if (!tile) return true;
    
    const isExpired = Date.now() - tile.fetchedAt > this.config.cacheTTL;
    return isExpired;
  }

  // Get tiles that need prefetching
  getTilesToPrefetch(userLocation: { lat: number; lng: number }): string[] {
    const currentTileId = this.getTileId(userLocation.lat, userLocation.lng);
    const adjacentTiles = this.getAdjacentTileIds(currentTileId);
    
    return adjacentTiles.filter(tileId => {
      const tile = this.tiles.get(tileId);
      if (!tile) return true;
      
      return Date.now() - tile.fetchedAt > this.config.cacheTTL;
    }).slice(0, 3); // Limit prefetch to 3 tiles
  }

  // Memory cleanup based on priority and distance
  private performMemoryCleanup(): void {
    if (this.poiCache.size <= this.config.maxPOIs) return;

    const poisToRemove = this.poiCache.size - this.config.maxPOIs;
    const sortedPOIs = Array.from(this.poiCache.values())
      .sort((a, b) => a.priority - b.priority); // Lowest priority first

    for (let i = 0; i < poisToRemove && i < sortedPOIs.length; i++) {
      this.poiCache.delete(sortedPOIs[i].id);
    }

    // Cleanup old tiles
    if (this.tiles.size > this.config.maxTiles) {
      const tilesToRemove = this.tiles.size - this.config.maxTiles;
      const sortedTiles = Array.from(this.tiles.values())
        .sort((a, b) => a.fetchedAt - b.fetchedAt); // Oldest first

      for (let i = 0; i < tilesToRemove && i < sortedTiles.length; i++) {
        this.tiles.delete(sortedTiles[i].id);
      }
    }

    console.log(`🧹 Memory cleanup: ${this.poiCache.size} POIs, ${this.tiles.size} tiles`);
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let freshTiles = 0;
    let staleTiles = 0;

    this.tiles.forEach(tile => {
      if (now - tile.fetchedAt < this.config.cacheTTL) {
        freshTiles++;
      } else {
        staleTiles++;
      }
    });

    return {
      totalPOIs: this.poiCache.size,
      totalTiles: this.tiles.size,
      freshTiles,
      staleTiles,
      maxPOIs: this.config.maxPOIs,
      maxTiles: this.config.maxTiles,
      memoryUsage: `${Math.round(this.poiCache.size * 0.5)}KB` // Rough estimate
    };
  }

  // Clear all cache
  clear(): void {
    this.tiles.clear();
    this.poiCache.clear();
    this.lastUserPosition = null;
    this.movementVector = { dx: 0, dy: 0 };
  }
}

export const geographicCache = new GeographicCacheService();
