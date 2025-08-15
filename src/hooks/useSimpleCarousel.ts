import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NAVBAR_CATEGORY_MAPPING } from '@/config/categoryMapping';
import { CarouselError } from '@/types/carousel';

export type SectionType = 'Gusto & Sapori' | 'Eventi' | 'Natura & Avventura' | 'Divertimento & Famiglia' | 'Cultura & Territorio';

interface CarouselItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  location_name?: string;
  images?: string[];
  price_info?: string;
  avg_rating?: number;
  start_datetime?: string;
  end_datetime?: string;
  organizer_info?: string;
  target_audience?: string;
  priority_score?: number;
  duration_info?: string;
  poi_type?: string;
}


interface UseSimpleCarouselOptions {
  withChildren?: boolean;
  limit?: number;
  categoryFilters?: string[];
}

export function useSimpleCarousel(
  section: SectionType, 
  options: UseSimpleCarouselOptions = {}
) {
  const { withChildren = false, limit = 8, categoryFilters = [] } = options;
  const [data, setData] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<CarouselError | null>(null);

  // Get categories for this section - use filters if provided, otherwise default mapping
  const categories = categoryFilters.length > 0 && !categoryFilters.includes('tutte') 
    ? categoryFilters 
    : NAVBAR_CATEGORY_MAPPING[section] || [];

  // Determine if we need events or POIs
  const isEventSection = section === 'Eventi';

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verify categories are available before queries
      if (!isEventSection && categories.length === 0) {
        setData([]);
        setIsLoading(false);
        return;
      }

      if (isEventSection) {
        // Fetch from events table - select specific columns for public access
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('id, name, description, category, latitude, longitude, address, location_name, images, price_info, avg_rating, start_datetime, end_datetime, organizer_info, tags')
          .gte('start_datetime', new Date().toISOString())
          .order('start_datetime', { ascending: true })
          .limit(limit);

        if (eventsError) throw eventsError;
        setData(events || []);
      } else {
        // Fetch from points_of_interest table - select specific columns for public access
        let query = supabase
          .from('points_of_interest')
          .select('id, name, description, category, latitude, longitude, address, location_name, images, price_info, avg_rating, target_audience, priority_score, duration_info, poi_type, start_datetime, end_datetime, organizer_info')
          .eq('status', 'approved');

        // Filter by categories
        query = query.in('category', categories);

        // Remove withChildren filter completely to ensure public access
        // All target audiences are now allowed for public viewing

        const { data: pois, error: poisError } = await query
          .order('priority_score', { ascending: false })
          .limit(limit);

        if (poisError) throw poisError;
        setData(pois || []);
      }
    } catch (err) {
      setError({ 
        type: 'network',
        message: err instanceof Error ? err.message : 'Failed to load data',
        recoveryAction: 'retry',
        timestamp: Date.now(),
        carousel_type: section
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [section, withChildren, limit, JSON.stringify(categoryFilters)]);

  const isEmpty = !isLoading && !error && data.length === 0;

  return {
    data,
    isLoading,
    error,
    isEmpty,
    categories,
    retry: fetchData,
    refresh: fetchData
  };
}

export type { CarouselItem };