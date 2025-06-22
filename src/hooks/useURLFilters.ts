
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DateRange } from 'react-day-picker';

export type SortOption = 'recommended' | 'popularity' | 'distance' | 'price_low' | 'price_high' | 'chronological';

interface Filters {
  categories: string[];
  zone: string;
  period: DateRange | undefined;
  timeSlots?: string[];
  budgets?: string[];
  specialPreferences?: string[];
  sortBy: SortOption;
}

export const useURLFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Funzione per determinare l'ordinamento predefinito basato sui filtri
  const getDefaultSortBy = useCallback((filters: Partial<Filters>): SortOption => {
    // Se c'è un periodo selezionato (eventi per data), ordina cronologicamente
    if (filters.period?.from) {
      return 'chronological';
    }
    
    // Se l'utente sta cercando sulla mappa, ordina per distanza
    // Nota: questa logica sarà implementata quando si integra con la mappa
    
    // Default: popolarità
    return 'popularity';
  }, []);

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

    // Decodifica ordinamento con logica di default
    const urlSortBy = searchParams.get('sortBy') as SortOption;
    const tempFilters = { categories, zone, period, timeSlots, budgets, specialPreferences };
    const defaultSortBy = getDefaultSortBy(tempFilters);
    const sortBy = urlSortBy || defaultSortBy;

    return {
      categories,
      zone,
      period,
      timeSlots,
      budgets,
      specialPreferences,
      sortBy
    };
  }, [searchParams, getDefaultSortBy]);

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

    // Aggiungi ordinamento solo se diverso dal default
    const defaultSortBy = getDefaultSortBy(filters);
    if (filters.sortBy && filters.sortBy !== defaultSortBy) {
      params.set('sortBy', filters.sortBy);
    }

    setSearchParams(params, { replace: true });
  }, [setSearchParams, getDefaultSortBy]);

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

  // Funzione per aggiornare solo l'ordinamento
  const updateSortBy = useCallback((sortBy: SortOption) => {
    const newFilters = { ...filters, sortBy };
    updateFilters(newFilters);
  }, [filters, updateFilters]);

  // Funzione per rimuovere un singolo filtro
  const removeFilter = useCallback((filterType: string, value?: string) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'category':
        if (value) {
          newFilters.categories = newFilters.categories.filter(cat => cat !== value);
          if (newFilters.categories.length === 0) {
            newFilters.categories = ['tutte'];
          }
        }
        break;
      case 'zone':
        newFilters.zone = 'tuttalromagna';
        break;
      case 'period':
        newFilters.period = undefined;
        break;
      case 'timeSlot':
        if (value && newFilters.timeSlots) {
          newFilters.timeSlots = newFilters.timeSlots.filter(slot => slot !== value);
        }
        break;
      case 'budget':
        if (value && newFilters.budgets) {
          newFilters.budgets = newFilters.budgets.filter(budget => budget !== value);
        }
        break;
      case 'specialPreference':
        if (value && newFilters.specialPreferences) {
          newFilters.specialPreferences = newFilters.specialPreferences.filter(pref => pref !== value);
        }
        break;
    }
    
    updateFilters(newFilters);
  }, [filters, updateFilters]);

  return {
    filters,
    updateFilters,
    updateSortBy,
    removeFilter
  };
};
