import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { POIFilters } from '@/types/poi';

interface MapFiltersState {
  activeFilters: POIFilters;
  searchQuery: string;
  filterHistory: POIFilters[];
}

interface MapFiltersContextType extends MapFiltersState {
  setActiveFilters: (filters: POIFilters) => void;
  updateFilter: (key: keyof POIFilters, value: any) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  restoreFromHistory: (index: number) => void;
  addToHistory: (filters: POIFilters) => void;
}

const MapFiltersContext = createContext<MapFiltersContextType | undefined>(undefined);

interface MapFiltersProviderProps {
  children: ReactNode;
  initialFilters?: Partial<POIFilters>;
}

export const MapFiltersProvider: React.FC<MapFiltersProviderProps> = ({ 
  children, 
  initialFilters = {} 
}) => {
  const defaultFilters: POIFilters = {
    activityTypes: [],
    withChildren: 'no',
    bounds: null,
    ...initialFilters
  };

  const [activeFilters, setActiveFiltersState] = useState<POIFilters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterHistory, setFilterHistory] = useState<POIFilters[]>([defaultFilters]);

  const setActiveFilters = useCallback((filters: POIFilters) => {
    setActiveFiltersState(filters);
    addToHistory(filters);
  }, []);

  const updateFilter = useCallback((key: keyof POIFilters, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
  }, [activeFilters, setActiveFilters]);

  const clearFilters = useCallback(() => {
    setActiveFilters(defaultFilters);
    setSearchQuery('');
  }, [setActiveFilters]);

  const restoreFromHistory = useCallback((index: number) => {
    if (index >= 0 && index < filterHistory.length) {
      setActiveFiltersState(filterHistory[index]);
    }
  }, [filterHistory]);

  const addToHistory = useCallback((filters: POIFilters) => {
    setFilterHistory(prev => {
      const newHistory = [filters, ...prev.filter(f => 
        JSON.stringify(f) !== JSON.stringify(filters)
      )];
      return newHistory.slice(0, 10); // Keep last 10 entries
    });
  }, []);

  const value: MapFiltersContextType = {
    activeFilters,
    searchQuery,
    filterHistory,
    setActiveFilters,
    updateFilter,
    setSearchQuery,
    clearFilters,
    restoreFromHistory,
    addToHistory,
  };

  return (
    <MapFiltersContext.Provider value={value}>
      {children}
    </MapFiltersContext.Provider>
  );
};

export const useMapFilters = (): MapFiltersContextType => {
  const context = useContext(MapFiltersContext);
  if (context === undefined) {
    throw new Error('useMapFilters must be used within a MapFiltersProvider');
  }
  return context;
};