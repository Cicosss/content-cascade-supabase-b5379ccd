
import React from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import POICard from '@/components/POICard';
import { Compass } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ExperiencesCarouselProps {
  experiences: any[];
  filters: {
    withChildren: string;
  };
  isLoading?: boolean;
}

const ExperiencesCarousel: React.FC<ExperiencesCarouselProps> = ({ 
  experiences, 
  filters, 
  isLoading = false 
}) => {
  const titleText = `Esperienze ${filters.withChildren === 'sì' ? 'Family-Friendly' : 'Personalizzate'}`;
  const subtitleText = `Attività selezionate in base alle tue preferenze`;

  return (
    <div className="space-y-4">
      <CarouselHeader icon={Compass} title={titleText} subtitle={subtitleText} />
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {isLoading ? (
            // Mostra 4 skeleton loaders durante il caricamento
            Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem key={`skeleton-${index}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                <POICard 
                  id=""
                  name=""
                  category=""
                  isLoading={true}
                />
              </CarouselItem>
            ))
          ) : (
            experiences.map((exp, index) => (
              <CarouselItem key={exp.id || index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                <POICard 
                  id={exp.id}
                  name={exp.name}
                  category={exp.category}
                  description={exp.description}
                  images={exp.images}
                  avg_rating={exp.avg_rating}
                  price_info={exp.price_info}
                />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default ExperiencesCarousel;
