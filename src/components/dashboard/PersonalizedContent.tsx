
import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import MobileContainer from '@/components/ui/MobileContainer';
import ExperienceFilters from './ExperienceFilters';
import AppliedFilters from './AppliedFilters';
import SortingDropdown, { SortOption } from './SortingDropdown';
import SectionCarousel from './content/SectionCarousel';
import { useStableFilters } from '@/hooks/useStableFilters';
import { 
  UtensilsCrossed, 
  Calendar, 
  Mountain, 
  PartyPopper, 
  MapPin 
} from 'lucide-react';

const PersonalizedContent = () => {
  const [activeFilters, setActiveFilters] = useState({
    zone: 'tuttalromagna',
    withChildren: 'no',
    activityTypes: [],
    period: undefined,
    categories: [],
    isFirstVisit: true
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('recommended');


  const handleFilterChange = useCallback((newFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      ...newFilters,
      isFirstVisit: false
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({
      zone: 'tuttalromagna',
      withChildren: 'no',
      activityTypes: [],
      period: undefined,
      categories: [],
      isFirstVisit: false
    });
  }, []);

  const handleRemoveFilter = useCallback((filterType: string, value?: string) => {
    if (filterType === 'all') {
      handleClearFilters();
      return;
    }

    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'zone':
          newFilters.zone = 'tuttalromagna';
          break;
        case 'category':
          if (value) {
            newFilters.categories = newFilters.categories.filter(cat => cat !== value);
            newFilters.activityTypes = newFilters.activityTypes.filter(cat => cat !== value);
          }
          break;
        case 'period':
          newFilters.period = undefined;
          break;
      }
      
      return newFilters;
    });
  }, [handleClearFilters]);

  return (
    <MobileContainer variant="default" paddingTop="md" paddingBottom="lg">
      <div className="space-y-6 md:space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                I Tuoi Contenuti Personalizzati
              </h2>
              <p className="text-slate-600 mt-1">
                Scopri esperienze su misura per te in Romagna
              </p>
            </div>
            <SortingDropdown 
              sortBy={sortBy} 
              onSortChange={setSortBy} 
            />
          </div>
          
          <ExperienceFilters 
            filters={activeFilters}
            setFilters={handleFilterChange}
          />
          
          <AppliedFilters 
            filters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
          />
        </div>

        <div className="space-y-6 md:space-y-8">
          <SectionCarousel 
            section="Gusto & Sapori"
            icon={UtensilsCrossed}
            title="Gusto & Sapori"
            subtitle="Scopri i sapori autentici della Romagna"
            withChildren={activeFilters.withChildren === 'sì'}
            categoryFilters={activeFilters.categories}
          />

          <SectionCarousel 
            section="Eventi"
            icon={Calendar}
            title="Eventi"
            subtitle="Non perdere gli appuntamenti più interessanti del territorio"
            withChildren={activeFilters.withChildren === 'sì'}
            categoryFilters={activeFilters.categories}
          />

          <SectionCarousel 
            section="Natura & Avventura"
            icon={Mountain}
            title="Natura & Avventura"
            subtitle="Esplora la natura e vivi l'avventura in Romagna"
            withChildren={activeFilters.withChildren === 'sì'}
            categoryFilters={activeFilters.categories}
          />

          <SectionCarousel 
            section="Divertimento & Famiglia"
            icon={PartyPopper}
            title="Divertimento & Famiglia"
            subtitle="Attività perfette per tutta la famiglia"
            withChildren={activeFilters.withChildren === 'sì'}
            categoryFilters={activeFilters.categories}
          />

          <SectionCarousel 
            section="Cultura & Territorio"
            icon={MapPin}
            title="Cultura & Territorio"
            subtitle="Immergiti nella cultura e storia del territorio"
            withChildren={activeFilters.withChildren === 'sì'}
            categoryFilters={activeFilters.categories}
          />
        </div>
      </div>
    </MobileContainer>
  );
};

export default PersonalizedContent;
