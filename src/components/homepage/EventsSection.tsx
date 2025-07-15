
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContentCarousel from '@/components/ContentCarousel';
import EventCard from '@/components/EventCard';
import { Calendar } from 'lucide-react';

const EventsSection: React.FC = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['homepage-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_datetime', new Date().toISOString())
        .order('start_datetime', { ascending: true })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading || events.length === 0) {
    return null; // Don't show section if no events
  }

  return (
    <ContentCarousel 
      title="Eventi Speciali e Manifestazioni" 
      subtitle="Non perdere gli appuntamenti più esclusivi del territorio"
      icon={Calendar}
    >
      {events.map((event, index) => (
        <EventCard 
          key={event.id || index}
          title={event.name}
          date={new Date(event.start_datetime).toLocaleDateString('it-IT')}
          time={new Date(event.start_datetime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          location={event.location_name || event.address || ''}
          category={event.category}
          image={event.images?.[0] || ''}
        />
      ))}
    </ContentCarousel>
  );
};

export default EventsSection;
