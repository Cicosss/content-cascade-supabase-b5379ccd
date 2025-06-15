
import React from 'react';
import GuestCard from '@/components/GuestCard';
import ServicesSection from '@/components/ServicesSection';
import RestaurantsCarousel from './content/RestaurantsCarousel';
import ExperiencesCarousel from './content/ExperiencesCarousel';
import EventsCarousel from './content/EventsCarousel';
import HelpBanner from './content/HelpBanner';
import { usePersonalizedContent } from '@/hooks/usePersonalizedContent';
import { transformPoisToRestaurants, transformPoisToExperiences, transformEventsToCards } from '@/utils/contentTransformers';
import { fallbackRestaurants, fallbackExperiences, fallbackEvents } from './content/FallbackData';

interface PersonalizedContentProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
}

const PersonalizedContent: React.FC<PersonalizedContentProps> = ({ filters }) => {
  const { pois, events } = usePersonalizedContent(filters);

  // Transform data
  const restaurants = transformPoisToRestaurants(pois);
  const experiences = transformPoisToExperiences(pois);
  const formattedEvents = transformEventsToCards(events);

  // Use fallback data if database is empty
  const displayRestaurants = restaurants.length > 0 ? restaurants : fallbackRestaurants;
  const displayExperiences = experiences.length > 0 ? experiences : fallbackExperiences;
  const displayEvents = formattedEvents.length > 0 ? formattedEvents : fallbackEvents;

  return (
    <div className="space-y-16">
      <RestaurantsCarousel restaurants={displayRestaurants} filters={filters} />
      
      <ExperiencesCarousel experiences={displayExperiences} filters={filters} />
      
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
