
import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import MobileContainer from '@/components/ui/MobileContainer';
import ExperienceFilters from './ExperienceFilters';
import AppliedFilters from './AppliedFilters';
import SortingDropdown, { SortOption } from './SortingDropdown';
import SectionCarousel from './content/SectionCarousel';
import { usePersonalizedContent } from '@/hooks/usePersonalizedContent';
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
    timeSlots: [],
    budgets: [],
    specialPreferences: [],
    isFirstVisit: true
  });
  
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  // Usa hook di stabilizzazione filtri per prevenire loop infiniti
  const { stableFilters: memoizedFilters } = useStableFilters({
    zone: activeFilters.zone,
    category: activeFilters.activityTypes?.[0] || null,
    withChildren: activeFilters.withChildren,
    period: activeFilters.period
  }, 500);

  const { data: allPOIs, isLoading, error } = usePersonalizedContent(memoizedFilters);

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
      timeSlots: [],
      budgets: [],
      specialPreferences: [],
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
        case 'timeSlot':
          if (value) {
            newFilters.timeSlots = newFilters.timeSlots?.filter(slot => slot !== value) || [];
          }
          break;
        case 'budget':
          if (value) {
            newFilters.budgets = newFilters.budgets?.filter(budget => budget !== value) || [];
          }
          break;
        case 'specialPreference':
          if (value) {
            newFilters.specialPreferences = newFilters.specialPreferences?.filter(pref => pref !== value) || [];
          }
          break;
      }
      
      return newFilters;
    });
  }, [handleClearFilters]);

  // Filtri stabilizzati per ogni carosello usando hook ottimizzato
  const { stableFilters: experiencesFilters } = useStableFilters({
    with_children: activeFilters.withChildren === 'sì',
    experience_type: activeFilters.activityTypes?.[0] as any,
    withChildren: activeFilters.withChildren
  }, 300);


  const { stableFilters: eventsFilters } = useStableFilters({
    category: activeFilters.categories?.[0]
  }, 300);

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-600">Errore nel caricamento dei contenuti. Riprova più tardi.</p>
      </Card>
    );
  }

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
          />

          <SectionCarousel 
            section="Eventi"
            icon={Calendar}
            title="Eventi & Spettacoli"
            subtitle="Non perdere gli appuntamenti più interessanti del territorio"
            withChildren={activeFilters.withChildren === 'sì'}
          />

          <SectionCarousel 
            section="Natura & Avventura"
            icon={Mountain}
            title="Natura & Avventura"
            subtitle="Esplora la natura e vivi l'avventura in Romagna"
            withChildren={activeFilters.withChildren === 'sì'}
          />

          <SectionCarousel 
            section="Divertimento & Famiglia"
            icon={PartyPopper}
            title="Divertimento & Famiglia"
            subtitle="Attività perfette per tutta la famiglia"
            withChildren={activeFilters.withChildren === 'sì'}
          />

          <SectionCarousel 
            section="Cultura & Territorio"
            icon={MapPin}
            title="Cultura & Territorio"
            subtitle="Immergiti nella cultura e storia del territorio"
            withChildren={activeFilters.withChildren === 'sì'}
          />
        </div>
      </div>
    </MobileContainer>
  );
};

export default PersonalizedContent;
