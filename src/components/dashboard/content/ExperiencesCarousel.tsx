
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import POICard from '@/components/POICard';
import { Compass } from 'lucide-react';

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
        {isLoading ? (
          // Mostra 4 skeleton loaders durante il caricamento
          Array.from({ length: 4 }).map((_, index) => (
            <POICard 
              key={`skeleton-${index}`}
              id=""
              name=""
              category=""
              isLoading={true}
            />
          ))
        ) : (
          experiences.map((exp, index) => (
            <POICard 
              key={exp.id || index} 
              id={exp.id}
              name={exp.name}
              category={exp.category}
              description={exp.description}
              images={exp.images}
              avg_rating={exp.avg_rating}
              price_info={exp.price_info}
              latitude={exp.latitude}
              longitude={exp.longitude}
            />
          ))
        )}
      </ContentCarousel>
    </div>
  );
};

export default ExperiencesCarousel;
