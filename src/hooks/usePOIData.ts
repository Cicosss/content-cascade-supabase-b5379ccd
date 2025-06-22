
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
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    
    try {
      console.log('🔄 Fetching POIs with filters:', filters);
      
      // Single unified call to fetch POIs
      const allPOIs = await poiService.fetchStandardPOIs(filters);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      console.log('✅ POIs fetched successfully:', allPOIs.length);
      poiService.logResults(filters, allPOIs.length, 0, allPOIs.length);
      
      // Use fallback data if no POIs found and no active filters
      const hasActiveFilters = filters.activityTypes.length > 1 || 
                              filters.zone !== 'tuttalromagna' || 
                              filters.withChildren === 'si' ||
                              filters.period?.from;
      
      if (allPOIs.length === 0 && !hasActiveFilters) {
        console.log('📍 Using fallback data');
        setPois(FALLBACK_POI_DATA);
      } else {
        setPois(allPOIs);
      }
      
    } catch (error) {
      // Don't set error state if request was just aborted
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('❌ Error fetching POIs:', error);
        setPois([]);
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
