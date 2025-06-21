
import React from 'react';
import GuestCard from '@/components/GuestCard';
import ServicesSection from '@/components/ServicesSection';
import RestaurantsCarousel from './content/RestaurantsCarousel';
import ExperiencesCarousel from './content/ExperiencesCarousel';
import EventsCarousel from './content/EventsCarousel';
import HelpBanner from './content/HelpBanner';
import AppliedFilters from './AppliedFilters';
import SortingDropdown, { SortOption } from './SortingDropdown';
import { usePersonalizedContent } from '@/hooks/usePersonalizedContent';
import { transformPoisToRestaurants, transformPoisToExperiences, transformEventsToCards } from '@/utils/contentTransformers';
import { fallbackRestaurants, fallbackExperiences, fallbackEvents } from './content/FallbackData';
import { DateRange } from 'react-day-picker';

interface PersonalizedContentProps {
  filters: {
    categories: string[];
    zone: string;
    period: DateRange | undefined;
    timeSlots?: string[];
    budgets?: string[];
    specialPreferences?: string[];
    sortBy: SortOption;
  };
  onUpdateFilters?: (filters: any) => void;
  onUpdateSortBy?: (sortBy: SortOption) => void;
}

const PersonalizedContent: React.FC<PersonalizedContentProps> = ({ 
  filters, 
  onUpdateFilters, 
  onUpdateSortBy 
}) => {
  // Transform filters for usePersonalizedContent hook
  const transformedFilters = {
    zone: filters.zone,
    withChildren: 'no',
    activityTypes: filters.categories,
    period: filters.period, 
    isFirstVisit: true
  };

  const { pois, events } = usePersonalizedContent(transformedFilters);

  // Transform data
  const restaurants = transformPoisToRestaurants(pois);
  const experiences = transformPoisToExperiences(pois);
  const formattedEvents = transformEventsToCards(events);

  // Use fallback data if database is empty
  const displayRestaurants = restaurants.length > 0 ? restaurants : fallbackRestaurants;
  const displayExperiences = experiences.length > 0 ? experiences : fallbackExperiences;
  const displayEvents = formattedEvents.length > 0 ? formattedEvents : fallbackEvents;

  // Determine which sorting options to show
  const showDistanceOption = filters.zone !== 'tuttalromagna'; // Show distance when specific zone is selected
  const showChronologicalOption = !!filters.period?.from; // Show chronological when date is selected

  const handleRemoveFilter = (filterType: string, value?: string) => {
    if (!onUpdateFilters) return;

    let updatedFilters = { ...filters };

    switch (filterType) {
      case 'zone':
        updatedFilters.zone = 'tuttalromagna';
        break;
      case 'category':
        if (value) {
          updatedFilters.categories = updatedFilters.categories.filter(cat => cat !== value);
          if (updatedFilters.categories.length === 0) {
            updatedFilters.categories = ['tutte'];
          }
        }
        break;
      case 'period':
        updatedFilters.period = undefined;
        break;
      case 'timeSlot':
        if (value && updatedFilters.timeSlots) {
          updatedFilters.timeSlots = updatedFilters.timeSlots.filter(slot => slot !== value);
        }
        break;
      case 'budget':
        if (value && updatedFilters.budgets) {
          updatedFilters.budgets = updatedFilters.budgets.filter(budget => budget !== value);
        }
        break;
      case 'specialPreference':
        if (value && updatedFilters.specialPreferences) {
          updatedFilters.specialPreferences = updatedFilters.specialPreferences.filter(pref => pref !== value);
        }
        break;
      case 'all':
        updatedFilters = {
          categories: ['tutte'],
          zone: 'tuttalromagna',
          period: undefined,
          timeSlots: [],
          budgets: [],
          specialPreferences: [],
          sortBy: 'popularity'
        };
        break;
    }

    onUpdateFilters(updatedFilters);
  };

  return (
    <div className="space-y-16">
      <AppliedFilters filters={filters} onRemoveFilter={handleRemoveFilter} />
      
      <SortingDropdown
        sortBy={filters.sortBy}
        onSortChange={onUpdateSortBy || (() => {})}
        showDistanceOption={showDistanceOption}
        showChronologicalOption={showChronologicalOption}
      />
      
      <RestaurantsCarousel restaurants={displayRestaurants} filters={transformedFilters} />
      
      <ExperiencesCarousel experiences={displayExperiences} filters={transformedFilters} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GuestCard />
        <HelpBanner />
      </div>
      
      <EventsCarousel events={displayEvents} />

      <ServicesSection />
    </div>
  );
};

export default PersonalizedContent;
