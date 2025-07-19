
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CarouselHeader from '@/components/ui/CarouselHeader';
import UnifiedPOICard from '@/components/UnifiedPOICard';
import { ChefHat } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const RestaurantsSection: React.FC = () => {
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .eq('category', 'Ristoranti')
        .eq('status', 'approved')
        .limit(6);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading || restaurants.length === 0) {
    return null; // Don't show section if no restaurants
  }

  return (
    <div className="space-y-4">
      <CarouselHeader 
        icon={ChefHat}
        title="Tradizione Culinaria Autentica" 
        subtitle="I sapori genuini della Romagna tramandati di generazione in generazione"
      />
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {restaurants.map((restaurant, index) => (
            <CarouselItem key={restaurant.id || index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
              <UnifiedPOICard 
                id={restaurant.id}
                name={restaurant.name}
                category={restaurant.category}
                description={restaurant.description}
                images={restaurant.images}
                avg_rating={restaurant.avg_rating}
                price_info={restaurant.price_info}
                duration_info={restaurant.duration_info}
                target_audience={restaurant.target_audience}
                address={restaurant.address}
                poiType="place"
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

export default RestaurantsSection;
