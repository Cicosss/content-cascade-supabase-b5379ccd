
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePersonalizedContent = (filters?: any) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Prevent infinite loops with refs and memoization
  const mountedRef = useRef(true);
  const lastCallRef = useRef(0);
  
  // Stabilize filters using JSON stringification
  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);
  const stableFilters = useMemo(() => JSON.parse(filtersString), [filtersString]);
  
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
      console.log('DEBUG: usePersonalizedContent - Inizio fetch con filtri:', stableFilters);
      
      let query = supabase
        .from('points_of_interest')
        .select('*')
        .eq('status', 'approved')
        .limit(20);

      // Only apply filters if they exist
      if (stableFilters && typeof stableFilters === 'object') {
        if (stableFilters.category) {
          query = query.eq('category', stableFilters.category);
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
  }, [stableFilters]);

  // Use filtersString for stable dependency tracking
  useEffect(() => {
    fetchData();
  }, [filtersString, fetchData]);

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
