
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

    if (filters.period?.from) {
      const startDate = new Date(filters.period.from).toISOString();
      const endDate = filters.period.to ? new Date(filters.period.to).toISOString() : startDate;
      
      eventQuery = eventQuery
        .gte('start_datetime', startDate)
        .lte('start_datetime', endDate);
    }

    const { data: eventsFromPOI } = await eventQuery.limit(8);

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

    const allPOIs = [...(placesData || []), ...(eventsFromPOI || [])];
    const allEvents = [...(eventsFromPOI || []), ...(dedicatedEventsData || [])];

    setPois(allPOIs);
    setEvents(allEvents);
  };

  return { pois, events };
};
