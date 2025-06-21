
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
    console.log('🔍 Caricamento contenuti personalizzati con filtri:', filters);

    // Fetch POI di tipo "place" (luoghi permanenti) - senza filtro data
    let placeQuery = supabase
      .from('points_of_interest')
      .select('*')
      .eq('poi_type', 'place');
    
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
      placeQuery = placeQuery.in('category', filters.activityTypes);
    }

    if (filters.withChildren === 'sì') {
      placeQuery = placeQuery.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    const { data: placesData } = await placeQuery.limit(10);

    // Fetch POI di tipo "event" (eventi) - CON filtro data se specificato
    let eventQuery = supabase
      .from('points_of_interest')
      .select('*')
      .eq('poi_type', 'event');
    
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
      eventQuery = eventQuery.in('category', filters.activityTypes);
    }

    if (filters.withChildren === 'sì') {
      eventQuery = eventQuery.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    // Applica filtro periodo SOLO agli eventi
    if (filters.period?.from) {
      const startDate = new Date(filters.period.from).toISOString();
      const endDate = filters.period.to ? new Date(filters.period.to).toISOString() : startDate;
      
      console.log('📅 Filtraggio eventi per periodo:', { startDate, endDate });
      eventQuery = eventQuery
        .gte('start_datetime', startDate)
        .lte('start_datetime', endDate);
    }

    const { data: eventsFromPOI } = await eventQuery.limit(8);

    // Fetch eventi dalla tabella dedicata events
    let dedicatedEventsQuery = supabase
      .from('events')
      .select('*')
      .gte('start_datetime', new Date().toISOString());

    // Applica filtro periodo anche agli eventi dedicati
    if (filters.period?.from) {
      const startDate = new Date(filters.period.from).toISOString();
      const endDate = filters.period.to ? new Date(filters.period.to).toISOString() : startDate;
      
      dedicatedEventsQuery = dedicatedEventsQuery
        .gte('start_datetime', startDate)
        .lte('start_datetime', endDate);
    }

    const { data: dedicatedEventsData } = await dedicatedEventsQuery.limit(8);

    // Combina i risultati
    const allPOIs = [...(placesData || []), ...(eventsFromPOI || [])];
    const allEvents = [...(eventsFromPOI || []), ...(dedicatedEventsData || [])];

    console.log('✅ Luoghi caricati:', placesData?.length || 0);
    console.log('✅ Eventi caricati:', allEvents.length);

    setPois(allPOIs);
    setEvents(allEvents);
  };

  return { pois, events };
};
