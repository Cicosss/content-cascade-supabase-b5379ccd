import { useMemo } from 'react';
import { useCarouselAPI } from './useCarouselAPI';
import { NAVBAR_CATEGORY_MAPPING } from '@/config/categoryMapping';
import { ExperienceFilters } from '@/types/carousel';

export type SectionType = 'Gusto & Sapori' | 'Eventi' | 'Eventi & Spettacoli' | 'Natura & Avventura' | 'Divertimento & Famiglia' | 'Cultura & Territorio';

interface SectionCarouselOptions {
  withChildren?: boolean;
  limit?: number;
}

export const useSectionCarousel = (
  section: SectionType, 
  options: SectionCarouselOptions = {}
) => {
  const { withChildren = false, limit = 8 } = options;

  // Get categories for this section
  const categories = NAVBAR_CATEGORY_MAPPING[section] || [];

  // Create filters based on section
  const filters = useMemo(() => {
    if (section === 'Eventi' || section === 'Eventi & Spettacoli') {
      // For events, use the events API with category filter
      return { category: 'Eventi' };
    } else {
      // For other sections, we'll fetch experiences and filter by categories
      const baseFilters: ExperienceFilters = {
        with_children: withChildren,
        section_categories: categories
      };
      return baseFilters;
    }
  }, [section, withChildren, categories]);

  // Use appropriate carousel API based on section
  const carouselType = (section === 'Eventi' || section === 'Eventi & Spettacoli') ? 'events' : 'experiences';
  
  const result = useCarouselAPI(carouselType, filters, {
    enabled: true // Always enabled, handle empty state in UI
  });

  // Apply limit to data (filtering is handled in carouselAPIService)
  const filteredData = useMemo(() => {
    if (!result.data) {
      return result.data;
    }

    // Simply apply limit, section_categories filtering is handled in API service
    return result.data.slice(0, limit);
  }, [result.data, limit]);

  return {
    ...result,
    data: filteredData,
    categories,
    isEmpty: !filteredData || filteredData.length === 0
  };
};