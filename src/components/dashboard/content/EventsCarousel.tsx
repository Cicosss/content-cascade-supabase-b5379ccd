
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import CarouselHeader from '@/components/ui/CarouselHeader';
import POICard from '@/components/POICard';
import { Calendar } from 'lucide-react';

interface EventsCarouselProps {
  events: any[];
  isLoading?: boolean;
}

const EventsCarousel: React.FC<EventsCarouselProps> = ({ events, isLoading = false }) => {
  const titleText = "Eventi nella tua zona";
  const subtitleText = "Non perdere gli appuntamenti più interessanti del territorio";

  return (
    <div className="space-y-4">
      <CarouselHeader icon={Calendar} title={titleText} subtitle={subtitleText} />
      <ContentCarousel>
        {isLoading ? (
          // Mostra 4 skeleton loaders durante il caricamento
          Array.from({ length: 4 }).map((_, index) => (
            <POICard 
              key={`skeleton-${index}`}
              id=""
              name=""
              category=""
              isLoading={true}
            />
          ))
        ) : (
          events.map((event, index) => (
            <POICard 
              key={event.id || index} 
              id={event.id}
              name={event.name}
              category={event.category}
              description={event.description}
              images={event.images}
              avg_rating={event.avg_rating}
              price_info={event.price_info}
            />
          ))
        )}
      </ContentCarousel>
    </div>
  );
};

export default EventsCarousel;
