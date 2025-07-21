
import React, { useEffect } from 'react';
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
import { useABTesting, useCarouselMetrics } from '@/hooks/useABTesting';
import { useGeoFiltering } from '@/hooks/useGeoFiltering';
import { useDynamicLimits } from '@/hooks/useDynamicLimits';
import { useIntelligentCache } from '@/services/intelligentCacheService';
import { getCategoriesForNavbar } from '@/config/categoryMapping';

const RestaurantsSection: React.FC = () => {
  const { variant, variantConfig, isLoading: isABLoading } = useABTesting('homepage-restaurants');
  const { enrichWithGeoData, sortByGeoEnhancedPriority } = useGeoFiltering();
  const { limit } = useDynamicLimits('homepage');
  const { trackMetric } = useCarouselMetrics();
  
  const cache = useIntelligentCache();

  // Ottieni categorie culinarie
  const culinaryCategories = getCategoriesForNavbar('Gusto & Sapori');

  // Cache invalidation pulita
  useEffect(() => {
    cache.invalidateByPattern(/homepage.*culinary.*/);
  }, [cache]);
  
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['homepage-culinary-pois', variant, limit],
    queryFn: async () => {
      let query = supabase
        .from('points_of_interest')
        .select('*')
        .in('category', culinaryCategories)
        .eq('status', 'approved');

      // Applica ordinamento A/B
      if (variantConfig.orderBy === 'avg_rating') {
        query = query.order('avg_rating', { ascending: false, nullsFirst: false });
      } else {
        query = query.order('priority_score', { ascending: false, nullsFirst: false });
      }

      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      let processedData = data || [];
      
      // Arricchisci con dati geo
      processedData = enrichWithGeoData(processedData);
      if (variantConfig.orderBy === 'distance') {
        processedData = sortByGeoEnhancedPriority(processedData);
      }
      
      return processedData;
    },
    enabled: !isABLoading,
    staleTime: 1000 * 60 * 5, // 5 minuti di cache
    gcTime: 1000 * 60 * 10,   // 10 minuti di garbage collection
  });

  // Traccia visualizzazione carosello
  useEffect(() => {
    if (restaurants.length > 0) {
      trackMetric('homepage-restaurants', 'view');
    }
  }, [restaurants.length, trackMetric]);

  if (isLoading || isABLoading || restaurants.length === 0) {
    return null; // Don't show section if no restaurants
  }

  // Handler per click su card
  const handleCardClick = (restaurantId: string, position: number) => {
    trackMetric('homepage-restaurants', 'click', restaurantId, position);
  };

  return (
    <div className="space-y-4">
      <CarouselHeader 
        icon={ChefHat}
        title={variantConfig.title || "Tradizione Culinaria Autentica"}
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
              <div onClick={() => handleCardClick(restaurant.id, index)}>
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
              </div>
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
