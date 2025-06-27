
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import ExperienceCard from '@/components/ExperienceCard';

interface FamilySectionProps {
  familyExperiences: any[];
}

const FamilySection: React.FC<FamilySectionProps> = ({ familyExperiences }) => {
  return (
    <ContentCarousel 
      title="Sezione Family - Divertimento per Tutti" 
      subtitle="Esperienze pensate per creare ricordi indimenticabili in famiglia"
    >
      {familyExperiences.map((exp, index) => (
        <ExperienceCard key={index} {...exp} />
      ))}
    </ContentCarousel>
  );
};

export default FamilySection;
