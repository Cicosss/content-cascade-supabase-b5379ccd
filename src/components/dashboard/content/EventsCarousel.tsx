
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
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
      {/* Titolo Sezione Uniforme */}
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-blue-800" strokeWidth={1.5} />
        <div>
          <h2 className="text-2xl font-bold text-blue-800">{titleText}</h2>
          <p className="text-slate-600 text-sm">{subtitleText}</p>
        </div>
      </div>
      
      <ContentCarousel 
        title=""
        subtitle=""
      >
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
