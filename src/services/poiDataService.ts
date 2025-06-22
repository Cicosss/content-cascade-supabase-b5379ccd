
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, endOfDay } from 'date-fns';
import { POI, POIFilters } from '@/types/poi';
import { getCategoriesForFilters } from '@/utils/poiCategoryMapping';

export class POIDataService {
  async fetchStandardPOIs(filters: POIFilters): Promise<POI[]> {
    console.log('🔍 POIDataService: Starting fetchStandardPOIs with filters:', filters);
    
    // Fetch from points_of_interest only (single source of truth)
    let query = supabase
      .from('points_of_interest')
      .select('id, name, description, macro_area, category, latitude, longitude, address, target_audience, images, price_info, avg_rating')
      .eq('status', 'approved');

    // Apply category filters ONLY if specific categories are selected (not "tutto")
    const hasSpecificCategories = filters.activityTypes.length > 0 && 
                                 !filters.activityTypes.includes('tutto') && 
                                 !filters.activityTypes.includes('tutte');
    
    if (hasSpecificCategories) {
      const categories = getCategoriesForFilters(filters.activityTypes);
      console.log('🎯 Applying category filter:', categories);
      if (categories.length > 0) {
        query = query.in('category', categories);
      }
    } else {
      console.log('🌍 No category filters applied - showing all POIs');
    }

    // Apply children filter
    if (filters.withChildren === 'si') {
      console.log('👨‍👩‍👧‍👦 Applying family filter');
      query = query.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    // Apply period filter
    if (filters.period?.from) {
      const startDate = startOfDay(filters.period.from);
      const endDate = filters.period.to ? endOfDay(filters.period.to) : endOfDay(filters.period.from);
      
      console.log('📅 Applying date filter:', { startDate, endDate });
      query = query.or(
        `start_datetime.is.null,start_datetime.lte.${endDate.toISOString()},end_datetime.gte.${startDate.toISOString()}`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('📊 Raw data from database:', data?.length || 0, 'POIs');
    
    const transformedData = this.transformPOIs(data || []);
    
    console.log('✅ Transformed POIs:', transformedData.length);
    transformedData.forEach(poi => {
      console.log(`📍 POI: ${poi.name} - Category: ${poi.category} - Coords: ${poi.latitude}, ${poi.longitude}`);
    });
    
    return transformedData;
  }

  // Unified method - no longer separate logic
  async fetchApprovedPOIs(filters: POIFilters): Promise<POI[]> {
    return [];
  }

  private transformPOIs(data: any[]): POI[] {
    return data.map(poi => {
      const latitude = Number(poi.latitude);
      const longitude = Number(poi.longitude);
      
      // Validate coordinates
      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn(`⚠️ Invalid coordinates for POI ${poi.name}: lat=${poi.latitude}, lng=${poi.longitude}`);
      }
      
      return {
        id: poi.id,
        name: poi.name,
        description: poi.description || '',
        macro_area: poi.macro_area,
        category: poi.category,
        latitude: latitude || 44.0646, // Fallback to Rimini center
        longitude: longitude || 12.5736, // Fallback to Rimini center
        address: poi.address || '',
        target_audience: poi.target_audience || 'everyone',
        images: poi.images || [],
        price_info: poi.price_info,
        avg_rating: poi.avg_rating || 0
      };
    });
  }

  logResults(filters: POIFilters, standardCount: number, approvedCount: number, totalCount: number): void {
    const periodText = filters.period?.from && filters.period?.to 
      ? `dal ${format(filters.period.from, 'PPP')} al ${format(filters.period.to, 'PPP')}`
      : filters.period?.from 
        ? `dal ${format(filters.period.from, 'PPP')}`
        : 'Nessun periodo';

    const message = filters.period?.from 
      ? `✅ POI caricati per periodo ${periodText}: ${totalCount}`
      : `✅ POI caricati: ${totalCount}`;
      
    console.log(message);
  }
}
