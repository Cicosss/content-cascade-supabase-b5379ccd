
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContentCarousel from '@/components/ContentCarousel';
import ExperienceCard from '@/components/ExperienceCard';
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
        <ExperienceCard 
          key={exp.id || index}
          id={exp.id}
          name={exp.name}
          description={exp.description}
          images={exp.images}
          rating={exp.avg_rating || 0}
          duration_info={exp.duration_info || ''}
          groupSize="Max 20"
          price_info={exp.price_info || ''}
          category={exp.category}
          address={exp.address}
          location_name={exp.location_name}
          poi_type={exp.poi_type as 'place' | 'event'}
        />
      ))}
    </ContentCarousel>
  );
};

export default FamilySection;
