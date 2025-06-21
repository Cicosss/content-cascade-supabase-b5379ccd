
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DateRange } from 'react-day-picker';

interface Filters {
  categories: string[];
  zone: string;
  period: DateRange | undefined;
  timeSlots?: string[];
  budgets?: string[];
  specialPreferences?: string[];
}

export const useURLFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Funzione per decodificare i filtri dall'URL
  const decodeFiltersFromURL = useCallback((): Filters => {
    const categories = searchParams.get('categories')?.split(',') || ['tutte'];
    const zone = searchParams.get('zone') || 'tuttalromagna';
    const timeSlots = searchParams.get('timeSlots')?.split(',') || [];
    const budgets = searchParams.get('budgets')?.split(',') || [];
    const specialPreferences = searchParams.get('specialPreferences')?.split(',') || [];
    
    // Decodifica del periodo
    let period: DateRange | undefined;
    const periodFrom = searchParams.get('periodFrom');
    const periodTo = searchParams.get('periodTo');
    
    if (periodFrom) {
      period = {
        from: new Date(periodFrom),
        to: periodTo ? new Date(periodTo) : undefined
      };
    }

    return {
      categories,
      zone,
      period,
      timeSlots,
      budgets,
      specialPreferences
    };
  }, [searchParams]);

  // Funzione per codificare i filtri nell'URL
  const encodeFiltersToURL = useCallback((filters: Filters) => {
    const params = new URLSearchParams();

    // Solo aggiungere parametri se diversi dai valori di default
    if (filters.categories.length > 0 && !filters.categories.includes('tutte')) {
      params.set('categories', filters.categories.join(','));
    }
    
    if (filters.zone && filters.zone !== 'tuttalromagna') {
      params.set('zone', filters.zone);
    }
    
    if (filters.period?.from) {
      params.set('periodFrom', filters.period.from.toISOString());
      if (filters.period.to) {
        params.set('periodTo', filters.period.to.toISOString());
      }
    }
    
    if (filters.timeSlots && filters.timeSlots.length > 0) {
      params.set('timeSlots', filters.timeSlots.join(','));
    }
    
    if (filters.budgets && filters.budgets.length > 0) {
      params.set('budgets', filters.budgets.join(','));
    }
    
    if (filters.specialPreferences && filters.specialPreferences.length > 0) {
      params.set('specialPreferences', filters.specialPreferences.join(','));
    }

    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Inizializza i filtri dall'URL al primo caricamento
  const [filters, setFilters] = useState<Filters>(() => decodeFiltersFromURL());

  // Aggiorna i filtri quando cambiano i parametri URL (navigazione avanti/indietro)
  useEffect(() => {
    const urlFilters = decodeFiltersFromURL();
    setFilters(urlFilters);
  }, [decodeFiltersFromURL]);

  // Funzione per aggiornare i filtri e sincronizzarli con l'URL
  const updateFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    encodeFiltersToURL(newFilters);
  }, [encodeFiltersToURL]);

  return {
    filters,
    updateFilters
  };
};
