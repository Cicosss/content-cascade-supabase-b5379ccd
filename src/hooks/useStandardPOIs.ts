
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { getCategoriesForFilters } from '@/utils/categoryMapping';

interface Filters {
  activityTypes: string[];
  zone: string;
  withChildren: string;
  period?: DateRange;
}

export const useStandardPOIs = () => {
  const fetchStandardPOIs = async (filters: Filters) => {
    let query = supabase
      .from('points_of_interest')
      .select('*');

    // Filter by category if not "tutto"
    if (filters.activityTypes && !filters.activityTypes.includes('tutto')) {
      const categoriesForFilter = getCategoriesForFilters(filters.activityTypes);
      if (categoriesForFilter.length > 0) {
        query = query.in('category', categoriesForFilter);
      }
    }

    // Filter by target audience if withChildren is specified
    if (filters.withChildren === 'si') {
      query = query.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    // Filter by period if specified
    if (filters.period?.from) {
      const startDate = startOfDay(filters.period.from);
      const endDate = filters.period.to ? endOfDay(filters.period.to) : endOfDay(filters.period.from);
      
      query = query.or(
        `start_datetime.is.null,start_datetime.lte.${endDate.toISOString()},end_datetime.gte.${startDate.toISOString()}`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Errore nel caricamento POI standard:', error);
      return [];
    }

    return data || [];
  };

  return { fetchStandardPOIs };
};
