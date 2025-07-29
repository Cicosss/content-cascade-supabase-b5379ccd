import { supabase } from '@/integrations/supabase/client';
import { apiClient } from './apiClient';
import { 
  CarouselPOI, 
  EventCarouselData, 
  RestaurantCarouselData, 
  ExperienceCarouselData,
  EventFilters,
  RestaurantFilters,
  ExperienceFilters,
  CacheStrategy,
  CarouselMetrics,
  CarouselError
} from '@/types/carousel';
import { RequestConfig, APIErrorType } from '@/types/api';

// Cache strategies per type
const CACHE_STRATEGIES: Record<string, CacheStrategy> = {
  events: { 
    ttl: 300000, // 5 minutes
    priority: 'high',
    invalidation_triggers: ['event_update', 'time_change'],
    max_age_stale: 600000 // 10 minutes stale allowed
  },
  restaurants: { 
    ttl: 900000, // 15 minutes
    priority: 'medium',
    invalidation_triggers: ['menu_update', 'hours_change'],
    max_age_stale: 1800000 // 30 minutes stale allowed
  },
  experiences: { 
    ttl: 1800000, // 30 minutes
    priority: 'low',
    invalidation_triggers: ['content_update', 'seasonal_change'],
    max_age_stale: 3600000 // 1 hour stale allowed
  }
};

export class CarouselAPIService {
  private metricsCollector = new Map<string, CarouselMetrics>();

  /**
   * Unified method to fetch POIs by type with enhanced error handling and caching
   */
  private async fetchPOIsByType<T>(
    poiType: 'event' | 'place', 
    transformFn: (data: any[]) => T[],
    category?: string,
    filters: any = {}
  ): Promise<T[]> {
    const startTime = Date.now();
    const cacheKey = `carousel-poi-${poiType}-${category || 'all'}-${JSON.stringify(filters)}`;
    
    try {
      const response = await apiClient.request(
        async () => this.executePOIQuery(poiType, category, filters),
        this.getRequestConfig(poiType === 'event' ? 'events' : 'experiences'),
        cacheKey
      );

      this.recordMetrics(poiType, startTime, true, response.cached || false);
      return transformFn(response.data);
    } catch (error) {
      this.recordMetrics(poiType, startTime, false, false);
      throw this.normalizeCarouselError(error, poiType);
    }
  }

  /**
   * Fetch events using unified POI method
   */
  async fetchEvents(filters: EventFilters = {}): Promise<EventCarouselData[]> {
    return this.fetchPOIsByType('event', this.transformEventData.bind(this), filters.category, filters);
  }

  /**
   * Fetch restaurants using unified POI method
   */
  async fetchRestaurants(filters: RestaurantFilters = {}): Promise<RestaurantCarouselData[]> {
    return this.fetchPOIsByType('place', this.transformRestaurantData.bind(this), 'Ristoranti', filters);
  }

  /**
   * Fetch experiences using unified POI method
   */
  async fetchExperiences(filters: ExperienceFilters = {}): Promise<ExperienceCarouselData[]> {
    // If section_categories is provided, fetch all places and filter by categories
    if (filters.section_categories && filters.section_categories.length > 0) {
      return this.fetchPOIsByType('place', this.transformExperienceData.bind(this), null, filters);
    }
    return this.fetchPOIsByType('place', this.transformExperienceData.bind(this), undefined, filters);
  }

  /**
   * Unified POI query execution
   */
  private async executePOIQuery(
    poiType: 'event' | 'place', 
    category?: string | null, 
    filters: any = {}
  ): Promise<any[]> {
    let query = supabase
      .from('points_of_interest')
      .select('*')
      .eq('poi_type', poiType)
      .eq('status', 'approved')
      .limit(8);

    // Apply category filter
    if (category) {
      query = query.eq('category', category);
    } else if (poiType === 'place' && !category) {
      // Check if we have section_categories filter
      if (filters.section_categories && filters.section_categories.length > 0) {
        query = query.in('category', filters.section_categories);
      } else {
        // For general experiences, exclude restaurants
        query = query.neq('category', 'Ristoranti');
      }
    }

    // Apply type-specific filters
    if (poiType === 'event') {
      query = query.gte('start_datetime', new Date().toISOString())
                  .order('start_datetime', { ascending: true });
      
      if (filters.date_range) {
        query = query
          .gte('start_datetime', filters.date_range.start.toISOString())
          .lte('start_datetime', filters.date_range.end.toISOString());
      }
    } else {
      query = query.order('priority_score', { ascending: false });
      
      if (filters.with_children) {
        query = query.or('target_audience.eq.families,target_audience.eq.everyone');
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Transform event data with additional metadata
   */
  private transformEventData(data: any[]): EventCarouselData[] {
    return data.map(event => ({
      ...event,
      event_status: this.getEventStatus(event),
      tickets_available: true,
      is_featured: false,
      event_type: this.categorizeEventType(event.category),
      availability_status: 'available',
      priority_score: this.calculatePriority(event, 'event')
    }));
  }

  /**
   * Transform restaurant data with operational status
   */
  private transformRestaurantData(data: any[]): RestaurantCarouselData[] {
    return data.map(restaurant => ({
      ...restaurant,
      cuisine_type: this.extractCuisineTypes(restaurant),
      opening_status: this.getOpeningStatus(restaurant),
      reservation_required: false,
      availability_status: 'available',
      priority_score: this.calculatePriority(restaurant, 'restaurant')
    }));
  }

  /**
   * Transform experience data with activity metadata
   */
  private transformExperienceData(data: any[]): ExperienceCarouselData[] {
    return data.map(experience => ({
      ...experience,
      experience_type: this.categorizeExperienceType(experience.category),
      difficulty_level: 'medium',
      availability_status: 'available',
      priority_score: this.calculatePriority(experience, 'experience')
    }));
  }

  /**
   * Get request configuration specific to carousel type
   */
  private getRequestConfig(type: string): RequestConfig {
    const strategy = CACHE_STRATEGIES[type];
    
    return {
      retryCount: type === 'events' ? 2 : 3,
      timeout: type === 'events' ? 8000 : 12000,
      cache: true,
      cacheTTL: strategy.ttl,
      priority: strategy.priority as 'low' | 'medium' | 'high'
    };
  }

  /**
   * Record performance metrics
   */
  private recordMetrics(type: string, startTime: number, success: boolean, cached: boolean): void {
    const responseTime = Date.now() - startTime;
    const existing = this.metricsCollector.get(type);
    
    const metrics: CarouselMetrics = {
      carousel_type: type,
      response_time: existing ? 
        (existing.response_time + responseTime) / 2 : responseTime,
      cache_hit_rate: existing ? 
        (existing.cache_hit_rate + (cached ? 1 : 0)) / 2 : (cached ? 1 : 0),
      error_rate: existing ?
        (existing.error_rate + (success ? 0 : 1)) / 2 : (success ? 0 : 1),
      user_engagement: existing?.user_engagement || { views: 0, clicks: 0, conversions: 0 },
      last_updated: Date.now()
    };
    
    this.metricsCollector.set(type, metrics);
    console.log(`📊 Carousel ${type} metrics:`, metrics);
  }

  /**
   * Normalize errors for carousel context
   */
  private normalizeCarouselError(error: any, carouselType: string): CarouselError {
    return {
      type: this.categorizeErrorType(error),
      message: error.message || `Failed to load ${carouselType}`,
      code: error.code,
      recoveryAction: this.determineRecoveryAction(error),
      timestamp: Date.now(),
      carousel_type: carouselType
    };
  }

  private getEventStatus(event: any): EventCarouselData['event_status'] {
    const now = new Date();
    const start = new Date(event.start_datetime);
    const end = event.end_datetime ? new Date(event.end_datetime) : null;
    
    if (start > now) return 'upcoming';
    if (end && end < now) return 'cancelled';
    return 'ongoing';
  }

  private categorizeEventType(category: string): EventCarouselData['event_type'] {
    const mappings: Record<string, EventCarouselData['event_type']> = {
      'Concerti': 'concert',
      'Festival': 'festival',
      'Mostre': 'exhibition',
      'Sport': 'sport',
      'Cultura': 'cultural'
    };
    return mappings[category] || 'other';
  }

  private categorizeExperienceType(category: string): ExperienceCarouselData['experience_type'] {
    const mappings: Record<string, ExperienceCarouselData['experience_type']> = {
      'Tour': 'tour',
      'Attività': 'activity',
      'Workshop': 'workshop',
      'Avventura': 'adventure',
      'Cultura': 'cultural'
    };
    return mappings[category] || 'activity';
  }

  private extractCuisineTypes(restaurant: any): string[] {
    return restaurant.tags || ['Italiana'];
  }

  private getOpeningStatus(restaurant: any): RestaurantCarouselData['opening_status'] {
    return 'open';
  }

  private calculatePriority(item: any, type: string): number {
    let score = 0;
    
    if (item.avg_rating) score += item.avg_rating * 2;
    if (item.created_at) {
      const daysSinceCreated = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 10 - daysSinceCreated);
    }
    
    return Math.min(100, score);
  }

  private categorizeErrorType(error: any): CarouselError['type'] {
    if (error.message?.includes('timeout')) return 'timeout';
    if (error.code === '429') return 'rate_limit';
    if (error.status === 401 || error.status === 403) return 'permission';
    if (error.message?.includes('network')) return 'network';
    return 'data';
  }

  private determineRecoveryAction(error: any): CarouselError['recoveryAction'] {
    if (error.message?.includes('timeout')) return 'retry';
    if (error.code === '429') return 'fallback';
    if (error.status >= 500) return 'retry';
    return 'skip';
  }

  /**
   * Get metrics for monitoring dashboard
   */
  getMetrics(): CarouselMetrics[] {
    return Array.from(this.metricsCollector.values());
  }

  /**
   * Invalidate specific carousel cache
   */
  invalidateCache(type: string, reason: string): void {
    apiClient.clearCache();
    console.log(`🗑️ Cache invalidated for ${type}: ${reason}`);
  }
}

export const carouselAPIService = new CarouselAPIService();
