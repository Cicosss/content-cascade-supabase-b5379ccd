
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContentCarousel from '@/components/ContentCarousel';
import POICard from '@/components/POICard';
import { Users } from 'lucide-react';

const FamilySection: React.FC = () => {
  const { data: familyExperiences = [], isLoading } = useQuery({
    queryKey: ['family-experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .contains('tags', ['famiglia'])
        .eq('status', 'approved')
        .limit(6);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading || familyExperiences.length === 0) {
    return null; // Don't show section if no family experiences
  }

  return (
    <ContentCarousel 
      title="Sezione Family - Divertimento per Tutti" 
      subtitle="Esperienze pensate per creare ricordi indimenticabili in famiglia"
      icon={Users}
    >
      {familyExperiences.map((exp, index) => (
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
  );
};

export default FamilySection;
