
import React from 'react';
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

const ExperiencesSection: React.FC = () => {
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['territory-experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .neq('category', 'Ristoranti')
        .eq('status', 'approved')
        .limit(6);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading || experiences.length === 0) {
    return null; // Don't show section if no experiences
  }

  return (
    <div className="space-y-4">
      <CarouselHeader 
        icon={Compass}
        title="Esperienze del Territorio" 
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
    </div>
  );
};

export default ExperiencesSection;
