
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CarouselHeader from '@/components/ui/CarouselHeader';
import EventCard from '@/components/EventCard';
import { Calendar } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <div className="space-y-4">
      <CarouselHeader 
        icon={Calendar}
        title="Eventi Speciali e Manifestazioni" 
        subtitle="Non perdere gli appuntamenti più esclusivi del territorio"
      />
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {events.map((event, index) => (
            <CarouselItem key={event.id || index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
              <EventCard 
                title={event.name}
                date={new Date(event.start_datetime).toLocaleDateString('it-IT')}
                time={new Date(event.start_datetime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                location={event.location_name || event.address || ''}
                category={event.category}
                image={event.images?.[0] || ''}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default EventsSection;
