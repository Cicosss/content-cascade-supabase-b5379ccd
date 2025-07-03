
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import EventCard from '@/components/EventCard';
import { Calendar } from 'lucide-react';

interface EventsSectionProps {
  events: any[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  return (
    <ContentCarousel 
      title="Eventi Speciali e Manifestazioni" 
      subtitle="Non perdere gli appuntamenti più esclusivi del territorio"
      icon={Calendar}
    >
      {events.map((event, index) => (
        <EventCard key={index} {...event} />
      ))}
    </ContentCarousel>
  );
};

export default EventsSection;
