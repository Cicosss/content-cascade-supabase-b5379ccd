import { useRef, useMemo, useCallback } from 'react';
import { useDebounceCallback } from './useDebounceCallback';

/**
 * Hook per gestire filtri stabili e prevenire loop infiniti
 * Utilizza hash stabili invece di JSON.stringify e debouncing
 */
export function useStableFilters<T extends Record<string, any>>(
  filters: T,
  debounceMs: number = 500
) {
  const previousHashRef = useRef<string>('');
  const stableFiltersRef = useRef<T>(filters);

  // Genera hash stabile per i filtri ordinando le chiavi
  const generateStableHash = useCallback((obj: T): string => {
    if (!obj || typeof obj !== 'object') return '';
    
    const sortedKeys = Object.keys(obj).sort();
    const pairs = sortedKeys.map(key => {
      const value = obj[key];
      let serializedValue: string;
      
      if (Array.isArray(value)) {
        serializedValue = value.sort().join(',');
      } else if (value && typeof value === 'object') {
        serializedValue = generateStableHash(value);
      } else {
        serializedValue = String(value ?? '');
      }
      
      return `${key}:${serializedValue}`;
    });
    
    return pairs.join('|');
  }, []);

  // Memoizza l'hash corrente
  const currentHash = useMemo(() => {
    return generateStableHash(filters);
  }, [filters, generateStableHash]);

  // Callback debouncato per aggiornare i filtri stabili
  const updateStableFilters = useDebounceCallback((newFilters: T) => {
    stableFiltersRef.current = newFilters;
  }, debounceMs);

  // Aggiorna filtri stabili solo se l'hash è cambiato
  const hasChanged = currentHash !== previousHashRef.current;
  
  if (hasChanged) {
    previousHashRef.current = currentHash;
    updateStableFilters(filters);
  }

  // Filtri stabilizzati e informazioni di debug
  const stableFilters = useMemo(() => stableFiltersRef.current, [currentHash]);
  
  return {
    stableFilters,
    hasChanged,
    hash: currentHash,
    isDebouncing: hasChanged
  };
}

/**
 * Hook specializzato per filtri di caroselli
 */
export function useCarouselFilters<T extends Record<string, any>>(
  filters: T,
  carouselType: string
) {
  const { stableFilters, hasChanged, hash } = useStableFilters(filters, 300);
  
  // Log solo quando i filtri cambiano realmente
  if (hasChanged) {
    console.log(`🎠 ${carouselType} filters updated:`, { 
      filters: stableFilters, 
      hash: hash.substring(0, 8) 
    });
  }
  
  return stableFilters;
}

/**
 * Hook per filtri di mappa con debouncing più lungo
 */
export function useMapFilters<T extends Record<string, any>>(
  filters: T,
  bounds?: any
) {
  const filtersWithBounds = useMemo(() => ({
    ...filters,
    bounds: bounds ? {
      north: bounds.north,
      south: bounds.south,
      east: bounds.east,
      west: bounds.west
    } : null
  }), [filters, bounds]);

  const { stableFilters, hasChanged } = useStableFilters(filtersWithBounds, 800);
  
  if (hasChanged) {
    console.log('🗺️ Map filters updated:', { 
      filters: stableFilters,
      hasBounds: !!bounds 
    });
  }
  
  return stableFilters;
}