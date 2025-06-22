
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalizedContentFilters {
  zone: string;
  withChildren: string;
  activityTypes: string[];
  period: any;
  isFirstVisit: boolean;
}

export const usePersonalizedContent = (filters: PersonalizedContentFilters) => {
  const { user } = useAuth();
  const [pois, setPois] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchPersonalizedContent();
  }, [filters, user]);

  const fetchPersonalizedContent = async () => {
    console.log('🔍 DEBUG: usePersonalizedContent - Inizio fetch con filtri:', filters);

    try {
      // *** UNIFIED APPROACH: Query only points_of_interest table (main source of truth) ***
      let placesQuery = supabase
        .from('points_of_interest')
        .select('*')
        .eq('status', 'approved'); // Only get approved POIs
      
      // Apply activity type filters
      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto') && !filters.activityTypes.includes('tutte')) {
        placesQuery = placesQuery.in('category', filters.activityTypes);
      }

      // Apply children filter
      if (filters.withChildren === 'sì') {
        placesQuery = placesQuery.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      // Apply period filter for events (places don't have time constraints)
      if (filters.period?.from) {
        const startDate = new Date(filters.period.from).toISOString();
        const endDate = filters.period.to ? new Date(filters.period.to).toISOString() : startDate;
        
        // For events with dates, filter by date range
        placesQuery = placesQuery.or(
          `poi_type.eq.place,start_datetime.gte.${startDate},start_datetime.lte.${endDate}`
        );
      }

      console.log('🔍 DEBUG: Unified query per points_of_interest:', placesQuery);
      const { data: allPOIs, error: poisError } = await placesQuery.limit(20);
      
      if (poisError) {
        console.error('❌ Errore nel recupero POI da points_of_interest:', poisError);
        setPois([]);
      } else {
        console.log('✅ POI recuperati da points_of_interest:', allPOIs?.length || 0, allPOIs);
        
        // Debug specifico per Trattoria Gina
        const trattoriaGina = allPOIs?.find(poi => 
          poi.name?.toLowerCase().includes('trattoria gina') || 
          poi.id === 'f1ade38a-31eb-4586-ab71-589213826edb'
        );
        console.log('🍝 DEBUG: Trattoria Gina trovata in points_of_interest?', trattoriaGina);
        
        // Separate places and events
        const places = allPOIs?.filter(poi => poi.poi_type !== 'event') || [];
        const events = allPOIs?.filter(poi => poi.poi_type === 'event') || [];
        
        console.log('🔍 DEBUG: Places trovati:', places.length);
        console.log('🔍 DEBUG: Events trovati:', events.length);
        
        setPois(places);
        
        // *** EVENTS FROM DEDICATED events TABLE ***
        let dedicatedEventsQuery = supabase
          .from('events')
          .select('*')
          .gte('start_datetime', new Date().toISOString());

        if (filters.period?.from) {
          const startDate = new Date(filters.period.from).toISOString();
          const endDate = filters.period.to ? new Date(filters.period.to).toISOString() : startDate;
          
          dedicatedEventsQuery = dedicatedEventsQuery
            .gte('start_datetime', startDate)
            .lte('start_datetime', endDate);
        }

        const { data: dedicatedEventsData } = await dedicatedEventsQuery.limit(8);
        const allEvents = [...events, ...(dedicatedEventsData || [])];
        
        console.log('🔍 DEBUG: Eventi totali (POI + events table):', allEvents.length);
        setEvents(allEvents);
      }

    } catch (error) {
      console.error('❌ Errore inaspettato in usePersonalizedContent:', error);
      setPois([]);
      setEvents([]);
    }
  };

  return { pois, events };
};
