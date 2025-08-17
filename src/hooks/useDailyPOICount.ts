
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDailyPOICount = (poiType: 'event' | 'place', category?: string) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyPOICount();
  }, [poiType, category]);

  const fetchDailyPOICount = async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      let query = supabase
        .from('points_of_interest')
        .select('*', { count: 'exact', head: true })
        .eq('poi_type', poiType);

      if (category) {
        query = query.eq('category', category);
      }

      if (poiType === 'event') {
        query = query
          .gte('start_datetime', startOfDay.toISOString())
          .lt('start_datetime', endOfDay.toISOString());
      }

      const { count: poiCount } = await query;
      setCount(poiCount || 0);
    } catch (error) {
      console.error(`Error fetching daily ${poiType} count:`, error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  return { count, loading };
};

