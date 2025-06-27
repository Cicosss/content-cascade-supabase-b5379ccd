
import React from 'react';
import { 
  useHomepageRestaurants, 
  useHomepageExperiences, 
  useHomepageEvents, 
  useHomepageServices 
} from '@/hooks/useHomepageData';

// Mock data di fallback per quando i dati reali non sono disponibili
const fallbackEvents = [
  {
    title: "Notte Rosa 2024 - Il Rosa che Accende l'Estate",
    date: "6 Luglio 2024",
    time: "21:00",
    location: "Riviera Romagnola",
    category: "Festival Storico",
    image: "🌹 Notte Rosa"
  },
  {
    title: "Festival Internazionale della Piadina Romagnola IGP",
    date: "12 Luglio 2024",
    time: "10:00",
    location: "Piazza Cavour, Rimini",
    category: "Tradizione Culinaria",
    image: "🥟 Festival Piadina"
  }
];

const fallbackRestaurants = [
  {
    name: "Osteria del Borgo Antico",
    cuisine: "Tradizione Culinaria Romagnola Autentica",
    rating: 4.9,
    priceRange: "€€€",
    location: "Centro Storico di Rimini",
    image: "🍝 Borgo Antico",
    specialty: "Cappelletti in brodo di cappone della nonna Maria"
  },
  {
    name: "La Vera Piadineria Artigianale dal 1952",
    cuisine: "Street Food Romagnolo Tradizionale",
    rating: 4.8,
    priceRange: "€",
    location: "Borgo San Giuliano",
    image: "🥟 Piadineria 1952",
    specialty: "Piadina sfogliata con squacquerone DOP e rucola selvatica"
  }
];

const fallbackExperiences = [
  {
    id: 'tour-tempio-malatestiano',
    name: "Tour Guidato Tempio Malatestiano - Capolavoro Rinascimentale",
    title: "Tour Guidato Tempio Malatestiano - Capolavoro Rinascimentale",
    image: "🏛️ Tempio Malatestiano",
    rating: 4.9,
    duration: "2h",
    groupSize: "Max 15 persone",
    price: "€18",
    category: "Patrimonio UNESCO"
  },
  {
    id: 'laboratorio-ceramica-faentina',
    name: "Laboratorio di Ceramica Faentina - Arte Millenaria",
    title: "Laboratorio di Ceramica Faentina - Arte Millenaria",
    image: "🏺 Ceramica Faenza",
    rating: 4.8,
    duration: "3h",
    groupSize: "Max 8 persone",
    price: "€35",
    category: "Tradizione Artigianale"
  }
];

const fallbackFamilyExperiences = [
  {
    id: 'parco-avventura-famiglia-index',
    name: "Parco Avventura Famiglia - Percorsi Acrobatici",
    title: "Parco Avventura Famiglia - Percorsi Acrobatici",
    image: "🌳 Parco Avventura",
    rating: 4.8,
    duration: "4h",
    groupSize: "Famiglie (età 4+)",
    price: "€25",
    category: "Avventura Outdoor"
  }
];

export const useHomepageData = () => {
  const { data: realRestaurants, isLoading: restaurantsLoading, error: restaurantsError } = useHomepageRestaurants();
  const { data: realExperiences, isLoading: experiencesLoading, error: experiencesError } = useHomepageExperiences();
  const { data: realEvents, isLoading: eventsLoading, error: eventsError } = useHomepageEvents();
  const { data: services } = useHomepageServices();

  console.log('📊 Homepage data status:', {
    restaurants: { count: realRestaurants?.length || 0, loading: restaurantsLoading, error: !!restaurantsError },
    experiences: { count: realExperiences?.length || 0, loading: experiencesLoading, error: !!experiencesError },
    events: { count: realEvents?.length || 0, loading: eventsLoading, error: !!eventsError }
  });

  // Usa i dati reali se disponibili, altrimenti usa i fallback
  const events = (!eventsLoading && !eventsError && realEvents?.length > 0) 
    ? realEvents 
    : fallbackEvents;

  const restaurants = (!restaurantsLoading && !restaurantsError && realRestaurants?.length > 0) 
    ? realRestaurants 
    : fallbackRestaurants;

  const territoryExperiences = (!experiencesLoading && !experiencesError && realExperiences?.length > 0) 
    ? realExperiences 
    : fallbackExperiences;

  // Per le esperienze family, filtriamo dalle esperienze generali quelle adatte alle famiglie
  const familyExperiences = (!experiencesLoading && !experiencesError && realExperiences?.length > 0) 
    ? realExperiences.filter(exp => exp.category?.toLowerCase().includes('famiglia') || exp.category?.toLowerCase().includes('family'))
    : fallbackFamilyExperiences;

  return {
    events,
    restaurants,
    territoryExperiences,
    familyExperiences: familyExperiences.length > 0 ? familyExperiences : fallbackFamilyExperiences,
    services,
    isLoading: restaurantsLoading || experiencesLoading || eventsLoading,
    hasRealData: {
      restaurants: !restaurantsError && realRestaurants?.length > 0,
      experiences: !experiencesError && realExperiences?.length > 0,
      events: !eventsError && realEvents?.length > 0
    }
  };
};
