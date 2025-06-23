
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import EventCard from '@/components/EventCard';
import { Calendar } from 'lucide-react';

interface EventsCarouselProps {
  events: any[];
}

const EventsCarousel: React.FC<EventsCarouselProps> = ({ events }) => {
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
        {events.map((event, index) => (
          <EventCard key={event.id || index} {...event} />
        ))}
      </ContentCarousel>
    </div>
  );
};

export default EventsCarousel;
