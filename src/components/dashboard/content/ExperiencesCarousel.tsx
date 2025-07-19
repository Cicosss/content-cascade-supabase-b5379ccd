
import React from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import UnifiedPOICard from '@/components/UnifiedPOICard';
import CarouselErrorBoundary from '@/components/carousel/CarouselErrorBoundary';
import CarouselLoadingState from '@/components/carousel/CarouselLoadingState';
import { Compass } from 'lucide-react';
import { useCarouselAPI } from '@/hooks/useCarouselAPI';
import { ExperienceFilters } from '@/types/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ExperiencesCarouselProps {
  filters?: ExperienceFilters & {
    withChildren: string;
  };
  title?: string;
  subtitle?: string;
}

const ExperiencesCarousel: React.FC<ExperiencesCarouselProps> = ({ 
  filters = { withChildren: 'no' },
  title,
  subtitle
}) => {
  // Transform filters for the API
  const apiFilters: ExperienceFilters = {
    with_children: filters.withChildren === 'sì',
    experience_type: filters.experience_type,
    difficulty_level: filters.difficulty_level
  };

  const dynamicTitle = title || `Esperienze ${filters.withChildren === 'sì' ? 'Family-Friendly' : 'Personalizzate'}`;
  const dynamicSubtitle = subtitle || `Attività selezionate in base alle tue preferenze`;

  const { data: experiences, isLoading, error, retry, isEmpty, metrics } = useCarouselAPI('experiences', apiFilters);

  // Show loading state
  if (isLoading) {
    return <CarouselLoadingState carouselType="esperienze" />;
  }

  // Show error state with recovery options
  if (error) {
    return (
      <div className="space-y-4">
        <CarouselHeader icon={Compass} title={dynamicTitle} subtitle={dynamicSubtitle} />
        <CarouselErrorBoundary 
          error={error} 
          onRetry={retry}
          showDetails={true}
        />
      </div>
    );
  }

  // Show empty state
  if (isEmpty) {
    return (
      <div className="space-y-4">
        <CarouselHeader icon={Compass} title={dynamicTitle} subtitle={dynamicSubtitle} />
        <div className="text-center py-8 text-gray-500">
          <Compass className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nessuna esperienza trovata per i criteri selezionati.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CarouselHeader icon={Compass} title={dynamicTitle} subtitle={dynamicSubtitle} />
      
      {/* Performance metrics (dev mode only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 flex space-x-4">
          <span>⚡ {metrics.responseTime}ms</span>
          <span>{metrics.cacheHit ? '📋 Cache hit' : '🌐 Fresh'}</span>
          {metrics.retryCount > 0 && <span>🔄 {metrics.retryCount} retry</span>}
          <span>🎯 Score: {experiences[0]?.priority_score?.toFixed(1) || 'N/A'}</span>
        </div>
      )}

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
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      
      <div className="text-xs text-gray-400 text-right">
        {experiences.length} esperienze • Aggiornato {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ExperiencesCarousel;
