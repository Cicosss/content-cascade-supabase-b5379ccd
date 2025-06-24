
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import EventCard from '@/components/EventCard';

interface EventsSectionProps {
  events: any[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  return (
    <ContentCarousel 
      title="Eventi Speciali e Manifestazioni" 
      subtitle="Non perdere gli appuntamenti più esclusivi del territorio"
    >
      {events.map((event, index) => (
        <EventCard key={index} {...event} />
      ))}
    </ContentCarousel>
  );
};

export default EventsSection;
