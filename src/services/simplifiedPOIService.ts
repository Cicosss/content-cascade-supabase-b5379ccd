import { supabase } from '@/integrations/supabase/client';
import { POI, POIFilters } from '@/types/poi';
import { getCategoriesForFilters } from '@/config/categoryMapping';

export class SimplifiedPOIService {
  // Simple cache with TTL
  private cache = new Map<string, { data: POI[]; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private generateCacheKey(filters: POIFilters): string {
    const categories = getCategoriesForFilters(filters.activityTypes);
    return JSON.stringify({
      categories: categories.sort(),
      withChildren: filters.withChildren,
      bounds: filters.bounds ? {
        n: filters.bounds.north.toFixed(3),
        s: filters.bounds.south.toFixed(3),
        e: filters.bounds.east.toFixed(3),
        w: filters.bounds.west.toFixed(3)
      } : null
    });
  }

  async fetchPOIs(filters: POIFilters): Promise<POI[]> {
    const cacheKey = this.generateCacheKey(filters);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log('🔄 [SIMPLIFIED] Using cached data:', cached.data.length, 'POIs');
      return cached.data;
    }

    console.log('🔍 [SIMPLIFIED] Fetching fresh data from database');
    
    // Get total approved POIs count for debugging
    const { count: totalApprovedCount } = await supabase
      .from('points_of_interest')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');
    
    console.log('📊 [SIMPLIFIED] Total approved POIs in database:', totalApprovedCount);
    
    const categories = getCategoriesForFilters(filters.activityTypes);
    
    console.log('🔍 [SIMPLIFIED] Query parameters:', {
      activityTypes: filters.activityTypes,
      mappedCategories: categories,
      withChildren: filters.withChildren,
      hasBounds: !!filters.bounds,
      boundsSize: filters.bounds ? 
        `${(filters.bounds.north - filters.bounds.south).toFixed(4)} x ${(filters.bounds.east - filters.bounds.west).toFixed(4)}` : 'N/A'
    });

    let query = supabase
      .from('points_of_interest')
      .select('*')
      .eq('status', 'approved');

    // Apply category filter only if specific categories are requested
    if (categories.length > 0) {
      query = query.in('category', categories);
      console.log('🎯 [SIMPLIFIED] Applying category filter:', categories);
    } else {
      console.log('🌍 [SIMPLIFIED] No category filter or empty categories - showing all approved POIs');
    }

    // Apply children filter
    if (filters.withChildren === 'si') {
      query = query.or('target_audience.eq.families,target_audience.eq.everyone');
      console.log('👨‍👩‍👧‍👦 [SIMPLIFIED] Applying family filter');
    }

    // Apply bounds filter (with small buffer to ensure POIs near edges are included)
    if (filters.bounds) {
      const buffer = 0.01; // ~1km buffer
      query = query
        .gte('latitude', filters.bounds.south - buffer)
        .lte('latitude', filters.bounds.north + buffer)
        .gte('longitude', filters.bounds.west - buffer)
        .lte('longitude', filters.bounds.east + buffer);
      console.log('🗺️ [SIMPLIFIED] Applying bounds filter with buffer:', {
        original: filters.bounds,
        buffered: {
          south: filters.bounds.south - buffer,
          north: filters.bounds.north + buffer,
          west: filters.bounds.west - buffer,
          east: filters.bounds.east + buffer
        }
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [SIMPLIFIED] Database error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }

    const transformed = this.transformPOIs(data || []);
    
    // Enhanced result logging
    console.log('📊 [SIMPLIFIED] Query results:', {
      totalPOIs: transformed.length,
      requestedFilters: filters.activityTypes,
      mappedCategories: categories,
      categoriesFound: [...new Set(transformed.map(p => p.category))],
      samplePOIs: transformed.slice(0, 3).map(p => ({ name: p.name, category: p.category }))
    });

    if (categories.length > 0) {
      const categoryBreakdown = categories.reduce((acc, cat) => {
        acc[cat] = transformed.filter(p => p.category === cat).length;
        return acc;
      }, {} as Record<string, number>);
      console.log('📊 [SIMPLIFIED] Category breakdown:', categoryBreakdown);
    }

    // Cache the result
    this.cache.set(cacheKey, { data: transformed, timestamp: Date.now() });
    
    // Cleanup old cache entries
    this.cleanupCache();

    return transformed;
  }

  private transformPOIs(data: any[]): POI[] {
    return data.map(item => ({
      id: item.id,
      name: item.name || 'Nome non disponibile',
      description: item.description || '',
      category: item.category || 'Non categorizzato',
      latitude: parseFloat(item.latitude) || 0,
      longitude: parseFloat(item.longitude) || 0,
      address: item.address || '',
      location_name: item.location_name,
      target_audience: item.target_audience || 'everyone',
      images: item.images || [],
      price_info: item.price_info,
      avg_rating: item.avg_rating || 0
    })).filter(poi => 
      // Filter out POIs with invalid coordinates
      poi.latitude !== 0 && 
      poi.longitude !== 0 && 
      !isNaN(poi.latitude) && 
      !isNaN(poi.longitude)
    );
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🧹 [SIMPLIFIED] Cache cleared');
  }

  getCacheStats() {
    const now = Date.now();
    let freshEntries = 0;
    let staleEntries = 0;
    let totalPOIs = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp < this.CACHE_TTL) {
        freshEntries++;
        totalPOIs += value.data.length;
      } else {
        staleEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      freshEntries,
      staleEntries,
      totalPOIs,
      memoryUsage: `${Math.round(this.cache.size * 0.5)}KB`
    };
  }
}

export const simplifiedPOIService = new SimplifiedPOIService();