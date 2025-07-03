
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import RestaurantCard from '@/components/RestaurantCard';
import { ChefHat } from 'lucide-react';

interface RestaurantsSectionProps {
  restaurants: any[];
}

const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({ restaurants }) => {
  return (
    <ContentCarousel 
      title="Tradizione Culinaria Autentica" 
      subtitle="I sapori genuini della Romagna tramandati di generazione in generazione"
      icon={ChefHat}
    >
      {restaurants.map((restaurant, index) => (
        <RestaurantCard key={index} {...restaurant} />
      ))}
    </ContentCarousel>
  );
};

export default RestaurantsSection;
