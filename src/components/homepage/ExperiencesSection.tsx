
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CarouselHeader from '@/components/ui/CarouselHeader';
import UnifiedPOICard from '@/components/UnifiedPOICard';
import { Compass } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useABTesting, useCarouselMetrics } from '@/hooks/useABTesting';
import { useGeoFiltering } from '@/hooks/useGeoFiltering';
import { useDynamicLimits, useCarouselPerformance } from '@/hooks/useDynamicLimits';
import { useIntelligentCache } from '@/services/intelligentCacheService';

const ExperiencesSection: React.FC = () => {
  const { variant, variantConfig, isLoading: isABLoading } = useABTesting('homepage-experiences');
  const { enrichWithGeoData, sortByGeoEnhancedPriority, sortByDistance } = useGeoFiltering();
  const { limit } = useDynamicLimits('homepage');
  const { trackMetric } = useCarouselMetrics();
  const { startTimer } = useCarouselPerformance();
  const cache = useIntelligentCache();

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['territory-experiences', variant, limit],
    queryFn: async () => {
      const timer = startTimer();
      
      // Prova prima la cache
      const cacheKey = `homepage-experiences-${variant}`;
      const cachedData = cache.get(cacheKey, { limit, orderBy: variantConfig.orderBy });
      if (cachedData) {
        timer.endLoad();
        return cachedData;
      }

      let query = supabase
        .from('points_of_interest')
        .select('*')
        .neq('category', 'Ristoranti')
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
      timer.endLoad();
      
      if (error) throw error;
      
      let processedData = data || [];
      
      // Arricchisci con dati geo
      processedData = enrichWithGeoData(processedData);
      
      // Applica ordinamento geo se richiesto
      if (variantConfig.orderBy === 'distance') {
        processedData = sortByDistance(processedData);
      } else {
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
    if (experiences.length > 0) {
      trackMetric('homepage-experiences', 'view');
    }
  }, [experiences.length, trackMetric]);

  if (isLoading || isABLoading || experiences.length === 0) {
    return null; // Don't show section if no experiences
  }

  // Handler per click su card
  const handleCardClick = (experienceId: string, position: number) => {
    trackMetric('homepage-experiences', 'click', experienceId, position);
  };

  return (
    <div className="space-y-4">
      <CarouselHeader 
        icon={Compass}
        title={variantConfig.title || "Esperienze del Territorio"}
        subtitle="Scopri la cultura, la storia e le tradizioni marinare della Provincia di Rimini"
      />
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {experiences.map((exp, index) => (
            <CarouselItem key={exp.id || index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
              <div onClick={() => handleCardClick(exp.id, index)} className="relative">
                <UnifiedPOICard 
                  id={exp.id}
                  name={exp.name}
                  category={exp.category}
                  description={exp.description}
                  images={exp.images}
                  avg_rating={exp.avg_rating}
                  price_info={exp.price_info}
                  duration_info={exp.duration_info}
                  target_audience={exp.target_audience}
                  address={exp.address}
                  startDatetime={exp.start_datetime}
                  endDatetime={exp.end_datetime}
                  poiType={exp.poi_type as 'place' | 'event' | 'experience'}
                  isLoading={false}
                />
                {/* Badge per mostrare distanza se disponibile */}
                {exp.distance_km && exp.distance_km < 50 && (
                  <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {exp.distance_km}km
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
          A/B Variant: {variant} | Ordinamento: {variantConfig.orderBy} | Risultati: {experiences.length}/{limit}
        </div>
      )}
    </div>
  );
};

export default ExperiencesSection;
