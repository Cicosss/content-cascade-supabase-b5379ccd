import { useState, useRef, useCallback, useMemo } from 'react';
import { CarouselError } from '@/types/carousel';

interface CacheEntry<T> {
  data: T[];
  timestamp: number;
  hash: string;
  isStale: boolean;
  error?: CarouselError;
  retryCount: number;
}

interface SharedCacheOptions {
  ttl: number; // Time to live in ms
  maxStaleTime: number; // Max time before data is considered too stale
  maxRetries: number;
}

const DEFAULT_OPTIONS: SharedCacheOptions = {
  ttl: 300000, // 5 minutes
  maxStaleTime: 600000, // 10 minutes
  maxRetries: 3
};

/**
 * Cache condiviso tra tutti i caroselli per massimizzare l'efficienza
 * Implementa pattern SWR (stale-while-revalidate)
 */
class SharedCarouselCache {
  private cache = new Map<string, CacheEntry<any>>();
  private activeRequests = new Map<string, Promise<any>>();
  private metrics = {
    hits: 0,
    misses: 0,
    errors: 0,
    totalRequests: 0
  };

  /**
   * Ottieni dati dalla cache o esegui fetch
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T[]>,
    options: Partial<SharedCacheOptions> = {}
  ): Promise<{ data: T[]; fromCache: boolean; isStale: boolean }> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const now = Date.now();
    
    this.metrics.totalRequests++;
    
    const cached = this.cache.get(key);
    
    // Se i dati sono fresh, usali
    if (cached && (now - cached.timestamp) < opts.ttl && !cached.error) {
      this.metrics.hits++;
      console.log(`📦 Cache HIT for ${key} (age: ${now - cached.timestamp}ms)`);
      return { 
        data: cached.data, 
        fromCache: true, 
        isStale: false 
      };
    }
    
    // Se i dati sono stale ma utilizzabili, restituiscili e rivalidali in background
    if (cached && (now - cached.timestamp) < opts.maxStaleTime && !cached.error) {
      this.metrics.hits++;
      console.log(`📦 Cache STALE-HIT for ${key} (age: ${now - cached.timestamp}ms)`);
      
      // Rivalidazione in background (SWR pattern)
      this.revalidateInBackground(key, fetcher, opts);
      
      return { 
        data: cached.data, 
        fromCache: true, 
        isStale: true 
      };
    }
    
    // Cache miss o dati troppo vecchi - fetch fresco
    this.metrics.misses++;
    console.log(`📦 Cache MISS for ${key}`);
    
    return this.fetchAndCache(key, fetcher, opts);
  }

  /**
   * Fetch dati e aggiorna cache
   */
  private async fetchAndCache<T>(
    key: string,
    fetcher: () => Promise<T[]>,
    options: SharedCacheOptions
  ): Promise<{ data: T[]; fromCache: false; isStale: false }> {
    // Previeni richieste duplicate
    if (this.activeRequests.has(key)) {
      console.log(`⏳ Waiting for active request: ${key}`);
      const data = await this.activeRequests.get(key);
      return { data, fromCache: false, isStale: false };
    }

    const fetchPromise = this.executeFetch(key, fetcher, options);
    this.activeRequests.set(key, fetchPromise);

    try {
      const data = await fetchPromise;
      return { data, fromCache: false, isStale: false };
    } finally {
      this.activeRequests.delete(key);
    }
  }

  /**
   * Esegui fetch con retry logic e gestione errori
   */
  private async executeFetch<T>(
    key: string,
    fetcher: () => Promise<T[]>,
    options: SharedCacheOptions
  ): Promise<T[]> {
    const cached = this.cache.get(key);
    let retryCount = cached?.retryCount || 0;

    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        console.log(`🚀 Fetching ${key} (attempt ${attempt + 1})`);
        const data = await fetcher();
        
        // Successo - aggiorna cache
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          hash: this.generateHash(data),
          isStale: false,
          retryCount: 0
        });

        console.log(`✅ Successfully cached ${key} with ${data.length} items`);
        return data;

      } catch (error) {
        retryCount++;
        console.error(`❌ Fetch failed for ${key} (attempt ${attempt + 1}):`, error);
        
        if (attempt === options.maxRetries) {
          // Ultimo tentativo fallito
          this.metrics.errors++;
          
          const carouselError: CarouselError = {
            type: 'network',
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'FETCH_FAILED',
            recoveryAction: 'fallback',
            timestamp: Date.now(),
            carousel_type: key.split('-')[1] || 'unknown'
          };

          // Salva errore in cache
          this.cache.set(key, {
            data: cached?.data || [],
            timestamp: Date.now(),
            hash: '',
            isStale: true,
            error: carouselError,
            retryCount
          });

          // Se abbiamo dati cached stale, usali come fallback
          if (cached?.data && cached.data.length > 0) {
            console.log(`🔄 Using stale fallback data for ${key}`);
            return cached.data;
          }

          throw carouselError;
        }

        // Exponential backoff per retry
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`Max retries exceeded for ${key}`);
  }

  /**
   * Rivalidazione in background per SWR pattern
   */
  private async revalidateInBackground<T>(
    key: string,
    fetcher: () => Promise<T[]>,
    options: SharedCacheOptions
  ): Promise<void> {
    try {
      console.log(`🔄 Background revalidation for ${key}`);
      await this.fetchAndCache(key, fetcher, options);
    } catch (error) {
      console.warn(`⚠️ Background revalidation failed for ${key}:`, error);
      // Non propaghiamo l'errore in background
    }
  }

  /**
   * Genera hash per confrontare dati
   */
  private generateHash(data: any[]): string {
    return String(data.length) + '-' + String(data[0]?.id || '');
  }

  /**
   * Invalida cache per un prefisso (es. 'carousel-events')
   */
  invalidate(prefix: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.startsWith(prefix)
    );
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      console.log(`🗑️ Invalidated cache key: ${key}`);
    });
  }

  /**
   * Pulisci cache completa
   */
  clear(): void {
    this.cache.clear();
    this.activeRequests.clear();
    console.log('🗑️ Cleared entire carousel cache');
  }

  /**
   * Ottieni metriche cache
   */
  getMetrics() {
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.hits / this.metrics.totalRequests) * 100 
      : 0;

    return {
      ...this.metrics,
      hitRate: Math.round(hitRate * 100) / 100,
      cacheSize: this.cache.size,
      activeRequests: this.activeRequests.size
    };
  }
}

// Singleton cache instance
const sharedCache = new SharedCarouselCache();

/**
 * Hook per utilizzare la cache condivisa
 */
export function useSharedCarouselCache<T>(
  key: string,
  fetcher: () => Promise<T[]>,
  options?: Partial<SharedCacheOptions>
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<CarouselError | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const fetch = useCallback(async () => {
    if (!fetcher) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await sharedCache.get(key, fetcher, options);
      setData(result.data);
      setIsStale(result.isStale);
      
      console.log(`📊 Cache result for ${key}:`, {
        fromCache: result.fromCache,
        isStale: result.isStale,
        itemCount: result.data.length
      });
      
    } catch (err) {
      setError(err as CarouselError);
      console.error(`💥 Cache error for ${key}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, options]);

  const invalidate = useCallback(() => {
    sharedCache.invalidate(key);
  }, [key]);

  const getMetrics = useCallback(() => {
    return sharedCache.getMetrics();
  }, []);

  return {
    data,
    isLoading,
    error,
    isStale,
    fetch,
    invalidate,
    getMetrics
  };
}