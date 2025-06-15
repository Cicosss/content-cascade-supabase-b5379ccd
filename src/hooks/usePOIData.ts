
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, isAfter, isBefore, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';

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
      // Carica POI sia da points_of_interest che da poi_submissions approvate
      let query = supabase
        .from('points_of_interest')
        .select('*');

      // Filtra per categoria se non è "tutto"
      if (filters.activityTypes && !filters.activityTypes.includes('tutto')) {
        // Mappa le categorie del filtro alle categorie del database
        const categoryMapping: { [key: string]: string[] } = {
          'cibo': ['Ristoranti', 'Agriturismi', 'Cantine', 'Street Food', 'Mercati'],
          'arte e cultura': ['Musei', 'Borghi', 'Castelli', 'Arte', 'Artigianato'],
          'parchi e natura': ['Parchi', 'Spiagge', 'Attività per Bambini', 'Sport', 'Natura'],
          'divertimento': ['Concerti', 'Festival', 'Teatro', 'Cinema', 'Mostre'],
          'sport': ['Sport'],
          'shopping': ['shopping'],
          'vita notturna': ['vita notturna']
        };

        const categoriesForFilter: string[] = [];
        filters.activityTypes.forEach(filterType => {
          const mappedCategories = categoryMapping[filterType.toLowerCase()];
          if (mappedCategories) {
            categoriesForFilter.push(...mappedCategories);
          }
        });

        if (categoriesForFilter.length > 0) {
          query = query.in('category', categoriesForFilter);
        }
      }

      // Filtra per target audience se withChildren è specificato
      if (filters.withChildren === 'si') {
        query = query.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      // Filtra per periodo se specificato
      if (filters.period?.from) {
        const startDate = startOfDay(filters.period.from);
        const endDate = filters.period.to ? endOfDay(filters.period.to) : endOfDay(filters.period.from);
        
        console.log('📅 Filtraggio POI per periodo:', {
          from: format(startDate, 'PPP'),
          to: format(endDate, 'PPP')
        });
        
        // Filtra POI che sono disponibili nel periodo selezionato
        // Per ora includiamo POI che hanno eventi nel periodo o sono sempre disponibili
        query = query.or(
          `start_datetime.is.null,start_datetime.lte.${endDate.toISOString()},end_datetime.gte.${startDate.toISOString()}`
        );
      }

      const { data: standardPOIs, error: standardError } = await query;

      if (standardError) {
        console.error('❌ Errore nel caricamento POI standard:', standardError);
      }

      // Carica anche le POI approvate dalle submissions con gli stessi filtri
      let approvedQuery = supabase
        .from('poi_submissions')
        .select('*')
        .eq('status', 'approved');

      // Applica gli stessi filtri alle POI approvate
      if (filters.activityTypes && !filters.activityTypes.includes('tutto')) {
        const categoryMapping: { [key: string]: string[] } = {
          'cibo': ['Ristoranti', 'Agriturismi', 'Cantine', 'Street Food', 'Mercati'],
          'arte e cultura': ['Musei', 'Borghi', 'Castelli', 'Arte', 'Artigianato'],
          'parchi e natura': ['Parchi', 'Spiagge', 'Attività per Bambini', 'Sport', 'Natura'],
          'divertimento': ['Concerti', 'Festival', 'Teatro', 'Cinema', 'Mostre'],
          'sport': ['Sport'],
          'shopping': ['shopping'],
          'vita notturna': ['vita notturna']
        };

        const categoriesForFilter: string[] = [];
        filters.activityTypes.forEach(filterType => {
          const mappedCategories = categoryMapping[filterType.toLowerCase()];
          if (mappedCategories) {
            categoriesForFilter.push(...mappedCategories);
          }
        });

        if (categoriesForFilter.length > 0) {
          approvedQuery = approvedQuery.in('category', categoriesForFilter);
        }
      }

      if (filters.withChildren === 'si') {
        approvedQuery = approvedQuery.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      if (filters.period?.from) {
        const startDate = startOfDay(filters.period.from);
        const endDate = filters.period.to ? endOfDay(filters.period.to) : endOfDay(filters.period.from);
        
        approvedQuery = approvedQuery.or(
          `start_datetime.is.null,start_datetime.lte.${endDate.toISOString()},end_datetime.gte.${startDate.toISOString()}`
        );
      }

      const { data: approvedPOIs, error: approvedError } = await approvedQuery;

      if (approvedError) {
        console.error('❌ Errore nel caricamento POI approvate:', approvedError);
      }

      // Combina le POI standard con quelle approvate
      const allPOIs = [
        ...(standardPOIs || []).map(poi => ({
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
        ...(approvedPOIs || []).map(poi => ({
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
      
      console.log(message, '(Standard:', standardPOIs?.length || 0, ', Approvate:', approvedPOIs?.length || 0, ')');
      setPois(allPOIs);

      // Fallback ai dati statici se non ci sono POI
      if (allPOIs.length === 0) {
        setPois([
          {
            id: '1',
            name: 'Osteria del Borgo Antico',
            description: 'Tradizione Culinaria Romagnola',
            macro_area: 'Gusto & Sapori',
            category: 'Ristoranti',
            latitude: 44.0646,
            longitude: 12.5736,
            address: 'Centro Storico di Rimini',
            target_audience: 'everyone'
          },
          {
            id: '2',
            name: 'Tempio Malatestiano',
            description: 'Capolavoro Rinascimentale',
            macro_area: 'Cultura & Territorio',
            category: 'Arte',
            latitude: 44.0587,
            longitude: 12.5684,
            address: 'Via IV Novembre, Rimini',
            target_audience: 'everyone'
          },
          {
            id: '3',
            name: 'Spiaggia di Riccione',
            description: 'Relax sul mare adriatico',
            macro_area: 'Divertimento & Famiglia',
            category: 'Spiagge',
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
