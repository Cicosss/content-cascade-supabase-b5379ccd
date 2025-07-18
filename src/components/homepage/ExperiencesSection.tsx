
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContentCarousel from '@/components/ContentCarousel';
import CarouselHeader from '@/components/ui/CarouselHeader';
import POICard from '@/components/POICard';
import { Compass } from 'lucide-react';

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
      <ContentCarousel>
      {experiences.map((exp, index) => (
        <POICard 
          key={exp.id || index}
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
      ))}
      </ContentCarousel>
    </div>
  );
};

export default ExperiencesSection;
