
import React from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import POICard from '@/components/POICard';
import { Calendar } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {isLoading ? (
            // Mostra 4 skeleton loaders durante il caricamento
            Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem key={`skeleton-${index}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                <POICard 
                  id=""
                  name=""
                  category=""
                  isLoading={true}
                />
              </CarouselItem>
            ))
          ) : (
            events.map((event, index) => (
              <CarouselItem key={event.id || index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                <POICard 
                  id={event.id}
                  name={event.name}
                  category={event.category}
                  description={event.description}
                  images={event.images}
                  avg_rating={event.avg_rating}
                  price_info={event.price_info}
                />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default EventsCarousel;
