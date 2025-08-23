import { useState, useCallback, useRef, useEffect } from 'react';
import { POI, POIFilters } from '@/types/poi';
import { simplifiedPOIService } from '@/services/simplifiedPOIService';
import { useToast } from '@/components/ui/use-toast';

interface UseSimplifiedPOIDataProps {
  initialFilters: POIFilters;
}

export const useSimplifiedPOIData = ({ initialFilters }: UseSimplifiedPOIDataProps) => {
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFiltersRef = useRef<string>('');

  // Debounced fetch function
  const fetchPOIs = useCallback(async (filters: POIFilters, skipDuplicateCheck = false) => {
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const filtersKey = JSON.stringify(filters);
    
    // Skip duplicate requests
    if (!skipDuplicateCheck && filtersKey === lastFiltersRef.current) {
      console.log('🔄 [SIMPLIFIED] Skipping duplicate request');
      return;
    }

    lastFiltersRef.current = filtersKey;
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 [SIMPLIFIED] Fetching POIs with filters:', filters);
      
      const data = await simplifiedPOIService.fetchPOIs(filters);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🚫 [SIMPLIFIED] Request aborted');
        return;
      }

      setPois(data);
      console.log(`✅ [SIMPLIFIED] Successfully loaded ${data.length} POIs`);

      if (data.length === 0 && filters.activityTypes.length > 0) {
        toast({
          title: "Nessun risultato",
          description: "Prova a cambiare i filtri o espandere l'area di ricerca",
        });
      }

    } catch (fetchError: any) {
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🚫 [SIMPLIFIED] Request aborted during fetch');
        return;
      }

      console.error('❌ [SIMPLIFIED] Fetch error:', fetchError);
      setError(fetchError.message || 'Errore nel caricamento dei dati');
      
      toast({
        title: "Errore caricamento",
        description: "Riprova tra qualche istante",
        variant: "destructive",
      });
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [toast]);

  // Retry function
  const retry = useCallback(() => {
    const lastFilters = lastFiltersRef.current;
    if (lastFilters) {
      fetchPOIs(JSON.parse(lastFilters), true);
    }
  }, [fetchPOIs]);

  // Clear cache function
  const clearCache = useCallback(() => {
    simplifiedPOIService.clearCache();
    toast({
      title: "Cache pulita",
      description: "I dati verranno ricaricati alla prossima richiesta",
    });
  }, [toast]);

  // Get cache stats
  const getCacheStats = useCallback(() => {
    return simplifiedPOIService.getCacheStats();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    pois,
    fetchPOIs,
    isLoading,
    error,
    retry,
    clearCache,
    getCacheStats
  };
};