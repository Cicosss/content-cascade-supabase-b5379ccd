
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface POI {
  id: string;
  name: string;
  description: string;
  poi_type: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  target_audience: string;
}

interface Filters {
  activityTypes: string[];
}

export const usePOIData = () => {
  const [pois, setPois] = useState<POI[]>([]);

  const fetchPOIs = useCallback(async (filters: Filters) => {
    console.log('Fetching POIs with filters:', filters);
    try {
      let query = supabase.from('points_of_interest').select('*');

      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
        query = query.in('category', filters.activityTypes);
      }

      const { data, error } = await query;
      
      if (error || !data) {
        console.log('Using fallback POIs');
        setFallbackPOIs();
      } else {
        console.log('POIs fetched:', data.length);
        setPois(data);
      }
    } catch (error) {
      console.error('Error fetching POIs:', error);
      setFallbackPOIs();
    }
  }, []);

  const setFallbackPOIs = useCallback(() => {
    const fallbackData = [
      {
        id: '1',
        name: 'Osteria del Borgo Antico',
        description: 'Tradizione Culinaria Romagnola',
        poi_type: 'restaurant',
        category: 'cibo',
        latitude: 44.0646,
        longitude: 12.5736,
        address: 'Centro Storico di Rimini',
        target_audience: 'everyone'
      },
      {
        id: '2',
        name: 'Tempio Malatestiano',
        description: 'Capolavoro Rinascimentale',
        poi_type: 'monument',
        category: 'arte e cultura',
        latitude: 44.0587,
        longitude: 12.5684,
        address: 'Via IV Novembre, Rimini',
        target_audience: 'everyone'
      },
      {
        id: '3',
        name: 'Spiaggia di Riccione',
        description: 'Relax sul mare adriatico',
        poi_type: 'beach',
        category: 'parchi e natura',
        latitude: 44.0139,
        longitude: 12.6578,
        address: 'Lungomare di Riccione',
        target_audience: 'everyone'
      }
    ];
    setPois(fallbackData);
  }, []);

  return {
    pois,
    fetchPOIs
  };
};
