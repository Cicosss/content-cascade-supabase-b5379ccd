import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NAVBAR_CATEGORY_MAPPING } from '@/config/categoryMapping';
import { CarouselError } from '@/types/carousel';

export type SectionType = 'Gusto & Sapori' | 'Eventi' | 'Eventi & Spettacoli' | 'Natura & Avventura' | 'Divertimento & Famiglia' | 'Cultura & Territorio';

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
}

export function useSimpleCarousel(
  section: SectionType, 
  options: UseSimpleCarouselOptions = {}
) {
  const { withChildren = false, limit = 8 } = options;
  const [data, setData] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<CarouselError | null>(null);

  // Get categories for this section
  const categories = NAVBAR_CATEGORY_MAPPING[section] || [];

  // Determine if we need events or POIs
  const isEventSection = section === 'Eventi' || section === 'Eventi & Spettacoli';

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEventSection) {
        // Fetch from events table
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .gte('start_datetime', new Date().toISOString())
          .order('start_datetime', { ascending: true })
          .limit(limit);

        if (eventsError) throw eventsError;
        setData(events || []);
      } else {
        // Fetch from points_of_interest table
        let query = supabase
          .from('points_of_interest')
          .select('*')
          .eq('status', 'approved');

        // Filter by categories if available
        if (categories.length > 0) {
          query = query.in('category', categories);
        }

        // Filter by target audience if withChildren is specified
        if (withChildren) {
          query = query.or('target_audience.eq.families,target_audience.eq.everyone');
        }

        const { data: pois, error: poisError } = await query
          .order('priority_score', { ascending: false })
          .limit(limit);

        if (poisError) throw poisError;
        setData(pois || []);
      }

      console.log(`✅ ${section} carousel loaded:`, data?.length || 0, 'items');
    } catch (err) {
      console.error(`❌ Error loading ${section} carousel:`, err);
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
    console.log(`🎯 useSimpleCarousel: Loading ${section} carousel...`);
    fetchData();
  }, [section, withChildren, limit]);

  const isEmpty = !isLoading && !error && data.length === 0;

  return {
    data,
    isLoading,
    error,
    isEmpty,
    categories,
    retry: fetchData,
    refresh: fetchData,
    metrics: {
      responseTime: 0,
      cacheHit: false,
      retryCount: 0
    }
  };
}

export type { CarouselItem };