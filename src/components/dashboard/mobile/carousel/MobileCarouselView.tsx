import React, { memo } from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import UnifiedPOICard from '@/components/UnifiedPOICard';
import EventCard from '@/components/EventCard';
import CarouselErrorBoundary from '@/components/carousel/CarouselErrorBoundary';
import CarouselLoadingState from '@/components/carousel/CarouselLoadingState';
import TouchTarget from '@/components/ui/TouchTarget';
import { LucideIcon } from 'lucide-react';
import { SectionType } from '@/hooks/useSectionCarousel';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

/**
 * Presentational Component (Dumb) - Mobile Carousel View
 * 
 * Responsabilità:
 * - Rendering carousel ottimizzato per mobile
 * - Touch-friendly interactions
 * - Layout cards ottimizzato per swipe
 * - Error e loading states mobile-specific
 */

interface MobileCarouselViewProps {
  data: any[];
  isLoading: boolean;
  error: any;
  retry: () => void;
  isEmpty: boolean;
  metrics: any;
  categories: string[];
  section: SectionType;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const MobileCarouselView: React.FC<MobileCarouselViewProps> = memo(({ 
  data,
  isLoading,
  error,
  retry,
  isEmpty,
  metrics,
  categories,
  section,
  icon,
  title,
  subtitle
}) => {
  // Show loading state
  if (isLoading) {
    return <CarouselLoadingState carouselType={section.toLowerCase()} />;
  }

  // Show error state with recovery options
  if (error) {
    return (
      <div className="space-y-4 carousel-container-protected">
        <CarouselHeader icon={icon} title={title} subtitle={subtitle} />
        <CarouselErrorBoundary 
          error={error} 
          onRetry={retry}
          showDetails={false} // Dettagli ridotti su mobile
        />
      </div>
    );
  }

  // Show empty state
  if (isEmpty) {
    return (
      <div className="space-y-4 carousel-container-protected">
        <CarouselHeader icon={icon} title={title} subtitle={subtitle} />
        <div className="text-center py-6 text-gray-500">
          {React.createElement(icon, { className: "h-10 w-10 mx-auto mb-3 opacity-50" })}
          <p className="text-sm">Nessun contenuto trovato</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4 carousel-container-protected">
      <CarouselHeader icon={icon} title={title} subtitle={subtitle} />

      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        className="w-full touch-pan-x carousel-container-protected"
      >
        <CarouselContent className="-ml-1 sm:-ml-2">
          {data.map((item: any, index: number) => (
            <CarouselItem key={item.id || index} className="pl-1 sm:pl-2 basis-[260px] min-w-[260px] sm:basis-[280px] sm:min-w-[280px] max-w-[90vw]">
              <TouchTarget>
                {section === 'Eventi' ? (
                  <EventCard 
                    id={item.id}
                    title={item.name}
                    date={new Date(item.start_datetime || '').toLocaleDateString('it-IT')}
                    time={new Date(item.start_datetime || '').toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    location_name={item.location_name || item.address || ''}
                    category={item.category}
                    image={item.images?.[0] || ''}
                  />
                ) : (
                  <UnifiedPOICard 
                    id={item.id}
                    name={item.name}
                    category={item.category}
                    description={item.description}
                    images={item.images}
                    avg_rating={item.avg_rating}
                    price_info={item.price_info}
                    duration_info={item.duration_info}
                    target_audience={item.target_audience}
                    address={item.address}
                    location_name={item.location_name}
                    startDatetime={item.start_datetime}
                    endDatetime={item.end_datetime}
                    poiType={item.poi_type as 'place' | 'event' | 'experience'}
                    isLoading={false}
                  />
                )}
              </TouchTarget>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Footer compatto per mobile */}
      <div className="text-xs text-gray-400 text-center">
        {data.length} elementi
      </div>
    </section>
  );
});

MobileCarouselView.displayName = 'MobileCarouselView';

export default MobileCarouselView;