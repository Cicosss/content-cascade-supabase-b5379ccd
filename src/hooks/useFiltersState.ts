
import { useState, useCallback, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebounce } from './useDebounce';
import { FILTERS_CONFIG } from '@/config/filtersConfig';

export interface FiltersState {
  categories: string[];
  period: DateRange | undefined;
  timeSlots: string[];
  budgets: string[];
  specialPreferences: string[];
}

interface UseFiltersStateOptions {
  onFiltersChange?: (filters: FiltersState) => void;
  debounceMs?: number;
}

export const useFiltersState = (options: UseFiltersStateOptions = {}) => {
  const { onFiltersChange, debounceMs = 500 } = options;

  // Initialize state with default values from config
  const [filters, setFilters] = useState<FiltersState>(() => {
    const initialState: FiltersState = {
      categories: ['tutte'],
      period: undefined,
      timeSlots: [],
      budgets: [],
      specialPreferences: []
    };
    return initialState;
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced filters for external callbacks
  const debouncedFilters = useDebounce(filters, debounceMs);

  // Stable update functions
  const updateCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  }, []);


  const updatePeriod = useCallback((period: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, period }));
  }, []);

  const updateTimeSlots = useCallback((timeSlots: string[]) => {
    setFilters(prev => ({ ...prev, timeSlots }));
  }, []);

  const updateBudgets = useCallback((budgets: string[]) => {
    setFilters(prev => ({ ...prev, budgets }));
  }, []);

  const updateSpecialPreferences = useCallback((specialPreferences: string[]) => {
    setFilters(prev => ({ ...prev, specialPreferences }));
  }, []);

  const updateFilter = useCallback((key: keyof FiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      categories: ['tutte'],
      period: undefined,
      timeSlots: [],
      budgets: [],
      specialPreferences: []
    });
  }, []);

  const toggleAdvanced = useCallback((show?: boolean) => {
    setShowAdvanced(prev => show !== undefined ? show : !prev);
  }, []);

  // Active filters summary
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0 && !filters.categories.includes('tutte')) count++;
    if (filters.period?.from) count++;
    if (filters.timeSlots.length > 0) count++;
    if (filters.budgets.length > 0) count++;
    if (filters.specialPreferences.length > 0) count++;
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
    showAdvanced,
    activeFiltersCount,
    hasActiveFilters,
    
    // Actions
    updateCategories,
    updatePeriod,
    updateTimeSlots,
    updateBudgets,
    updateSpecialPreferences,
    updateFilter,
    resetFilters,
    toggleAdvanced,
    
    // Utils
    debouncedFilters
  };
};
