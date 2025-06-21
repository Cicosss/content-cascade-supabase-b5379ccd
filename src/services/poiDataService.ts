
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, endOfDay } from 'date-fns';
import { POI, POIFilters } from '@/types/poi';
import { getCategoriesForFilters } from '@/utils/poiCategoryMapping';

export class POIDataService {
  async fetchStandardPOIs(filters: POIFilters): Promise<POI[]> {
    let query = supabase
      .from('points_of_interest')
      .select('id, name, description, macro_area, category, latitude, longitude, address, target_audience, images, price_info, avg_rating');

    // Apply category filters
    const categories = getCategoriesForFilters(filters.activityTypes);
    if (categories.length > 0) {
      query = query.in('category', categories);
    }

    // Apply children filter
    if (filters.withChildren === 'si') {
      query = query.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    // Apply period filter
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

    return this.transformStandardPOIs(data || []);
  }

  async fetchApprovedPOIs(filters: POIFilters): Promise<POI[]> {
    let query = supabase
      .from('poi_submissions')
      .select('id, name, description, macro_area, category, latitude, longitude, address, target_audience, images, price_info')
      .eq('status', 'approved');

    // Apply the same filters as standard POIs
    const categories = getCategoriesForFilters(filters.activityTypes);
    if (categories.length > 0) {
      query = query.in('category', categories);
    }

    if (filters.withChildren === 'si') {
      query = query.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    if (filters.period?.from) {
      const startDate = startOfDay(filters.period.from);
      const endDate = filters.period.to ? endOfDay(filters.period.to) : endOfDay(filters.period.from);
      
      query = query.or(
        `start_datetime.is.null,start_datetime.lte.${endDate.toISOString()},end_datetime.gte.${startDate.toISOString()}`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Errore nel caricamento POI approvate:', error);
      return [];
    }

    return this.transformApprovedPOIs(data || []);
  }

  private transformStandardPOIs(data: any[]): POI[] {
    return data.map(poi => ({
      id: poi.id,
      name: poi.name,
      description: poi.description || '',
      macro_area: poi.macro_area,
      category: poi.category,
      latitude: poi.latitude || 44.0646,
      longitude: poi.longitude || 12.5736,
      address: poi.address || '',
      target_audience: poi.target_audience || 'everyone',
      images: poi.images || [],
      price_info: poi.price_info,
      avg_rating: poi.avg_rating
    }));
  }

  private transformApprovedPOIs(data: any[]): POI[] {
    return data.map(poi => ({
      id: poi.id,
      name: poi.name,
      description: poi.description || '',
      macro_area: poi.macro_area,
      category: poi.category,
      latitude: poi.latitude || 44.0646,
      longitude: poi.longitude || 12.5736,
      address: poi.address || '',
      target_audience: poi.target_audience || 'everyone',
      images: poi.images || [],
      price_info: poi.price_info,
      avg_rating: 0
    }));
  }

  logResults(filters: POIFilters, standardCount: number, approvedCount: number, totalCount: number): void {
    const periodText = filters.period?.from && filters.period?.to 
      ? `dal ${format(filters.period.from, 'PPP')} al ${format(filters.period.to, 'PPP')}`
      : filters.period?.from 
        ? `dal ${format(filters.period.from, 'PPP')}`
        : 'Nessun periodo';

    console.log('🗺️ Caricamento POI dal database con filtri:', {
      ...filters,
      period: periodText
    });

    const message = filters.period?.from 
      ? `✅ POI caricati per periodo ${periodText}: ${totalCount}`
      : `✅ POI caricati: ${totalCount}`;
    
    console.log(message, '(Standard:', standardCount, ', Approvate:', approvedCount, ')');
  }
}
