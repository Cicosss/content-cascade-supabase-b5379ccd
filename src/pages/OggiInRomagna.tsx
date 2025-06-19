
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import OggiHeroSection from '@/components/oggi/OggiHeroSection';
import FlashOffersSection from '@/components/oggi/FlashOffersSection';
import TodayEventsSection from '@/components/oggi/TodayEventsSection';
import SuggestionsSection from '@/components/oggi/SuggestionsSection';

const OggiInRomagna = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [offers, setOffers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('it-IT', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  useEffect(() => {
    fetchTodayContent();
  }, []);

  const fetchTodayContent = async () => {
    setLoading(true);
    
    // Fetch eventi di oggi
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const { data: todayEvents } = await supabase
      .from('events')
      .select('*')
      .gte('start_datetime', startOfDay.toISOString())
      .lt('start_datetime', endOfDay.toISOString())
      .order('start_datetime', { ascending: true });

    setEvents(todayEvents || []);

    // Genera offerte lampo mock (in futuro da database)
    setOffers([
      {
        id: 1,
        title: 'Aperitivo con sconto del 20%',
        partner: 'Bar Centrale Rimini',
        description: 'Spritz o cocktail a scelta con stuzzichini inclusi',
        originalPrice: '€12',
        discountedPrice: '€9.60',
        validUntil: '23:59',
        image: '🍹'
      },
      {
        id: 2,
        title: 'Ingresso 2x1 al Museo',
        partner: 'Museo della Città',
        description: 'Visita la mostra permanente e quella temporanea',
        originalPrice: '€8',
        discountedPrice: 'Gratis il 2°',
        validUntil: '18:00',
        image: '🏛️'
      },
      {
        id: 3,
        title: 'Menu fisso a prezzo ridotto',
        partner: 'Osteria del Mare',
        description: 'Primo, secondo, dolce e caffè della tradizione romagnola',
        originalPrice: '€25',
        discountedPrice: '€18',
        validUntil: '22:00',
        image: '🍝'
      }
    ]);

    // Genera suggerimenti personalizzati mock
    setSuggestions([
      {
        id: 1,
        title: 'Visita il Tempio Malatestiano',
        category: 'Arte e Cultura',
        description: 'Capolavoro rinascimentale nel cuore di Rimini',
        reason: 'Consigliato perché ami l\'arte',
        rating: 4.8,
        image: '🏛️',
        type: 'poi'
      },
      {
        id: 2,
        title: 'Degustazione di Sangiovese',
        category: 'Gusto & Sapori',
        description: 'Cantina storica con vista sulle colline romagnole',
        reason: 'Perfetto per i tuoi gusti culinari',
        rating: 4.6,
        image: '🍷',
        type: 'experience'
      }
    ]);

    setLoading(false);
  };

  return (
    <Layout showSidebar={true}>
      <OggiHeroSection formattedDate={formattedDate} />

      <div className="container mx-auto px-4 py-8 space-y-12">
        <FlashOffersSection offers={offers} />
        <TodayEventsSection events={events} loading={loading} />
        <SuggestionsSection suggestions={suggestions} />
      </div>
    </Layout>
  );
};

export default OggiInRomagna;
