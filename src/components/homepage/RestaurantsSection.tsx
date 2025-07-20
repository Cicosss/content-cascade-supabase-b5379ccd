
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

  // Ottieni tutte le categorie culinarie dal mapping
  const culinaryCategories = getCategoriesForNavbar('Gusto & Sapori');
  console.log('🍴 Culinary categories to query:', culinaryCategories);

  // STEP 1: Invalidare TUTTE le cache obsolete con pattern corretti
  useEffect(() => {
    console.log('🧹 FORCE CACHE INVALIDATION - Starting...');
    
    // Invalidare tutte le possibili varianti di cache carousel
    cache.invalidateByPattern(/carousel-poi-restaurants.*/);
    cache.invalidateByPattern(/carousel-poi-.*/);
    cache.invalidateByPattern(/homepage.*restaurant.*/);
    cache.invalidateByPattern(/homepage.*culinary.*/);
    cache.invalidateByPattern(/culinary-pois.*/);
    
    console.log('🧹 Cache patterns invalidated');
    console.log('📊 Cache stats after invalidation:', cache.getStats());
  }, [cache]);

  // STEP 2: Aggiungere timestamp per forzare refresh assoluto
  const forceRefreshKey = `force-refresh-${Date.now()}`;
  
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['culinary-pois-FORCE-v3', variant, limit, culinaryCategories.sort().join('-'), forceRefreshKey],
    queryFn: async () => {
      console.log('🚀 FORCED FRESH QUERY - No cache used');
      console.log('🔍 Querying categories:', culinaryCategories);

      // STEP 3: Query diretta senza cache check iniziale
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
      
      if (error) {
        console.error('❌ Query error:', error);
        throw error;
      }
      
      let processedData = data || [];
      
      console.log('🎯 FRESH FORCED QUERY RESULTS:', processedData.length, 'items');
      console.log('📊 Categories breakdown:', processedData.reduce((acc, poi) => {
        acc[poi.category] = (acc[poi.category] || 0) + 1;
        return acc;
      }, {}));
      
      if (processedData.length === 0) {
        console.warn('⚠️ No data returned from query!');
        return [];
      }
      
      // STEP 4: Arricchisci con dati geo
      if (variantConfig.orderBy !== 'distance') {
        processedData = enrichWithGeoData(processedData);
      } else {
        processedData = enrichWithGeoData(processedData);
        processedData = sortByGeoEnhancedPriority(processedData);
      }
      
      console.log('✅ Final processed data:', processedData.length, 'items ready for display');
      
      return processedData;
    },
    enabled: !isABLoading,
    staleTime: 0, // No cache - sempre fresh
    gcTime: 0, // No cache retention
  });

  // Traccia visualizzazione carosello
  useEffect(() => {
    if (restaurants.length > 0) {
      trackMetric('homepage-restaurants', 'view');
      console.log('📈 Tracking view for', restaurants.length, 'restaurants');
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
      
      {/* Debug info in dev mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          A/B Variant: {variant} | Ordinamento: {variantConfig.orderBy} | Risultati: {restaurants.length}/{limit} | Categorie: {culinaryCategories.join(', ')} | FORCED REFRESH: {forceRefreshKey}
        </div>
      )}
    </div>
  );
};

export default RestaurantsSection;
