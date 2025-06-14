import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ContentCarousel from '@/components/ContentCarousel';
import RestaurantCard from '@/components/RestaurantCard';
import EventCard from '@/components/EventCard';
import ExperienceCard from '@/components/ExperienceCard';
import GuestCard from '@/components/GuestCard';
import ServicesSection from '@/components/ServicesSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, HelpCircle } from 'lucide-react';

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
  const { user } = useAuth();
  const [pois, setPois] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchPersonalizedContent();
  }, [filters, user]);

  const fetchPersonalizedContent = async () => {
    // Fetch POIs based on filters
    let poiQuery = supabase.from('points_of_interest').select('*');
    
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
      poiQuery = poiQuery.in('category', filters.activityTypes);
    }

    if (filters.withChildren === 'sì') {
      poiQuery = poiQuery.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    const { data: poisData } = await poiQuery.limit(10);
    setPois(poisData || []);

    // Fetch events
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .gte('start_datetime', new Date().toISOString())
      .limit(8);
    setEvents(eventsData || []);
  };

  // Convert POIs to different formats for carousels
  const restaurants = pois
    .filter(poi => poi.poi_type === 'restaurant' || poi.category === 'cibo')
    .map(poi => ({
      name: poi.name,
      cuisine: poi.description || 'Cucina Locale',
      rating: poi.avg_rating || 4.5,
      priceRange: poi.price_info || '€€',
      location: poi.address || 'Romagna',
      image: poi.images?.[0] || '🍝',
      specialty: poi.description
    }));

  const experiences = pois
    .filter(poi => poi.poi_type === 'experience' || 
                  ['sport', 'arte e cultura', 'parchi e natura', 'intrattenimento'].includes(poi.category))
    .map(poi => ({
      title: poi.name,
      image: poi.images?.[0] || '🎭',
      rating: poi.avg_rating || 4.5,
      duration: poi.duration_info || '2h',
      groupSize: 'Max 15 persone',
      price: poi.price_info || '€25',
      category: poi.category || 'Esperienza'
    }));

  const formattedEvents = events.map(event => ({
    title: event.name,
    date: new Date(event.start_datetime).toLocaleDateString('it-IT'),
    time: new Date(event.start_datetime).toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    location: event.location_name || event.address || 'Romagna',
    category: event.category || 'Evento',
    image: event.images?.[0] || '🎉'
  }));

  // Aggiungiamo le esperienze dalla homepage per i test
  const fallbackExperiences = [
    {
      title: "Tour guidato del centro storico di Rimini",
      image: "🏛️ Centro Storico",
      rating: 4.8,
      duration: "2h",
      groupSize: "Max 15",
      price: "€25",
      category: "Arte e Cultura"
    },
    {
      title: "Degustazione di piadina romagnola autentica",
      image: "🥟 Piadina Tour",
      rating: 4.9,
      duration: "1.5h",
      groupSize: "Max 12",
      price: "€18",
      category: "Tradizione Culinaria"
    },
    {
      title: "Escursione in bicicletta lungo la costa",
      image: "🚴‍♀️ Bike Tour",
      rating: 4.7,
      duration: "3h",
      groupSize: "Max 10",
      price: "€35",
      category: "Outdoor"
    },
    {
      title: "Esperienza alle Terme di Riccione",
      image: "💧 Terme Relax",
      rating: 4.6,
      duration: "4h",
      groupSize: "Max 20",
      price: "€45",
      category: "Benessere"
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
    },
    {
      name: "Il Pescatore del Porto Antico",
      cuisine: "Pesce Fresco dell'Adriatico",
      rating: 4.7,
      priceRange: "€€€€",
      location: "Porto Canale di Cesenatico",
      image: "🐟 Pescatore",
      specialty: "Brodetto di pesce secondo la ricetta marinara tradizionale"
    },
    {
      name: "Agriturismo Terre di Romagna Bio",
      cuisine: "Km Zero e Agricoltura Sostenibile",
      rating: 4.6,
      priceRange: "€€",
      location: "Colline dell'Entroterra Riminese",
      image: "🌾 Terre Bio",
      specialty: "Passatelli in brodo con erbe spontanee dell'Appennino"
    }
  ];

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

  // Use fallback data if database is empty
  const displayRestaurants = restaurants.length > 0 ? restaurants : fallbackRestaurants;
  const displayExperiences = experiences.length > 0 ? experiences : fallbackExperiences;
  const displayEvents = formattedEvents.length > 0 ? formattedEvents : fallbackEvents;

  return (
    <div className="space-y-16">
      {/* Personalized Restaurants */}
      <ContentCarousel 
        title={`Tradizione Culinaria${filters.isFirstVisit ? ' per Visitatori' : ' Autentica'}`}
        subtitle={`I sapori della Romagna ${filters.withChildren === 'sì' ? 'per tutta la famiglia' : 'selezionati per te'}`}
      >
        {displayRestaurants.map((restaurant, index) => (
          <RestaurantCard key={index} {...restaurant} />
        ))}
      </ContentCarousel>

      {/* Personalized Experiences */}
      <ContentCarousel 
        title={`Esperienze ${filters.withChildren === 'sì' ? 'Family-Friendly' : 'Personalizzate'}`}
        subtitle={`Attività selezionate in base alle tue preferenze`}
      >
        {displayExperiences.map((exp, index) => (
          <ExperienceCard key={index} {...exp} />
        ))}
      </ContentCarousel>

      {/* Personalized Events */}
      <ContentCarousel 
        title="Eventi nella tua zona"
        subtitle="Non perdere gli appuntamenti più interessanti del territorio"
      >
        {displayEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </ContentCarousel>

      {/* Fixed Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GuestCard />
        
        {/* Help Banner */}
        <Card className="p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl border-0 shadow-xl">
          <div className="flex items-center mb-4">
            <HelpCircle className="h-8 w-8 mr-3" />
            <h3 className="text-2xl font-bold">Hai bisogno d'aiuto?</h3>
          </div>
          <p className="text-green-100 mb-6 text-lg">
            Il nostro team di esperti locali è sempre disponibile per consigli personalizzati
          </p>
          <Button className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-xl">
            Contatta un Esperto
          </Button>
        </Card>
      </div>

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
};

export default PersonalizedContent;
