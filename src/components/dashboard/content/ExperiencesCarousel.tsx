
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import CarouselHeader from '@/components/ui/CarouselHeader';
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
      <CarouselHeader icon={Compass} title={titleText} subtitle={subtitleText} />
      <ContentCarousel>
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
            />
          ))
        )}
      </ContentCarousel>
    </div>
  );
};

export default ExperiencesCarousel;
