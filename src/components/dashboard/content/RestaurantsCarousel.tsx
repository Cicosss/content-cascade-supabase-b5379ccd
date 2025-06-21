
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import RestaurantCard from '@/components/RestaurantCard';

interface RestaurantsCarouselProps {
  restaurants: any[];
  filters: {
    isFirstVisit: boolean;
    withChildren: string;
  };
}

const RestaurantsCarousel: React.FC<RestaurantsCarouselProps> = ({ restaurants, filters }) => {
  return (
    <ContentCarousel 
      title={`Tradizione Culinaria${filters.isFirstVisit ? ' per Visitatori' : ' Autentica'}`}
      subtitle={`I sapori della Romagna ${filters.withChildren === 'sì' ? 'per tutta la famiglia' : 'selezionati per te'}`}
    >
      {restaurants.map((restaurant, index) => (
        <RestaurantCard key={restaurant.id || index} id={restaurant.id} {...restaurant} />
      ))}
    </ContentCarousel>
  );
};

export default RestaurantsCarousel;
