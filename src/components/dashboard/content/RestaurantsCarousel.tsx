
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import RestaurantCard from '@/components/RestaurantCard';
import { ChefHat } from 'lucide-react';

interface RestaurantsCarouselProps {
  restaurants: any[];
  filters: {
    isFirstVisit: boolean;
    withChildren: string;
  };
}

const RestaurantsCarousel: React.FC<RestaurantsCarouselProps> = ({ restaurants, filters }) => {
  const titleText = `Tradizione Culinaria${filters.isFirstVisit ? ' per Visitatori' : ' Autentica'}`;
  const subtitleText = `I sapori della Romagna ${filters.withChildren === 'sì' ? 'per tutta la famiglia' : 'selezionati per te'}`;

  return (
    <div className="space-y-4">
      {/* Titolo Sezione Uniforme */}
      <div className="flex items-center gap-3">
        <ChefHat className="h-6 w-6 text-blue-800" strokeWidth={1.5} />
        <div>
          <h2 className="text-2xl font-bold text-blue-800">{titleText}</h2>
          <p className="text-slate-600 text-sm">{subtitleText}</p>
        </div>
      </div>
      
      <ContentCarousel 
        title=""
        subtitle=""
      >
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={restaurant.id || index} id={restaurant.id} {...restaurant} />
        ))}
      </ContentCarousel>
    </div>
  );
};

export default RestaurantsCarousel;
