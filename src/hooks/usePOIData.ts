
import { useState, useCallback, useRef } from 'react';
import { POI, POIFilters } from '@/types/poi';
import { POIDataService } from '@/services/poiDataService';
import { FALLBACK_POI_DATA } from '@/data/fallbackPOIData';

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
      
      // Usa i dati di fallback SOLO se non ci sono POI E non ci sono filtri attivi
      if (allPOIs.length === 0 && !hasActiveFilters) {
        console.log('📍 Nessun POI trovato e nessun filtro attivo - uso dati di fallback');
        console.log('📍 Dati di fallback disponibili:', FALLBACK_POI_DATA.length);
        setPois(FALLBACK_POI_DATA);
      } else {
        console.log('📍 Impostando POI dal database:', allPOIs.length);
        if (allPOIs.length === 0) {
          console.log('⚠️ Nessun POI trovato con i filtri attuali - verifica i criteri di ricerca');
        }
        setPois(allPOIs);
      }
      
      poiService.logResults(filters, allPOIs.length, 0, allPOIs.length);
      
    } catch (error) {
      // Don't set error state if request was just aborted
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('❌ Errore nel caricamento POI:', error);
        console.log('📍 Tentativo di uso dati di fallback dopo errore...');
        setPois(FALLBACK_POI_DATA);
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
