
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDailyEventsCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyEventsCount();
  }, []);

  const fetchDailyEventsCount = async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const { count: eventsCount } = await supabase
        .from('points_of_interest')
        .select('*', { count: 'exact', head: true })
        .eq('poi_type', 'event')
        .gte('start_datetime', startOfDay.toISOString())
        .lt('start_datetime', endOfDay.toISOString());

      setCount(eventsCount || 0);
    } catch (error) {
      console.error('Error fetching daily events count:', error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  return { count, loading };
};
