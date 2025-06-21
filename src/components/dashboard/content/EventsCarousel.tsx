
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import EventCard from '@/components/EventCard';

interface EventsCarouselProps {
  events: any[];
}

const EventsCarousel: React.FC<EventsCarouselProps> = ({ events }) => {
  return (
    <ContentCarousel 
      title="Eventi nella tua zona"
      subtitle="Non perdere gli appuntamenti più interessanti del territorio"
    >
      {events.map((event, index) => (
        <EventCard key={event.id || index} {...event} />
      ))}
    </ContentCarousel>
  );
};

export default EventsCarousel;
