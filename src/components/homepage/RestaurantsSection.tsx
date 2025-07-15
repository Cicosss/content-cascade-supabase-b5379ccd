
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContentCarousel from '@/components/ContentCarousel';
import POICard from '@/components/POICard';
import { ChefHat } from 'lucide-react';

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
    <ContentCarousel 
      title="Tradizione Culinaria Autentica" 
      subtitle="I sapori genuini della Romagna tramandati di generazione in generazione"
      icon={ChefHat}
    >
      {restaurants.map((restaurant, index) => (
        <POICard 
          key={restaurant.id || index}
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
      ))}
    </ContentCarousel>
  );
};

export default RestaurantsSection;
