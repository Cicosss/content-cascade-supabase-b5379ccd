import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, endOfDay } from 'date-fns';
import { POI, POIFilters } from '@/types/poi';
import { getCategoriesForFilters } from '@/utils/poiCategoryMapping';

export class POIDataService {
  async fetchStandardPOIs(filters: POIFilters): Promise<POI[]> {
    console.log('🗺️ POIDataService: Fetching POIs with filters:', filters);
    
    // Unified approach: fetch from points_of_interest only (single source of truth)
    let query = supabase
      .from('points_of_interest')
      .select('id, name, description, macro_area, category, latitude, longitude, address, target_audience, images, price_info, avg_rating')
      .eq('status', 'approved'); // Only approved POIs

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
      console.error('❌ Errore nel caricamento POI:', error);
      return [];
    }

    const transformedData = this.transformPOIs(data || []);
    console.log('🗺️ POIDataService: POIs retrieved:', transformedData.length, transformedData);
    
    // Debug specifico per Trattoria Gina
    const trattoriaGina = transformedData.find(poi => 
      poi.name?.toLowerCase().includes('trattoria gina') || 
      poi.id === 'f1ade38a-31eb-4586-ab71-589213826edb'
    );
    console.log('🍝 POIDataService: Trattoria Gina in results?', trattoriaGina);
    
    return transformedData;
  }

  // Remove the separate fetchApprovedPOIs method since we're using unified approach
  async fetchApprovedPOIs(filters: POIFilters): Promise<POI[]> {
    // This method is now deprecated - use fetchStandardPOIs instead
    console.log('⚠️ fetchApprovedPOIs is deprecated, using unified fetchStandardPOIs');
    return this.fetchStandardPOIs(filters);
  }

  private transformPOIs(data: any[]): POI[] {
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
      avg_rating: poi.avg_rating || 0
    }));
  }

  // Keep the old method names for backward compatibility but simplify the logic
  private transformStandardPOIs(data: any[]): POI[] {
    return this.transformPOIs(data);
  }

  private transformApprovedPOIs(data: any[]): POI[] {
    return this.transformPOIs(data);
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
    
    console.log(message);
    console.log('🗺️ POIDataService: RISULTATI FINALI - Totale POI:', totalCount);
  }
}
