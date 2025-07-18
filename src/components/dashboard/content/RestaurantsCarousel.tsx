
import React from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import POICard from '@/components/POICard';
import { ChefHat } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RestaurantsCarouselProps {
  restaurants: any[];
  filters: {
    isFirstVisit: boolean;
    withChildren: string;
  };
  isLoading?: boolean;
}

const RestaurantsCarousel: React.FC<RestaurantsCarouselProps> = ({ 
  restaurants, 
  filters, 
  isLoading = false 
}) => {
  const titleText = `Tradizione Culinaria${filters.isFirstVisit ? ' per Visitatori' : ' Autentica'}`;
  const subtitleText = `I sapori della Romagna ${filters.withChildren === 'sì' ? 'per tutta la famiglia' : 'selezionati per te'}`;

  return (
    <div className="space-y-4">
      <CarouselHeader icon={ChefHat} title={titleText} subtitle={subtitleText} />
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
            restaurants.map((restaurant, index) => (
              <CarouselItem key={restaurant.id || index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                <POICard 
                  id={restaurant.id}
                  name={restaurant.name}
                  category={restaurant.category}
                  description={restaurant.description}
                  images={restaurant.images}
                  avg_rating={restaurant.avg_rating}
                  price_info={restaurant.price_info}
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

export default RestaurantsCarousel;
