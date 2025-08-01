
import React from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import EventCard from '@/components/EventCard';
import CarouselErrorBoundary from '@/components/carousel/CarouselErrorBoundary';
import CarouselLoadingState from '@/components/carousel/CarouselLoadingState';
import { Calendar } from 'lucide-react';
import { useCarouselAPI } from '@/hooks/useCarouselAPI';
import { EventFilters } from '@/types/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EventsCarouselProps {
  filters?: EventFilters;
  title?: string;
  subtitle?: string;
}

const EventsCarousel: React.FC<EventsCarouselProps> = ({ 
  filters = {},
  title = "Eventi nella tua zona",
  subtitle = "Non perdere gli appuntamenti più interessanti del territorio"
}) => {
  const { data: events, isLoading, error, retry, isEmpty, metrics } = useCarouselAPI('events', filters);

  // Show loading state
  if (isLoading) {
    return <CarouselLoadingState carouselType="eventi" />;
  }

  // Show error state with recovery options
  if (error) {
    return (
      <div className="space-y-4">
        <CarouselHeader icon={Calendar} title={title} subtitle={subtitle} />
        <CarouselErrorBoundary 
          error={error} 
          onRetry={retry}
          showDetails={true}
        />
      </div>
    );
  }

  // Show empty state
  if (isEmpty) {
    return (
      <div className="space-y-4">
        <CarouselHeader icon={Calendar} title={title} subtitle={subtitle} />
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nessun evento trovato per i criteri selezionati.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <CarouselHeader icon={Calendar} title={title} subtitle={subtitle} />
      
      {/* Performance metrics (dev mode only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 flex space-x-4">
          <span>⚡ {metrics.responseTime}ms</span>
          <span>{metrics.cacheHit ? '📋 Cache hit' : '🌐 Fresh'}</span>
          {metrics.retryCount > 0 && <span>🔄 {metrics.retryCount} retry</span>}
        </div>
      )}

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {events.map((event, index) => (
            <CarouselItem key={event.id || index} className="pl-3 md:pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <EventCard 
                id={event.id}
                title={event.name}
                date={new Date(event.start_datetime || '').toLocaleDateString('it-IT')}
                time={new Date(event.start_datetime || '').toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                location_name={event.location_name || event.address || ''}
                category={event.category}
                image={event.images?.[0] || ''}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      
      <div className="text-xs text-gray-400 text-right">
        {events.length} eventi • Aggiornato {new Date().toLocaleTimeString()}
      </div>
    </section>
  );
};

export default EventsCarousel;
