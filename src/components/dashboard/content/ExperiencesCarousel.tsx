
import React from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import UnifiedPOICard from '@/components/UnifiedPOICard';
import CarouselErrorBoundary from '@/components/carousel/CarouselErrorBoundary';
import CarouselLoadingState from '@/components/carousel/CarouselLoadingState';
import { Compass } from 'lucide-react';
import { useSimpleCarousel } from '@/hooks/useSimpleCarousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ExperiencesCarouselProps {
  withChildren?: boolean;
  title?: string;
  subtitle?: string;
  section?: string;
}

const ExperiencesCarousel: React.FC<ExperiencesCarouselProps> = ({ 
  withChildren = false,
  title,
  subtitle,
  section = "Gusto & Sapori"
}) => {
  const dynamicTitle = title || `Esperienze ${withChildren ? 'Family-Friendly' : 'Personalizzate'}`;
  const dynamicSubtitle = subtitle || `Attività selezionate in base alle tue preferenze`;

  const { data: experiences, isLoading, error, retry, isEmpty } = useSimpleCarousel(section as any, { withChildren, limit: 8 });

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
    <section className="space-y-4">
      <CarouselHeader icon={Compass} title={dynamicTitle} subtitle={dynamicSubtitle} />
      

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {experiences.map((exp, index) => (
            <CarouselItem key={exp.id || index} className="pl-3 md:pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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
                location_name={exp.location_name}
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
    </section>
  );
};

export default ExperiencesCarousel;
