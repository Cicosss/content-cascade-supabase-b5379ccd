
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { POIDetailData } from '@/types/poiDetail';

export const usePOIDetail = (id: string | undefined) => {
  const [poi, setPoi] = useState<POIDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPOI = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('points_of_interest')
          .select('*')
          .eq('id', id)
          .eq('status', 'approved')
          .single();

        if (error) {
          setError('POI non trovato');
          return;
        }

        setPoi(data);
      } catch (error) {
        setError('Errore nel caricamento del POI');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPOI();
  }, [id]);

  return { poi, isLoading, error };
};
