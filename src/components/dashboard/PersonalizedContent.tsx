
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

  return (
    <div className="space-y-16">
      {/* Personalized Restaurants */}
      {restaurants.length > 0 && (
        <ContentCarousel 
          title={`Tradizione Culinaria${filters.isFirstVisit ? ' per Visitatori' : ' Autentica'}`}
          subtitle={`I sapori della Romagna ${filters.withChildren === 'sì' ? 'per tutta la famiglia' : 'selezionati per te'}`}
        >
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={index} {...restaurant} />
          ))}
        </ContentCarousel>
      )}

      {/* Personalized Experiences */}
      {experiences.length > 0 && (
        <ContentCarousel 
          title={`Esperienze ${filters.withChildren === 'sì' ? 'Family-Friendly' : 'Personalizzate'}`}
          subtitle={`Attività selezionate in base alle tue preferenze`}
        >
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} {...exp} />
          ))}
        </ContentCarousel>
      )}

      {/* Personalized Events */}
      {formattedEvents.length > 0 && (
        <ContentCarousel 
          title="Eventi nella tua zona"
          subtitle="Non perdere gli appuntamenti più interessanti del territorio"
        >
          {formattedEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </ContentCarousel>
      )}

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

      {/* App Download Banner */}
      <Card className="p-10 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white border-0 shadow-2xl rounded-3xl">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              <span className="text-xl">📱</span>
              <span>Scarica l'App Mia Romagna</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4">Porta la Romagna sempre con te</h3>
          <p className="text-xl text-slate-200 mb-8">
            Accesso offline, notifiche in tempo reale e funzionalità GPS avanzate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
              <Smartphone className="h-5 w-5 mr-2" />
              Download Android
            </Button>
            <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
              <Smartphone className="h-5 w-5 mr-2" />
              Download iOS
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PersonalizedContent;
