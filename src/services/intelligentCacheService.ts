// Servizio di cache intelligente multi-livello
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

class IntelligentCacheService {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 1000;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Avvia pulizia automatica ogni 5 minuti
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  // Configurazioni cache predefinite per diversi tipi
  private readonly DEFAULT_CONFIGS: Record<string, CacheConfig> = {
    'homepage-pois': {
      ttl: 5 * 60 * 1000, // 5 minuti
      maxSize: 100,
      tags: ['homepage', 'pois'],
      priority: 'high'
    },
    'dashboard-pois': {
      ttl: 3 * 60 * 1000, // 3 minuti
      maxSize: 200,
      tags: ['dashboard', 'pois'],
      priority: 'high'
    },
    'geo-data': {
      ttl: 15 * 60 * 1000, // 15 minuti
      maxSize: 50,
      tags: ['geo', 'location'],
      priority: 'medium'
    },
    'user-preferences': {
      ttl: 30 * 60 * 1000, // 30 minuti
      maxSize: 20,
      tags: ['user', 'preferences'],
      priority: 'high'
    },
    'analytics': {
      ttl: 1 * 60 * 1000, // 1 minuto
      maxSize: 500,
      tags: ['analytics', 'metrics'],
      priority: 'low'
    }
  };

  // Genera chiave cache unica
  private generateKey(
    baseKey: string,
    filters?: Record<string, any>,
    userLocation?: { lat: number; lng: number }
  ): string {
    let key = baseKey;
    
    if (filters && Object.keys(filters).length > 0) {
      const filterString = Object.entries(filters)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
        .join('|');
      key += `__filters:${filterString}`;
    }
    
    if (userLocation) {
      // Arrotonda le coordinate per migliorare il cache hit
      const lat = Math.round(userLocation.lat * 100) / 100;
      const lng = Math.round(userLocation.lng * 100) / 100;
      key += `__geo:${lat},${lng}`;
    }
    
    return key;
  }

  // Ottieni dato dalla cache
  get<T>(
    baseKey: string,
    filters?: Record<string, any>,
    userLocation?: { lat: number; lng: number }
  ): T | null {
    const key = this.generateKey(baseKey, filters, userLocation);
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Controlla se il dato è scaduto
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // Salva dato in cache
  set<T>(
    baseKey: string,
    data: T,
    configType: keyof typeof this.DEFAULT_CONFIGS = 'homepage-pois',
    filters?: Record<string, any>,
    userLocation?: { lat: number; lng: number }
  ): void {
    const key = this.generateKey(baseKey, filters, userLocation);
    const config = this.DEFAULT_CONFIGS[configType];
    const now = Date.now();
    
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + config.ttl,
      tags: config.tags,
      priority: config.priority
    };
    
    this.cache.set(key, item);
    
    // Controlla se bisogna fare pulizia per spazio
    if (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
  }

  // Invalida cache per tag
  invalidateByTags(tags: string[]): void {
    for (const [key, item] of this.cache.entries()) {
      if (tags.some(tag => item.tags.includes(tag))) {
        this.cache.delete(key);
      }
    }
  }

  // Invalida cache per pattern di chiave
  invalidateByPattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  // Pulizia automatica dei dati scaduti
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Rimozione LRU quando la cache è piena
  private evictLRU(): void {
    // Rimuovi gli elementi con priorità più bassa per primi
    const sortedEntries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => {
        const priorityOrder = { low: 0, medium: 1, high: 2 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Se stesso priority, rimuovi il più vecchio
        return a.timestamp - b.timestamp;
      });
    
    // Rimuovi il 20% degli elementi meno prioritari
    const toRemove = Math.ceil(this.cache.size * 0.2);
    for (let i = 0; i < toRemove && sortedEntries.length > 0; i++) {
      const [key] = sortedEntries[i];
      this.cache.delete(key);
    }
  }

  // Ottieni statistiche cache
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;
    const byPriority = { low: 0, medium: 0, high: 0 };
    const byTags: Record<string, number> = {};
    
    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expired++;
      } else {
        active++;
        byPriority[item.priority]++;
        item.tags.forEach(tag => {
          byTags[tag] = (byTags[tag] || 0) + 1;
        });
      }
    }
    
    return {
      total: this.cache.size,
      active,
      expired,
      byPriority,
      byTags,
      hitRate: this.getHitRate()
    };
  }

  // Calcola hit rate approssimativo (solo per debug)
  private hitRate = { hits: 0, misses: 0 };
  
  private getHitRate() {
    const total = this.hitRate.hits + this.hitRate.misses;
    return total > 0 ? (this.hitRate.hits / total * 100).toFixed(1) + '%' : '0%';
  }

  // Traccia hit/miss per statistiche
  trackHit() {
    this.hitRate.hits++;
  }

  trackMiss() {
    this.hitRate.misses++;
  }

  // Pulisci tutto
  clear(): void {
    this.cache.clear();
    this.hitRate = { hits: 0, misses: 0 };
  }

  // Distruggi il servizio
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Istanza singleton
export const intelligentCache = new IntelligentCacheService();

// Hook per utilizzare la cache nei componenti
export const useIntelligentCache = () => {
  return {
    get: intelligentCache.get.bind(intelligentCache),
    set: intelligentCache.set.bind(intelligentCache),
    invalidateByTags: intelligentCache.invalidateByTags.bind(intelligentCache),
    invalidateByPattern: intelligentCache.invalidateByPattern.bind(intelligentCache),
    getStats: intelligentCache.getStats.bind(intelligentCache),
    clear: intelligentCache.clear.bind(intelligentCache)
  };
};