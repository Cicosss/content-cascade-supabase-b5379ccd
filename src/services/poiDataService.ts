
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, endOfDay } from 'date-fns';
import { POI, POIFilters } from '@/types/poi';
import { getCategoriesForFilters } from '@/utils/poiCategoryMapping';

export class POIDataService {
  async fetchStandardPOIs(filters: POIFilters): Promise<POI[]> {
    console.log('🔍 POIDataService: Inizio fetchStandardPOIs con filtri:', filters);
    
    // Fetch from points_of_interest only (single source of truth)
    let query = supabase
      .from('points_of_interest')
      .select('id, name, description, category, latitude, longitude, address, target_audience, images, price_info, avg_rating')
      .eq('status', 'approved');

    // Apply category filters SOLO se sono specificati filtri specifici
    const hasSpecificCategories = filters.activityTypes.length > 0;
    
    if (hasSpecificCategories) {
      const categories = getCategoriesForFilters(filters.activityTypes);
      console.log('🎯 Applicando filtro categorie:', categories);
      if (categories.length > 0) {
        query = query.in('category', categories);
      }
    } else {
      console.log('🌍 Nessun filtro categorie - mostrando TUTTI i POI approvati');
    }

    // Apply zone filter solo se specificata
    if (filters.zone && filters.zone !== '') {
      console.log('📍 Applicando filtro zona:', filters.zone);
      // Assumiamo che ci sia un campo 'zone' o 'macro_area' per filtrare per zona
      // Se non esiste, questo filtro non avrà effetto
    }

    // Apply children filter
    if (filters.withChildren === 'si') {
      console.log('👨‍👩‍👧‍👦 Applicando filtro famiglia');
      query = query.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    // Apply period filter
    if (filters.period?.from) {
      const startDate = startOfDay(filters.period.from);
      const endDate = filters.period.to ? endOfDay(filters.period.to) : endOfDay(filters.period.from);
      
      console.log('📅 Applicando filtro data:', { startDate, endDate });
      query = query.or(
        `start_datetime.is.null,start_datetime.lte.${endDate.toISOString()},end_datetime.gte.${startDate.toISOString()}`
      );
    }

    console.log('🔍 Eseguendo query al database...');
    const { data, error } = await query;

    if (error) {
      console.error('❌ Errore database:', error);
      throw error;
    }

    console.log('📊 Dati grezzi dal database:', data?.length || 0, 'POI');
    console.log('📊 Primi 3 POI grezzi:', data?.slice(0, 3) || []);
    
    const transformedData = this.transformPOIs(data || []);
    
    console.log('✅ POI trasformati:', transformedData.length);
    transformedData.forEach((poi, index) => {
      if (index < 5) { // Log solo i primi 5 per non intasare
        console.log(`📍 POI ${index + 1}: ${poi.name} - Cat: ${poi.category} - Coords: ${poi.latitude}, ${poi.longitude}`);
      }
    });
    
    return transformedData;
  }

  // Unified method - no longer separate logic
  async fetchApprovedPOIs(filters: POIFilters): Promise<POI[]> {
    return [];
  }

  private transformPOIs(data: any[]): POI[] {
    console.log('🔄 Trasformando', data.length, 'POI dal database');
    
    return data.map((poi, index) => {
      const latitude = Number(poi.latitude);
      const longitude = Number(poi.longitude);
      
      // Validate coordinates with detailed logging
      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn(`⚠️ POI ${index + 1} (${poi.name}) - Coordinate non valide:`, {
          originalLat: poi.latitude,
          originalLng: poi.longitude,
          convertedLat: latitude,
          convertedLng: longitude
        });
      } else {
        console.log(`✅ POI ${index + 1} (${poi.name}) - Coordinate valide:`, { latitude, longitude });
      }
      
      const transformedPOI = {
        id: poi.id,
        name: poi.name,
        description: poi.description || '',
        category: poi.category,
        latitude: !isNaN(latitude) ? latitude : 44.0646, // Fallback to Rimini center
        longitude: !isNaN(longitude) ? longitude : 12.5736, // Fallback to Rimini center
        address: poi.address || '',
        target_audience: poi.target_audience || 'everyone',
        images: poi.images || [],
        price_info: poi.price_info,
        avg_rating: poi.avg_rating || 0
      };

      // Log coordinate fallback usage
      if (isNaN(Number(poi.latitude)) || isNaN(Number(poi.longitude))) {
        console.warn(`🔄 Usato fallback coordinate per POI: ${poi.name}`);
      }

      return transformedPOI;
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
    console.log('🔍 Riepilogo filtri applicati:', {
      categorie: filters.activityTypes.length > 0 ? filters.activityTypes : 'Tutte',
      zona: filters.zone || 'Tutte',
      bambini: filters.withChildren,
      periodo: periodText
    });
  }
}
