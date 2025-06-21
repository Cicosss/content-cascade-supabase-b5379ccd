
import { useState, useEffect } from 'react';

interface Filters {
  status: string;
  category: string;
  macroArea: string;
  searchTerm: string;
  poiType: string;
}

export const useExperienceFilters = (onFiltersChange: (filters: Filters) => void) => {
  const [filters, setFilters] = useState<Filters>({
    status: 'tutti',
    category: 'tutti',
    macroArea: 'tutti',
    searchTerm: '',
    poiType: 'tutti'
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.status !== 'tutti') activeFilters.push(`Status: ${filters.status}`);
    if (filters.category !== 'tutti') activeFilters.push(`Categoria: ${filters.category}`);
    if (filters.macroArea !== 'tutti') activeFilters.push(`Macro-Area: ${filters.macroArea}`);
    if (filters.poiType !== 'tutti') activeFilters.push(`Tipo: ${filters.poiType === 'place' ? 'Luoghi' : 'Eventi'}`);
    if (filters.searchTerm) activeFilters.push(`Ricerca: "${filters.searchTerm}"`);
    
    return activeFilters.length > 0 ? activeFilters.join(' • ') : 'Nessun filtro attivo';
  };

  return {
    filters,
    setFilters,
    getFilterSummary
  };
};
