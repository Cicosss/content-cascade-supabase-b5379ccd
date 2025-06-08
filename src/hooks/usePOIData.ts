
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
  zone: string;
  withChildren: string;
}

export const usePOIData = () => {
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPOIs = useCallback(async (filters: Filters) => {
    console.log('🗺️ Caricamento POI dal database con filtri:', filters);
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('points_of_interest')
        .select('*');

      // Filtra per categoria se non è "tutto"
      if (filters.activityTypes && !filters.activityTypes.includes('tutto')) {
        // Mappa le categorie del filtro alle categorie del database
        const categoryMapping: { [key: string]: string[] } = {
          'cibo': ['cibo', 'restaurant'],
          'arte e cultura': ['arte e cultura', 'monument', 'museum'],
          'parchi e natura': ['parchi e natura', 'park', 'beach', 'nature'],
          'divertimento': ['divertimento', 'entertainment', 'amusement'],
          'sport': ['sport', 'sports'],
          'shopping': ['shopping'],
          'vita notturna': ['vita notturna', 'nightlife']
        };

        const categoriesForFilter: string[] = [];
        filters.activityTypes.forEach(filterType => {
          const mappedCategories = categoryMapping[filterType.toLowerCase()];
          if (mappedCategories) {
            categoriesForFilter.push(...mappedCategories);
          }
        });

        if (categoriesForFilter.length > 0) {
          query = query.or(
            categoriesForFilter.map(cat => `category.ilike.%${cat}%,poi_type.ilike.%${cat}%`).join(',')
          );
        }
      }

      // Filtra per target audience se withChildren è specificato
      if (filters.withChildren === 'si') {
        query = query.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Errore nel caricamento POI:', error);
        // Fallback ai dati statici in caso di errore
        setPois([
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
        ]);
        return;
      }

      console.log('✅ POI caricati dal database:', data?.length || 0);
      setPois(data || []);
      
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
