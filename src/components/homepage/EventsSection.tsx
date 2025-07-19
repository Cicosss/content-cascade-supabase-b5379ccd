
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CarouselHeader from '@/components/ui/CarouselHeader';
import UnifiedPOICard from '@/components/UnifiedPOICard';
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
        .order('avg_rating', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 3 * 60 * 1000, // 3 minuti
    gcTime: 5 * 60 * 1000 // 5 minuti
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
              <UnifiedPOICard 
                id={event.id}
                name={event.name}
                category={event.category}
                description={event.description}
                images={event.images}
                avg_rating={event.avg_rating}
                price_info={event.price_info}
                duration_info={undefined}
                target_audience={undefined}
                address={event.address || event.location_name}
                location_name={event.location_name}
                startDatetime={event.start_datetime}
                endDatetime={event.end_datetime}
                poiType="event"
                isLoading={false}
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
