
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { carouselAPIService } from '@/services/carouselAPIService';
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
  const [data, setData] = useState<CarouselData<T>>([] as CarouselData<T>);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<CarouselError | null>(null);
  const [metrics, setMetrics] = useState({
    responseTime: 0,
    cacheHit: false,
    retryCount: 0
  });

  const { enabled = true, refetchOnMount = true } = options;

  // Stabilize filters using JSON stringification to prevent infinite loops
  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);
  const stableFilters = useMemo(() => JSON.parse(filtersString), [filtersString]);
  
  // Track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  const lastFetchRef = useRef<string>('');

  // Prevent duplicate fetches for same parameters
  const shouldFetch = useCallback((currentFiltersString: string) => {
    return enabled && mountedRef.current && lastFetchRef.current !== currentFiltersString;
  }, [enabled]);

  const fetchData = useCallback(async (isRetry = false) => {
    const currentFiltersString = JSON.stringify(stableFilters);
    
    if (!shouldFetch(currentFiltersString)) {
      return;
    }

    lastFetchRef.current = currentFiltersString;
    
    if (!mountedRef.current) return;

    setIsLoading(true);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      let result: any[];
      
      switch (type) {
        case 'events':
          result = await carouselAPIService.fetchEvents(stableFilters as EventFilters);
          break;
        case 'restaurants':
          result = await carouselAPIService.fetchRestaurants(stableFilters as RestaurantFilters);
          break;
        case 'experiences':
          result = await carouselAPIService.fetchExperiences(stableFilters as ExperienceFilters);
          break;
        default:
          throw new Error(`Unsupported carousel type: ${type}`);
      }

      if (!mountedRef.current) return;

      setData(result as CarouselData<T>);
      setMetrics(prev => ({
        responseTime: Date.now() - startTime,
        cacheHit: false,
        retryCount: isRetry ? prev.retryCount + 1 : 0
      }));

      console.log(`✅ Carousel ${type} loaded:`, result.length, 'items');
      
    } catch (err) {
      if (!mountedRef.current) return;
      
      const carouselError = err as CarouselError;
      setError(carouselError);
      
      console.error(`❌ Carousel ${type} error:`, carouselError);
      
      if (carouselError.recoveryAction === 'fallback' && carouselError.fallbackData) {
        setData(carouselError.fallbackData as CarouselData<T>);
        console.log(`🔄 Using fallback data for ${type}`);
      }
      
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [type, stableFilters, shouldFetch]);

  const retry = useCallback(() => {
    console.log(`🔄 Retrying carousel ${type}...`);
    lastFetchRef.current = ''; // Reset to allow retry
    fetchData(true);
  }, [fetchData, type]);

  const refresh = useCallback(() => {
    console.log(`🔁 Refreshing carousel ${type}...`);
    carouselAPIService.invalidateCache(type, 'manual_refresh');
    lastFetchRef.current = ''; // Reset to allow refresh
    fetchData(false);
  }, [fetchData, type]);

  // Initial fetch with stable dependencies
  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchData(false);
    }
  }, [enabled, refetchOnMount, filtersString]); // Use filtersString instead of filters

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Track analytics only when data changes, not on every render
  useEffect(() => {
    if (data.length > 0 && !error && mountedRef.current) {
      console.log(`📈 Carousel ${type} viewed with ${data.length} items`);
    }
  }, [data.length, error, type]);

  return {
    data,
    isLoading,
    error,
    retry,
    refresh,
    isEmpty: !isLoading && !error && data.length === 0,
    metrics
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
