// Simplified carousel API for backward compatibility
import { useSimpleCarousel } from './useSimpleCarousel';

export function useCarouselAPI(type: string, filters: any = {}, options: any = {}) {
  const result = useSimpleCarousel(type as any, { limit: 8 });
  
  return {
    ...result,
    refresh: result.retry,
    isEmpty: result.isEmpty,
    metrics: {
      responseTime: 0,
      cacheHit: false,
      retryCount: 0
    }
  };
}

export type { CarouselItem } from './useSimpleCarousel';