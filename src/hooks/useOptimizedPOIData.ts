import { useState, useCallback, useRef, useEffect } from 'react';
import { POI, POIFilters } from '@/types/poi';
import { POIDataService } from '@/services/poiDataService';
import { apiClient } from '@/services/apiClient';
import { APIErrorType } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { devLog } from '@/utils/devLogger';

export const useOptimizedPOIData = () => {
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFiltersRef = useRef<string>('');
  const { toast } = useToast();
  
  const poiService = new POIDataService();

  const generateCacheKey = useCallback((filters: POIFilters): string => {
    return `poi-data-${JSON.stringify(filters)}`;
  }, []);

  const showErrorToast = useCallback((errorType: string, message: string) => {
    toast({
      title: "Errore nel caricamento",
      description: message,
      variant: "destructive",
    });
  }, [toast]);

  const fetchPOIs = useCallback(async (filters: POIFilters) => {
    const filtersString = JSON.stringify(filters);
    
    // Prevent duplicate requests
    if (lastFiltersRef.current === filtersString && !error) {
      return;
    }
    
    lastFiltersRef.current = filtersString;
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const cacheKey = generateCacheKey(filters);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.request(
        async () => {
          if (abortControllerRef.current?.signal.aborted) {
            throw new Error('Request aborted');
          }
          return await poiService.fetchStandardPOIs(filters);
        },
        {
          retryCount: 3, // Increased retry count
          timeout: 10000, // Increased timeout
          cache: true,
          cacheTTL: 120000, // Reduced to 2 minutes for fresher data
          priority: 'high'
        },
        cacheKey
      );

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      if (response.success) {
        setPois(response.data);
        
        if (response.cached) {
          devLog.info('📋 Using cached POI data');
        } else {
          devLog.info('✅ Fresh POI data loaded:', response.data.length);
        }
        
        poiService.logResults(filters, response.data.length, 0, response.data.length);
      }

    } catch (apiError: any) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      console.error('❌ POI fetch error:', apiError);
      setError(apiError.message || 'Errore nel caricamento dei dati');

      // Simplified error handling - let APIErrorBoundary handle detailed error messages
      showErrorToast('Errore caricamento', 'Riprova più tardi');

      // Set empty array as fallback
      setPois([]);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [generateCacheKey, poiService, showErrorToast, error]);

  const retry = useCallback(() => {
    if (lastFiltersRef.current) {
      const filters = JSON.parse(lastFiltersRef.current);
      fetchPOIs(filters);
    }
  }, [fetchPOIs]);

  const clearCache = useCallback(() => {
    apiClient.clearCache();
    toast({
      title: "Cache pulita",
      description: "I dati verranno ricaricati alla prossima richiesta",
    });
  }, [toast]);

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
    clearCache
  };
};