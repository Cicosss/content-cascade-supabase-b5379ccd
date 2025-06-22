
import { useState, useEffect } from 'react';
import { POISubmission } from './POISubmission';

interface Filters {
  status: string;
  category: string;
  macroArea: string;
  searchTerm: string;
}

export const useSubmissionFilters = (submissions: POISubmission[]) => {
  const [filteredSubmissions, setFilteredSubmissions] = useState<POISubmission[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: 'tutti',
    category: 'tutti',
    macroArea: 'tutti',
    searchTerm: ''
  });

  const applyFilters = () => {
    let filtered = [...submissions];

    if (filters.status !== 'tutti') {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }

    if (filters.category !== 'tutti') {
      filtered = filtered.filter(sub => sub.category === filters.category);
    }

    if (filters.macroArea !== 'tutti') {
      filtered = filtered.filter(sub => sub.macro_area === filters.macroArea);
    }

    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.name.toLowerCase().includes(searchLower) ||
        (sub.description && sub.description.toLowerCase().includes(searchLower)) ||
        sub.submitter_email.toLowerCase().includes(searchLower) ||
        (sub.address && sub.address.toLowerCase().includes(searchLower))
      );
    }

    setFilteredSubmissions(filtered);
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.status !== 'tutti') activeFilters.push(`Status: ${filters.status}`);
    if (filters.category !== 'tutti') activeFilters.push(`Categoria: ${filters.category}`);
    if (filters.macroArea !== 'tutti') activeFilters.push(`Macro-Area: ${filters.macroArea}`);
    if (filters.searchTerm) activeFilters.push(`Ricerca: "${filters.searchTerm}"`);
    
    return activeFilters.length > 0 ? activeFilters.join(' • ') : 'Nessun filtro attivo';
  };

  useEffect(() => {
    applyFilters();
  }, [submissions, filters]);

  return {
    filteredSubmissions,
    filters,
    setFilters,
    getFilterSummary
  };
};
