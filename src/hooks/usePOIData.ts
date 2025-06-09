
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
      // Carica POI sia da points_of_interest che da poi_submissions approvate
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

      const { data: standardPOIs, error: standardError } = await query;

      if (standardError) {
        console.error('❌ Errore nel caricamento POI standard:', standardError);
      }

      // Carica anche le POI approvate dalle submissions
      let approvedQuery = supabase
        .from('poi_submissions')
        .select('*')
        .eq('status', 'approved');

      // Applica gli stessi filtri alle POI approvate
      if (filters.activityTypes && !filters.activityTypes.includes('tutto')) {
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
          approvedQuery = approvedQuery.or(
            categoriesForFilter.map(cat => `category.ilike.%${cat}%,poi_type.ilike.%${cat}%`).join(',')
          );
        }
      }

      if (filters.withChildren === 'si') {
        approvedQuery = approvedQuery.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      const { data: approvedPOIs, error: approvedError } = await approvedQuery;

      if (approvedError) {
        console.error('❌ Errore nel caricamento POI approvate:', approvedError);
      }

      // Combina le POI standard con quelle approvate
      const allPOIs = [
        ...(standardPOIs || []),
        ...(approvedPOIs || []).map(poi => ({
          id: poi.id,
          name: poi.name,
          description: poi.description || '',
          poi_type: poi.poi_type,
          category: poi.category,
          latitude: poi.latitude || 44.0646,
          longitude: poi.longitude || 12.5736,
          address: poi.address || '',
          target_audience: poi.target_audience || 'everyone'
        }))
      ];

      console.log('✅ POI caricati:', allPOIs.length, '(Standard:', standardPOIs?.length || 0, ', Approvate:', approvedPOIs?.length || 0, ')');
      setPois(allPOIs);

      // Fallback ai dati statici se non ci sono POI
      if (allPOIs.length === 0) {
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
