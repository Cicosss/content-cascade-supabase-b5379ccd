
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import RestaurantCard from '@/components/RestaurantCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface RestaurantsSectionProps {
  restaurants: any[];
  isLoading?: boolean;
  hasRealData?: boolean;
}

const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({ 
  restaurants, 
  isLoading = false,
  hasRealData = false 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="min-w-80 p-4">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ContentCarousel 
        title="Tradizione Culinaria Autentica" 
        subtitle={hasRealData 
          ? "I migliori ristoranti della Romagna direttamente dal nostro database" 
          : "I sapori genuini della Romagna tramandati di generazione in generazione"
        }
      >
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={index} {...restaurant} />
        ))}
      </ContentCarousel>
      {hasRealData && (
        <p className="text-sm text-green-600 mt-2 text-center">
          ✅ Dati caricati dal database Supabase
        </p>
      )}
    </div>
  );
};

export default RestaurantsSection;
