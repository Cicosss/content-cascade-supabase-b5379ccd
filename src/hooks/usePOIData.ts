
import { useState, useCallback } from 'react';
import { POI, POIFilters } from '@/types/poi';
import { POIDataService } from '@/services/poiDataService';
import { FALLBACK_POI_DATA } from '@/data/fallbackPOIData';

export const usePOIData = () => {
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const poiService = new POIDataService();

  const fetchPOIs = useCallback(async (filters: POIFilters) => {
    setIsLoading(true);
    
    try {
      // Single unified call to fetch POIs
      const allPOIs = await poiService.fetchStandardPOIs(filters);
      
      poiService.logResults(filters, allPOIs.length, 0, allPOIs.length);
      
      // Use fallback data if no POIs found
      if (allPOIs.length === 0) {
        setPois(FALLBACK_POI_DATA);
      } else {
        setPois(allPOIs);
      }
      
    } catch (error) {
      setPois([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    pois,
    fetchPOIs,
    isLoading
  };
};
