
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import CarouselHeader from '@/components/ui/CarouselHeader';
import POICard from '@/components/POICard';
import { ChefHat } from 'lucide-react';

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
      <ContentCarousel>
        {isLoading ? (
          // Mostra 4 skeleton loaders durante il caricamento
          Array.from({ length: 4 }).map((_, index) => (
            <POICard 
              key={`skeleton-${index}`}
              id=""
              name=""
              category=""
              isLoading={true}
            />
          ))
        ) : (
          restaurants.map((restaurant, index) => (
            <POICard 
              key={restaurant.id || index} 
              id={restaurant.id}
              name={restaurant.name}
              category={restaurant.category}
              description={restaurant.description}
              images={restaurant.images}
              avg_rating={restaurant.avg_rating}
              price_info={restaurant.price_info}
            />
          ))
        )}
      </ContentCarousel>
    </div>
  );
};

export default RestaurantsCarousel;
