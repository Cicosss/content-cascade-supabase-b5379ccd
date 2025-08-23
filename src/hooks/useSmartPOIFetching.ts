
import { useState, useCallback, useRef, useEffect } from 'react';
import { POI, POIFilters } from '@/types/poi';
import { POIDataService } from '@/services/poiDataService';
import { geographicCache } from '@/services/geographicCacheService';
import { useToast } from '@/components/ui/use-toast';
import { devLog } from '@/utils/devLogger';

interface UseSmartPOIFetchingProps {
  userLocation: { lat: number; lng: number } | null;
  filters: POIFilters;
}

export const useSmartPOIFetching = ({ userLocation, filters }: UseSmartPOIFetchingProps) => {
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const poiService = new POIDataService();
  const lastFiltersRef = useRef<string>('');
  const prefetchTimeoutRef = useRef<NodeJS.Timeout>();
  const isInitialLoad = useRef(true);

  // Smart POI fetching with geographic cache
  const fetchPOIs = useCallback(async (bounds: any, forceFresh = false) => {
    if (!bounds || !userLocation) return;

    const filtersKey = JSON.stringify({ ...filters, bounds });
    
    // Check if we have cached data first
    if (!forceFresh && !geographicCache.needsFreshData(bounds)) {
      const cachedPOIs = geographicCache.getCachedPOIs(userLocation, 20);
      if (cachedPOIs.length > 0) {
        setPois(cachedPOIs);
        devLog.info(`📋 Using ${cachedPOIs.length} cached POIs`);
        
        // Show success message only on initial load
        if (isInitialLoad.current) {
          toast({
            title: "POI caricati",
            description: `${cachedPOIs.length} luoghi trovati dalla cache`,
          });
          isInitialLoad.current = false;
        }
        
        // Trigger prefetch in background
        schedulePrefetch();
        return;
      }
    }

    // Skip if same request
    if (filtersKey === lastFiltersRef.current && !forceFresh) {
      return;
    }

    lastFiltersRef.current = filtersKey;
    setIsLoading(true);
    setError(null);

    try {
      devLog.info('🔍 Smart fetching POIs:', { bounds, filters });
      
      const freshPOIs = await poiService.fetchStandardPOIs({ ...filters, bounds });
      
      // Store in geographic cache
      geographicCache.storePOIs(freshPOIs, bounds);
      
      // Get optimized POI list from cache (includes prioritization)
      const optimizedPOIs = geographicCache.getCachedPOIs(userLocation, 20);
      setPois(optimizedPOIs);
      
      devLog.info(`✅ Fresh POIs loaded: ${freshPOIs.length}, displaying: ${optimizedPOIs.length}`);
      
      if (isInitialLoad.current) {
        toast({
          title: "POI aggiornati",
          description: `${optimizedPOIs.length} luoghi caricati`,
        });
        isInitialLoad.current = false;
      }

      // Schedule prefetch for adjacent areas
      schedulePrefetch();

    } catch (apiError: any) {
      console.error('❌ Smart POI fetch error:', apiError);
      setError(apiError.message || 'Errore nel caricamento dei dati');
      
      // Fallback to cached data
      const fallbackPOIs = geographicCache.getCachedPOIs(userLocation, 25);
      if (fallbackPOIs.length > 0) {
        setPois(fallbackPOIs);
        toast({
          title: "Usando dati cache",
          description: `${fallbackPOIs.length} luoghi dalla cache locale`,
          variant: "default",
        });
      } else {
        toast({
          title: "Errore caricamento",
          description: "Riprova più tardi",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, userLocation, poiService, toast]);

  // Schedule prefetch for adjacent tiles
  const schedulePrefetch = useCallback(() => {
    if (!userLocation || prefetchTimeoutRef.current) return;

    prefetchTimeoutRef.current = setTimeout(async () => {
      const tilesToPrefetch = geographicCache.getTilesToPrefetch(userLocation);
      
      for (const tileId of tilesToPrefetch.slice(0, 2)) { // Limit to 2 concurrent prefetches
        try {
          const bounds = geographicCache['getTileBounds'](tileId);
          devLog.info(`🔮 Prefetching tile: ${tileId}`);
          
          const prefetchedPOIs = await poiService.fetchStandardPOIs({ ...filters, bounds });
          geographicCache.storePOIs(prefetchedPOIs, bounds);
          
        } catch (error) {
          devLog.warn(`❌ Prefetch failed for tile ${tileId}:`, error);
        }
      }
      
      prefetchTimeoutRef.current = undefined;
    }, 2000); // 2 second delay
  }, [userLocation, filters, poiService]);

  // Update POIs when user location changes (from cache)
  useEffect(() => {
    if (userLocation) {
      const cachedPOIs = geographicCache.getCachedPOIs(userLocation, 20);
      if (cachedPOIs.length > 0) {
        setPois(cachedPOIs);
      }
    }
  }, [userLocation]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  const clearCache = useCallback(() => {
    geographicCache.clear();
    setPois([]);
    toast({
      title: "Cache pulita",
      description: "I dati verranno ricaricati alla prossima richiesta",
    });
  }, [toast]);

  const getCacheStats = useCallback(() => {
    return geographicCache.getStats();
  }, []);

  return {
    pois,
    fetchPOIs,
    isLoading,
    error,
    clearCache,
    getCacheStats
  };
};
