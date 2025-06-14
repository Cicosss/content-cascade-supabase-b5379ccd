
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
    // Fetch POIs based on filters
    let poiQuery = supabase.from('points_of_interest').select('*');
    
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
      poiQuery = poiQuery.in('category', filters.activityTypes);
    }

    if (filters.withChildren === 'sì') {
      poiQuery = poiQuery.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    const { data: poisData } = await poiQuery.limit(10);
    setPois(poisData || []);

    // Fetch events
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .gte('start_datetime', new Date().toISOString())
      .limit(8);
    setEvents(eventsData || []);
  };

  return { pois, events };
};
