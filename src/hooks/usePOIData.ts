
import { useState, useCallback, useRef } from 'react';
import { POI, POIFilters } from '@/types/poi';
import { POIDataService } from '@/services/poiDataService';

export const usePOIData = () => {
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const poiService = new POIDataService();

  const fetchPOIs = useCallback(async (filters: POIFilters) => {
    console.log('🔄 usePOIData: Inizio fetchPOIs con filtri:', filters);
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    
    try {
      console.log('🔄 usePOIData: Chiamata al servizio POI...');
      
      // Single unified call to fetch POIs
      const allPOIs = await poiService.fetchStandardPOIs(filters);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🚫 Richiesta annullata');
        return;
      }
      
      console.log('✅ usePOIData: POI ricevuti dal servizio:', allPOIs.length);
      
      // Determina se usare i dati di fallback
      const hasActiveFilters = filters.activityTypes.length > 0 || 
                               filters.withChildren === 'si' ||
                               filters.period?.from ||
                               filters.bounds;
      
      console.log('🔍 Analisi filtri:', {
        hasActiveFilters,
        activityTypes: filters.activityTypes,
        withChildren: filters.withChildren,
        hasPeriod: !!filters.period?.from,
        hasBounds: !!filters.bounds
      });
      
      // Set POIs directly from database - no fallback data
      console.log('📍 Impostando POI dal database:', allPOIs.length);
      if (allPOIs.length === 0) {
        console.log('⚠️ Nessun POI trovato con i filtri attuali - mostra stato vuoto');
      }
      setPois(allPOIs);
      
      poiService.logResults(filters, allPOIs.length, 0, allPOIs.length);
      
    } catch (error) {
      // Don't set error state if request was just aborted
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('❌ Errore nel caricamento POI:', error);
        setPois([]); // Set empty array on error
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  return {
    pois,
    fetchPOIs,
    isLoading
  };
};
