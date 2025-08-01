
import { useState, useCallback, useRef, useEffect } from 'react';
import { POI, POIFilters } from '@/types/poi';
import { useOptimizedPOIData } from './useOptimizedPOIData';
import { useToast } from './use-toast';

interface UsePOIFetchManagerProps {
  initialFilters: POIFilters;
}

export const usePOIFetchManager = ({ initialFilters }: UsePOIFetchManagerProps) => {
  const [isCircuitBreakerOpen, setIsCircuitBreakerOpen] = useState(false);
  
  // Safety timeout to prevent stuck loading states
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchCountRef = useRef(0);
  const lastFetchTimeRef = useRef(0);
  const circuitBreakerTimeoutRef = useRef<NodeJS.Timeout>();
  const lastFiltersHashRef = useRef<string>('');
  
  const { pois, fetchPOIs, isLoading, error } = useOptimizedPOIData();
  const { toast } = useToast();

  // Optimized circuit breaker parameters for interactive maps
  const MAX_FETCHES_PER_MINUTE = 30; // Increased from 10 to 30
  const CIRCUIT_BREAKER_TIMEOUT = 15000; // Reduced from 30 to 15 seconds
  const MIN_FETCH_INTERVAL = 1000; // Reduced from 2000 to 1000ms

  const generateFiltersHash = useCallback((filters: POIFilters): string => {
    // Create stable hash ignoring micro-changes in bounds
    const stableFilters = {
      ...filters,
      bounds: filters.bounds ? {
        north: Math.round(filters.bounds.north * 1000) / 1000, // 3 decimal precision
        south: Math.round(filters.bounds.south * 1000) / 1000,
        east: Math.round(filters.bounds.east * 1000) / 1000,
        west: Math.round(filters.bounds.west * 1000) / 1000
      } : null
    };
    
    return JSON.stringify(stableFilters);
  }, []);

  const shouldPreventFetch = useCallback((filters: POIFilters): boolean => {
    const now = Date.now();
    const filtersHash = generateFiltersHash(filters);
    
    // Circuit breaker check
    if (isCircuitBreakerOpen) {
      console.log('🚫 Circuit breaker is open, preventing fetch');
      return true;
    }

    // Same filters check
    if (filtersHash === lastFiltersHashRef.current) {
      console.log('🔄 Same filters hash, skipping fetch');
      return true;
    }

    // Rate limiting check with optimized interval
    if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      console.log('⏱️ Rate limit: too soon since last fetch');
      return true;
    }

    // Fetch frequency check
    const oneMinuteAgo = now - 60000;
    if (fetchCountRef.current > MAX_FETCHES_PER_MINUTE) {
      console.log('🚫 Too many fetches, opening circuit breaker');
      setIsCircuitBreakerOpen(true);
      
      toast({
        title: "Sistema di protezione attivato",
        description: "Troppi aggiornamenti della mappa. Pausa di 30 secondi.",
        variant: "destructive",
      });

      circuitBreakerTimeoutRef.current = setTimeout(() => {
        setIsCircuitBreakerOpen(false);
        fetchCountRef.current = 0;
        console.log('✅ Circuit breaker reset');
      }, CIRCUIT_BREAKER_TIMEOUT);

      return true;
    }

    return false;
  }, [isCircuitBreakerOpen, generateFiltersHash, toast]);

  const managedFetchPOIs = useCallback(async (filters: POIFilters) => {
    if (shouldPreventFetch(filters)) {
      console.log('🚫 Fetch prevented by circuit breaker or rate limiting');
      return;
    }

    // Clear any existing loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    // Set safety timeout to reset loading state after 10 seconds
    loadingTimeoutRef.current = setTimeout(() => {
      console.warn('⏰ Loading timeout triggered - forcing circuit breaker');
      setIsCircuitBreakerOpen(true);
    }, 10000);

    const now = Date.now();
    const filtersHash = generateFiltersHash(filters);
    
    console.log('🔍 Managed POI fetch:', { 
      filters, 
      hash: filtersHash.substring(0, 8),
      fetchCount: fetchCountRef.current + 1
    });

    // Update tracking variables
    lastFetchTimeRef.current = now;
    lastFiltersHashRef.current = filtersHash;
    fetchCountRef.current++;

    // Reset fetch count every minute
    setTimeout(() => {
      if (fetchCountRef.current > 0) {
        fetchCountRef.current--;
      }
    }, 60000);

    try {
      await fetchPOIs(filters);
    } catch (error) {
      console.error('❌ Managed fetch error:', error);
    } finally {
      // Clear the safety timeout on completion
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }
  }, [shouldPreventFetch, generateFiltersHash, fetchPOIs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (circuitBreakerTimeoutRef.current) {
        clearTimeout(circuitBreakerTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return {
    pois,
    fetchPOIs: managedFetchPOIs,
    isLoading,
    error,
    isCircuitBreakerOpen
  };
};
