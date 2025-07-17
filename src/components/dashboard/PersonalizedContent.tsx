
import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import ExperienceFilters from './ExperienceFilters';
import AppliedFilters from './AppliedFilters';
import SortingDropdown, { SortOption } from './SortingDropdown';
import ExperiencesCarousel from './content/ExperiencesCarousel';
import RestaurantsCarousel from './content/RestaurantsCarousel';
import EventsCarousel from './content/EventsCarousel';
import { usePersonalizedContent } from '@/hooks/usePersonalizedContent';

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

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => ({
    zone: activeFilters.zone,
    category: activeFilters.activityTypes?.[0] || null,
    withChildren: activeFilters.withChildren,
    period: activeFilters.period
  }), [activeFilters.zone, activeFilters.activityTypes, activeFilters.withChildren, activeFilters.period]);

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

  // Filter and sort data
  const { experiences, restaurants, events } = useMemo(() => {
    if (!allPOIs || allPOIs.length === 0) {
      return { experiences: [], restaurants: [], events: [] };
    }

    const experiences = allPOIs.filter(poi => 
      poi.poi_type === 'place' && 
      poi.category !== 'Ristoranti'
    );
    
    const restaurants = allPOIs.filter(poi => 
      poi.category === 'Ristoranti'
    );
    
    const events = allPOIs.filter(poi => 
      poi.poi_type === 'event'
    );

    return { experiences, restaurants, events };
  }, [allPOIs]);

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-600">Errore nel caricamento dei contenuti. Riprova più tardi.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
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
      </Card>

      <div className="space-y-6">
        <ExperiencesCarousel 
          experiences={experiences}
          filters={activeFilters}
          isLoading={isLoading}
        />
        
        <RestaurantsCarousel 
          restaurants={restaurants}
          filters={activeFilters}
          isLoading={isLoading}
        />
        
        <EventsCarousel 
          events={events}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PersonalizedContent;
