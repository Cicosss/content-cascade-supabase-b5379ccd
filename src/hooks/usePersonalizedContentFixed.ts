
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePersonalizedContent = (filters?: any) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Prevent infinite loops with refs
  const filtersRef = useRef();
  const mountedRef = useRef(true);
  const lastCallRef = useRef(0);
  
  const fetchData = useCallback(async () => {
    // Throttle API calls - max 1 call per 2 seconds
    const now = Date.now();
    if (now - lastCallRef.current < 2000) {
      return;
    }
    lastCallRef.current = now;
    
    if (!mountedRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('DEBUG: usePersonalizedContent - Inizio fetch con filtri:', filters);
      
      let query = supabase
        .from('points_of_interest')
        .select('*')
        .eq('status', 'approved')
        .limit(20);

      // Only apply filters if they exist and are different from previous
      if (filters && typeof filters === 'object') {
        if (filters.zone && filters.zone !== 'tuttalromagna') {
          query = query.eq('macro_area', filters.zone);
        }
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;

      if (mountedRef.current) {
        setData(result || []);
        console.log('DEBUG: POI recuperati da points_of_interest:', result?.length || 0);
      }
    } catch (error) {
      console.error('DEBUG: usePersonalizedContent - Errore:', error);
      if (mountedRef.current) {
        setError(error as Error);
        setData([]);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []); // Empty dependencies to prevent infinite loops

  useEffect(() => {
    // Only fetch if filters actually changed
    const filtersString = JSON.stringify(filters);
    if (filtersRef.current !== filtersString) {
      filtersRef.current = filtersString;
      fetchData();
    }
  }, [filters, fetchData]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
};
