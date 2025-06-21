
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useStandardPOIs } from './useStandardPOIs';
import { useApprovedPOIs } from './useApprovedPOIs';
import { getFallbackPOIs } from '@/utils/fallbackPOIData';

interface POI {
  id: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  target_audience: string;
}

interface Filters {
  activityTypes: string[];
  zone: string;
  withChildren: string;
  period?: DateRange;
}

export const usePOIData = () => {
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchStandardPOIs } = useStandardPOIs();
  const { fetchApprovedPOIs } = useApprovedPOIs();

  const fetchPOIs = useCallback(async (filters: Filters) => {
    const periodText = filters.period?.from && filters.period?.to 
      ? `dal ${format(filters.period.from, 'PPP')} al ${format(filters.period.to, 'PPP')}`
      : filters.period?.from 
        ? `dal ${format(filters.period.from, 'PPP')}`
        : 'Nessun periodo';
        
    console.log('🗺️ Caricamento POI dal database con filtri:', {
      ...filters,
      period: periodText
    });
    setIsLoading(true);
    
    try {
      // Fetch both standard and approved POIs
      const [standardPOIs, approvedPOIs] = await Promise.all([
        fetchStandardPOIs(filters),
        fetchApprovedPOIs(filters)
      ]);

      // Combine standard POIs with approved ones
      const allPOIs = [
        ...standardPOIs.map(poi => ({
          id: poi.id,
          name: poi.name,
          description: poi.description || '',
          macro_area: poi.macro_area,
          category: poi.category,
          latitude: poi.latitude || 44.0646,
          longitude: poi.longitude || 12.5736,
          address: poi.address || '',
          target_audience: poi.target_audience || 'everyone'
        })),
        ...approvedPOIs.map(poi => ({
          id: poi.id,
          name: poi.name,
          description: poi.description || '',
          macro_area: poi.macro_area,
          category: poi.category,
          latitude: poi.latitude || 44.0646,
          longitude: poi.longitude || 12.5736,
          address: poi.address || '',
          target_audience: poi.target_audience || 'everyone'
        }))
      ];

      const message = filters.period?.from 
        ? `✅ POI caricati per periodo ${periodText}: ${allPOIs.length}`
        : `✅ POI caricati: ${allPOIs.length}`;
      
      console.log(message, '(Standard:', standardPOIs.length, ', Approvate:', approvedPOIs.length, ')');
      setPois(allPOIs);

      // Fallback to static data if no POIs found
      if (allPOIs.length === 0) {
        setPois(getFallbackPOIs());
      }
      
    } catch (error) {
      console.error('❌ Errore inaspettato nel caricamento POI:', error);
      setPois([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStandardPOIs, fetchApprovedPOIs]);

  return {
    pois,
    fetchPOIs,
    isLoading
  };
};
