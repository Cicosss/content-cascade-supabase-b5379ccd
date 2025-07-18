
import React from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import POICard from '@/components/POICard';
import CarouselErrorBoundary from '@/components/carousel/CarouselErrorBoundary';
import CarouselLoadingState from '@/components/carousel/CarouselLoadingState';
import { ChefHat } from 'lucide-react';
import { useCarouselAPI } from '@/hooks/useCarouselAPI';
import { RestaurantFilters } from '@/types/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RestaurantsCarouselProps {
  filters?: RestaurantFilters & {
    isFirstVisit: boolean;
    withChildren: string;
  };
  title?: string;
  subtitle?: string;
}

const RestaurantsCarousel: React.FC<RestaurantsCarouselProps> = ({ 
  filters = { isFirstVisit: false, withChildren: 'no' },
  title,
  subtitle
}) => {
  // Transform filters for the API
  const apiFilters: RestaurantFilters = {
    cuisine_type: filters.cuisine_type,
    price_range: filters.price_range,
    dietary_requirements: filters.dietary_requirements,
    opening_now: filters.opening_now
  };

  const dynamicTitle = title || `Tradizione Culinaria${filters.isFirstVisit ? ' per Visitatori' : ' Autentica'}`;
  const dynamicSubtitle = subtitle || `I sapori della Romagna ${filters.withChildren === 'sì' ? 'per tutta la famiglia' : 'selezionati per te'}`;

  const { data: restaurants, isLoading, error, retry, isEmpty, metrics } = useCarouselAPI('restaurants', apiFilters);

  // Show loading state
  if (isLoading) {
    return <CarouselLoadingState carouselType="ristoranti" />;
  }

  // Show error state with recovery options
  if (error) {
    return (
      <div className="space-y-4">
        <CarouselHeader icon={ChefHat} title={dynamicTitle} subtitle={dynamicSubtitle} />
        <CarouselErrorBoundary 
          error={error} 
          onRetry={retry}
          showDetails={true}
        />
      </div>
    );
  }

  // Show empty state
  if (isEmpty) {
    return (
      <div className="space-y-4">
        <CarouselHeader icon={ChefHat} title={dynamicTitle} subtitle={dynamicSubtitle} />
        <div className="text-center py-8 text-gray-500">
          <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nessun ristorante trovato per i criteri selezionati.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CarouselHeader icon={ChefHat} title={dynamicTitle} subtitle={dynamicSubtitle} />
      
      {/* Performance metrics (dev mode only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 flex space-x-4">
          <span>⚡ {metrics.responseTime}ms</span>
          <span>{metrics.cacheHit ? '📋 Cache hit' : '🌐 Fresh'}</span>
          {metrics.retryCount > 0 && <span>🔄 {metrics.retryCount} retry</span>}
          <span>🍴 {restaurants.filter(r => r.opening_status === 'open').length} aperti</span>
        </div>
      )}

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
              <POICard 
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
      
      <div className="text-xs text-gray-400 text-right">
        {restaurants.length} ristoranti • Aggiornato {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default RestaurantsCarousel;
