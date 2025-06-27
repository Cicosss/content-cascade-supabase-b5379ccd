
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import ExperienceCard from '@/components/ExperienceCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ExperiencesSectionProps {
  territoryExperiences: any[];
  isLoading?: boolean;
  hasRealData?: boolean;
}

const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ 
  territoryExperiences, 
  isLoading = false,
  hasRealData = false 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="min-w-80 p-4">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ContentCarousel 
        title="Esperienze del Territorio" 
        subtitle={hasRealData 
          ? "Esperienze autentiche della Provincia di Rimini dal nostro database" 
          : "Scopri la cultura, la storia e le tradizioni marinare della Provincia di Rimini"
        }
      >
        {territoryExperiences.map((exp, index) => (
          <ExperienceCard key={index} {...exp} />
        ))}
      </ContentCarousel>
      {hasRealData && (
        <p className="text-sm text-green-600 mt-2 text-center">
          ✅ Dati caricati dal database Supabase
        </p>
      )}
    </div>
  );
};

export default ExperiencesSection;
