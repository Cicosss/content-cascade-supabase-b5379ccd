
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContentCarousel from '@/components/ContentCarousel';
import RestaurantCard from '@/components/RestaurantCard';
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
        <RestaurantCard 
          key={restaurant.id || index} 
          name={restaurant.name}
          cuisine={restaurant.description || ''}
          rating={restaurant.avg_rating || 0}
          priceRange={restaurant.price_info || '€€'}
          location={restaurant.address || ''}
          image={restaurant.images?.[0] || ''}
          specialty={restaurant.description || ''}
        />
      ))}
    </ContentCarousel>
  );
};

export default RestaurantsSection;
