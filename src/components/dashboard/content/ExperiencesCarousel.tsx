
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import ExperienceCard from '@/components/ExperienceCard';

interface ExperiencesCarouselProps {
  experiences: any[];
  filters: {
    withChildren: string;
  };
}

const ExperiencesCarousel: React.FC<ExperiencesCarouselProps> = ({ experiences, filters }) => {
  return (
    <ContentCarousel 
      title={`Esperienze ${filters.withChildren === 'sì' ? 'Family-Friendly' : 'Personalizzate'}`}
      subtitle={`Attività selezionate in base alle tue preferenze`}
    >
      {experiences.map((exp, index) => (
        <ExperienceCard key={index} {...exp} />
      ))}
    </ContentCarousel>
  );
};

export default ExperiencesCarousel;
