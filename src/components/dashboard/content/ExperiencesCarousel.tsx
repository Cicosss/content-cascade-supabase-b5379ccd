
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import ExperienceCard from '@/components/ExperienceCard';
import { Compass } from 'lucide-react';

interface ExperiencesCarouselProps {
  experiences: any[];
  filters: {
    withChildren: string;
  };
}

const ExperiencesCarousel: React.FC<ExperiencesCarouselProps> = ({ experiences, filters }) => {
  const titleText = `Esperienze ${filters.withChildren === 'sì' ? 'Family-Friendly' : 'Personalizzate'}`;
  const subtitleText = `Attività selezionate in base alle tue preferenze`;

  return (
    <div className="space-y-4">
      {/* Titolo Sezione Uniforme */}
      <div className="flex items-center gap-3">
        <Compass className="h-6 w-6 text-blue-800" strokeWidth={1.5} />
        <div>
          <h2 className="text-2xl font-bold text-blue-800">{titleText}</h2>
          <p className="text-slate-600 text-sm">{subtitleText}</p>
        </div>
      </div>
      
      <ContentCarousel 
        title=""
        subtitle=""
      >
        {experiences.map((exp, index) => (
          <ExperienceCard key={exp.id || index} {...exp} />
        ))}
      </ContentCarousel>
    </div>
  );
};

export default ExperiencesCarousel;
