
import { POI } from './poi';

// Base interface for carousel POI data
export interface CarouselPOI extends POI {
  priority_score?: number;
  distance_km?: number;
  availability_status?: 'available' | 'limited' | 'full';
  performance_metrics?: {
    load_time: number;
    cache_hit: boolean;
    retry_count: number;
  };
}

// Event-specific carousel data
export interface EventCarouselData extends CarouselPOI {
  event_status: 'upcoming' | 'ongoing' | 'cancelled';
  tickets_available: boolean;
  is_featured: boolean;
  event_type: 'concert' | 'festival' | 'exhibition' | 'sport' | 'cultural' | 'other';
}

// Restaurant-specific carousel data
export interface RestaurantCarouselData extends CarouselPOI {
  cuisine_type: string[];
  opening_status: 'open' | 'closed' | 'closing_soon';
  reservation_required: boolean;
  menu_highlights?: string[];
  dietary_options?: string[];
}

// Experience-specific carousel data
export interface ExperienceCarouselData extends CarouselPOI {
  experience_type: 'tour' | 'activity' | 'workshop' | 'adventure' | 'cultural';
  difficulty_level?: 'easy' | 'medium' | 'hard';
  group_size_min?: number;
  group_size_max?: number;
  seasonal_availability?: string[];
}

// Error handling interfaces
export interface CarouselError {
  type: 'network' | 'data' | 'permission' | 'timeout' | 'rate_limit';
  message: string;
  code?: string;
  recoveryAction: 'retry' | 'fallback' | 'skip' | 'refresh';
  fallbackData?: CarouselPOI[];
  timestamp: number;
  carousel_type: string;
}

// Filters for different carousel types
export interface EventFilters {
  category?: string;
  date_range?: { start: Date; end: Date };
  location?: string;
  price_range?: { min: number; max: number };
  event_type?: EventCarouselData['event_type'];
}

export interface RestaurantFilters {
  cuisine_type?: string[];
  price_range?: { min: number; max: number };
  dietary_requirements?: string[];
  distance_km?: number;
  opening_now?: boolean;
}

export interface ExperienceFilters {
  experience_type?: ExperienceCarouselData['experience_type'];
  difficulty_level?: ExperienceCarouselData['difficulty_level'];
  duration_hours?: { min: number; max: number };
  group_size?: number;
  with_children?: boolean;
}

// Cache configuration
export interface CacheStrategy {
  ttl: number;
  priority: 'low' | 'medium' | 'high';
  invalidation_triggers: string[];
  max_age_stale: number;
}

// Performance metrics
export interface CarouselMetrics {
  carousel_type: string;
  response_time: number;
  cache_hit_rate: number;
  error_rate: number;
  user_engagement: {
    views: number;
    clicks: number;
    conversions: number;
  };
  last_updated: number;
}
