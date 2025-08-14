
import { useState, useCallback, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebounce } from './useDebounce';
import { FILTERS_CONFIG } from '@/config/filtersConfig';

export interface FiltersState {
  categories: string[];
  period: DateRange | undefined;
}

interface UseFiltersStateOptions {
  onFiltersChange?: (filters: FiltersState) => void;
  debounceMs?: number;
}

export const useFiltersState = (options: UseFiltersStateOptions = {}) => {
  const { onFiltersChange, debounceMs = 300 } = options;

  // Initialize state with default values from config
  const [filters, setFilters] = useState<FiltersState>(() => {
    const initialState: FiltersState = {
      categories: ['tutte'],
      period: undefined
    };
    return initialState;
  });

  // Debounced filters for external callbacks
  const debouncedFilters = useDebounce(filters, debounceMs);

  // Stable update functions
  const updateCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  }, []);


  const updatePeriod = useCallback((period: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, period }));
  }, []);


  const updateFilter = useCallback((key: keyof FiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      categories: ['tutte'],
      period: undefined
    });
  }, []);

  // Active filters summary
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0 && !filters.categories.includes('tutte')) count++;
    if (filters.period?.from) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  // Call external callback when debounced filters change
  useMemo(() => {
    if (onFiltersChange) {
      onFiltersChange(debouncedFilters);
    }
  }, [debouncedFilters, onFiltersChange]);

  return {
    // State
    filters,
    activeFiltersCount,
    hasActiveFilters,
    
    // Actions
    updateCategories,
    updatePeriod,
    updateFilter,
    resetFilters,
    
    // Utils
    debouncedFilters
  };
};
