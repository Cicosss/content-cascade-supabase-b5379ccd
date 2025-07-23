import { useMemo } from 'react';
import { useCarouselAPI } from './useCarouselAPI';
import { NAVBAR_CATEGORY_MAPPING } from '@/config/categoryMapping';
import { ExperienceFilters } from '@/types/carousel';

export type SectionType = 'Gusto & Sapori' | 'Eventi' | 'Natura & Avventura' | 'Divertimento & Famiglia' | 'Cultura & Territorio';

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
    if (section === 'Eventi') {
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
  const carouselType = section === 'Eventi' ? 'events' : 'experiences';
  
  const result = useCarouselAPI(carouselType as any, filters, {
    enabled: categories.length > 0 || section === 'Eventi'
  });

  // Filter data by categories for non-event sections
  const filteredData = useMemo(() => {
    if (section === 'Eventi' || !result.data) {
      return result.data;
    }

    // Filter experiences by section categories
    return result.data.filter((item: any) => 
      categories.includes(item.category)
    ).slice(0, limit);
  }, [result.data, section, categories, limit]);

  return {
    ...result,
    data: filteredData,
    categories,
    isEmpty: !filteredData || filteredData.length === 0
  };
};