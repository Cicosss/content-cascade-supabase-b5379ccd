
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

export const useApprovedPOIs = () => {
  const fetchApprovedPOIs = async (filters: Filters) => {
    let approvedQuery = supabase
      .from('poi_submissions')
      .select('*')
      .eq('status', 'approved');

    // Apply the same filters to approved POIs
    if (filters.activityTypes && !filters.activityTypes.includes('tutto')) {
      const categoriesForFilter = getCategoriesForFilters(filters.activityTypes);
      if (categoriesForFilter.length > 0) {
        approvedQuery = approvedQuery.in('category', categoriesForFilter);
      }
    }

    if (filters.withChildren === 'si') {
      approvedQuery = approvedQuery.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    if (filters.period?.from) {
      const startDate = startOfDay(filters.period.from);
      const endDate = filters.period.to ? endOfDay(filters.period.to) : endOfDay(filters.period.from);
      
      approvedQuery = approvedQuery.or(
        `start_datetime.is.null,start_datetime.lte.${endDate.toISOString()},end_datetime.gte.${startDate.toISOString()}`
      );
    }

    const { data, error } = await approvedQuery;

    if (error) {
      console.error('❌ Errore nel caricamento POI approvate:', error);
      return [];
    }

    return data || [];
  };

  return { fetchApprovedPOIs };
};
