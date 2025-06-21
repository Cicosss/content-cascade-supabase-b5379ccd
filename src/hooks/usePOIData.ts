
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
      const [standardPOIs, approvedPOIs] = await Promise.all([
        poiService.fetchStandardPOIs(filters),
        poiService.fetchApprovedPOIs(filters)
      ]);

      const allPOIs = [...standardPOIs, ...approvedPOIs];
      
      poiService.logResults(filters, standardPOIs.length, approvedPOIs.length, allPOIs.length);
      
      // Use fallback data if no POIs found
      if (allPOIs.length === 0) {
        setPois(FALLBACK_POI_DATA);
      } else {
        setPois(allPOIs);
      }
      
    } catch (error) {
      console.error('❌ Errore inaspettato nel caricamento POI:', error);
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
