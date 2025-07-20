
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

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['restaurants', variant, limit],
    queryFn: async () => {
      // Prova prima la cache
      const cacheKey = `homepage-restaurants-${variant}`;
      const cachedData = cache.get(cacheKey, { limit, orderBy: variantConfig.orderBy });
      if (cachedData) {
        return cachedData;
      }

      // Ottieni tutte le categorie culinarie dal mapping
      const culinaryCategories = getCategoriesForNavbar('Gusto & Sapori');
      console.log('🍴 Fetching culinary categories:', culinaryCategories);

      let query = supabase
        .from('points_of_interest')
        .select('*')
        .in('category', culinaryCategories)
        .eq('status', 'approved');

      // Applica ordinamento basato sulla variante A/B
      switch (variantConfig.orderBy) {
        case 'avg_rating':
          query = query.order('avg_rating', { ascending: false, nullsFirst: false });
          break;
        case 'priority_score':
        default:
          query = query.order('priority_score', { ascending: false, nullsFirst: false });
          break;
      }

      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      let processedData = data || [];
      
      console.log('🍴 Fetched culinary POIs:', processedData.length, 'items');
      console.log('🍴 Categories breakdown:', processedData.reduce((acc, poi) => {
        acc[poi.category] = (acc[poi.category] || 0) + 1;
        return acc;
      }, {}));
      
      // Arricchisci con dati geo se l'ordinamento non è per distanza
      if (variantConfig.orderBy !== 'distance') {
        processedData = enrichWithGeoData(processedData);
      } else {
        processedData = enrichWithGeoData(processedData);
        processedData = sortByGeoEnhancedPriority(processedData);
      }
      
      // Salva in cache
      cache.set(cacheKey, processedData, 'homepage-pois', { limit, orderBy: variantConfig.orderBy });
      
      return processedData;
    },
    enabled: !isABLoading
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
                {/* Badge per mostrare distanza se disponibile */}
                {restaurant.distance_km && restaurant.distance_km < 50 && (
                  <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {restaurant.distance_km}km
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      
      {/* Mostra info variante in dev mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          A/B Variant: {variant} | Ordinamento: {variantConfig.orderBy} | Risultati: {restaurants.length}/{limit}
        </div>
      )}
    </div>
  );
};

export default RestaurantsSection;
