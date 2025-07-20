
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { carouselAPIService } from '@/services/carouselAPIService';
import { useCarouselFilters } from '@/hooks/useStableFilters';
import { useSharedCarouselCache } from '@/hooks/useSharedCarouselCache';
import { 
  CarouselPOI, 
  EventCarouselData, 
  RestaurantCarouselData, 
  ExperienceCarouselData,
  CarouselError,
  EventFilters,
  RestaurantFilters,
  ExperienceFilters
} from '@/types/carousel';

type CarouselType = 'events' | 'restaurants' | 'experiences';
type CarouselData<T extends CarouselType> = 
  T extends 'events' ? EventCarouselData[] :
  T extends 'restaurants' ? RestaurantCarouselData[] :
  T extends 'experiences' ? ExperienceCarouselData[] :
  CarouselPOI[];

type CarouselFilters<T extends CarouselType> = 
  T extends 'events' ? EventFilters :
  T extends 'restaurants' ? RestaurantFilters :
  T extends 'experiences' ? ExperienceFilters :
  Record<string, any>;

interface UseCarouselAPIResult<T extends CarouselType> {
  data: CarouselData<T>;
  isLoading: boolean;
  error: CarouselError | null;
  retry: () => void;
  refresh: () => void;
  isEmpty: boolean;
  metrics: {
    responseTime: number;
    cacheHit: boolean;
    retryCount: number;
  };
}

export function useCarouselAPI<T extends CarouselType>(
  type: T,
  filters: CarouselFilters<T> = {} as CarouselFilters<T>,
  options: {
    enabled?: boolean;
    refetchOnMount?: boolean;
    staleTime?: number;
  } = {}
): UseCarouselAPIResult<T> {
  const { enabled = true, refetchOnMount = true, staleTime = 300000 } = options;
  
  // Usa filtri stabilizzati per prevenire loop infiniti
  const stableFilters = useCarouselFilters(filters, type);
  
  // Genera chiave cache unificata
  const cacheKey = useMemo(() => {
    const filterHash = Object.keys(stableFilters)
      .sort()
      .map(key => `${key}:${stableFilters[key]}`)
      .join('|');
    return `carousel-poi-${type}-${filterHash}`;
  }, [type, stableFilters]);

  // Fetcher function per la cache condivisa
  const fetcher = useCallback(async (): Promise<any[]> => {
    console.log(`🎠 Fetching ${type} with filters:`, stableFilters);
    
    switch (type) {
      case 'events':
        return await carouselAPIService.fetchEvents(stableFilters as EventFilters);
      case 'restaurants':
        return await carouselAPIService.fetchRestaurants(stableFilters as RestaurantFilters);
      case 'experiences':
        return await carouselAPIService.fetchExperiences(stableFilters as ExperienceFilters);
      default:
        throw new Error(`Unsupported carousel type: ${type}`);
    }
  }, [type, stableFilters]);

  // Cache condivisa con SWR pattern
  const {
    data: cachedData,
    isLoading,
    error,
    isStale,
    fetch: fetchData,
    invalidate,
    getMetrics: getCacheMetrics
  } = useSharedCarouselCache(cacheKey, fetcher, {
    ttl: staleTime,
    maxStaleTime: staleTime * 2,
    maxRetries: 3
  });

  // Track if component is mounted
  const mountedRef = useRef(true);

  // Metriche combinate cache + performance
  const combinedMetrics = useMemo(() => {
    const cacheMetrics = getCacheMetrics();
    return {
      responseTime: isLoading ? 0 : 100,
      cacheHit: !isLoading && cachedData.length > 0,
      retryCount: cacheMetrics.errors,
      hitRate: cacheMetrics.hitRate,
      staleData: isStale
    };
  }, [isLoading, cachedData.length, isStale, getCacheMetrics]);

  const retry = useCallback(() => {
    console.log(`🔄 Retrying carousel ${type}...`);
    fetchData();
  }, [fetchData, type]);

  const refresh = useCallback(() => {
    console.log(`🔁 Refreshing carousel ${type}...`);
    invalidate();
    fetchData();
  }, [fetchData, type, invalidate]);

  // Auto-fetch quando abilitato e filtri cambiano
  useEffect(() => {
    if (enabled && refetchOnMount) {
      console.log(`🎯 Auto-fetching ${type} carousel...`);
      fetchData();
    }
  }, [enabled, refetchOnMount, cacheKey, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Analytics e logging ottimizzati
  useEffect(() => {
    if (cachedData.length > 0 && !error && mountedRef.current) {
      console.log(`📈 Carousel ${type} displayed:`, {
        items: cachedData.length,
        fromCache: !isLoading,
        isStale: isStale
      });
    }
  }, [cachedData.length, error, type, isLoading, isStale]);

  return {
    data: cachedData as CarouselData<T>,
    isLoading,
    error,
    retry,
    refresh,
    isEmpty: !isLoading && !error && cachedData.length === 0,
    metrics: combinedMetrics
  };
}

export function useCarouselError() {
  const [errors, setErrors] = useState<Map<string, CarouselError>>(new Map());

  const handleError = useCallback((carouselType: string, error: CarouselError) => {
    setErrors(prev => new Map(prev.set(carouselType, error)));
    console.error(`🚨 Carousel error [${carouselType}]:`, error);
  }, []);

  const clearError = useCallback((carouselType: string) => {
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(carouselType);
      return newErrors;
    });
  }, []);

  const hasErrors = errors.size > 0;
  const getError = useCallback((carouselType: string) => errors.get(carouselType), [errors]);

  return {
    errors: Array.from(errors.values()),
    hasErrors,
    handleError,
    clearError,
    getError
  };
}
