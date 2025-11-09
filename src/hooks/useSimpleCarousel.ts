import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

// In-memory cache for carousel data
const carouselCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
import { FILTER_TO_CATEGORY_MAPPING } from '@/config/categoryMapping';
import { CarouselError } from '@/types/carousel';

export type SectionType = 'Gusto & Sapori' | 'Eventi' | 'Natura & Avventura' | 'Divertimento & Famiglia' | 'Cultura & Territorio';

// Mappatura sezioni verso categorie del database
const SECTION_TO_CATEGORIES_MAPPING: Record<SectionType, string[]> = {
  'Gusto & Sapori': ['Ristoranti', 'Agriturismi', 'Aziende Agricole', 'Street Food', 'Mercati Locali'],
  'Eventi': [], // Eventi vengono gestiti dalla tabella events separata
  'Natura & Avventura': ['Spiagge', 'Parchi Naturali e Riserve', 'Sport'],
  'Divertimento & Famiglia': ['Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 'Esperienze Educative', 'Vita Notturna'],
  'Cultura & Territorio': ['Musei', 'Artigianato Locale', 'Storia e Borghi']
};

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

  // Get categories for this section
  const categories = useMemo(() => {
    // Se sono specificati filtri specifici e non include 'tutte', usali
    if (categoryFilters.length > 0 && !categoryFilters.includes('tutte')) {
      return categoryFilters;
    }
    // Altrimenti usa le categorie mappate per questa sezione
    return SECTION_TO_CATEGORIES_MAPPING[section] || [];
  }, [section, categoryFilters]);

  // Determine if we need events or POIs
  const isEventSection = section === 'Eventi';

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Per gli eventi, procediamo sempre. Per i POI, procediamo solo se abbiamo categorie
      if (!isEventSection && categories.length === 0) {
        console.log(`⚠️ [useSimpleCarousel] Nessuna categoria trovata per la sezione "${section}"`);
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

        // Filter by categories if we have any
        if (categories.length > 0) {
          query = query.in('category', categories);
        }

        console.log(`🔍 [useSimpleCarousel] Fetching POIs for section "${section}" with categories:`, categories);

        // Remove withChildren filter completely to ensure public access
        // All target audiences are now allowed for public viewing

        const { data: pois, error: poisError } = await query
          .order('priority_score', { ascending: false })
          .limit(limit);

        if (poisError) throw poisError;
        console.log(`✅ [useSimpleCarousel] Loaded ${pois?.length || 0} POIs for section "${section}"`);
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