
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import ExperienceCard from '@/components/ExperienceCard';

interface ExperiencesSectionProps {
  territoryExperiences: any[];
}

const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ territoryExperiences }) => {
  return (
    <ContentCarousel 
      title="Esperienze del Territorio" 
      subtitle="Scopri la cultura, la storia e le tradizioni marinare della Provincia di Rimini"
    >
      {territoryExperiences.map((exp, index) => (
        <ExperienceCard key={index} {...exp} />
      ))}
    </ContentCarousel>
  );
};

export default ExperiencesSection;
