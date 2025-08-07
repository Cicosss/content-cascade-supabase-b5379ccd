
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
      .from('points_of_interest')
      .select('*')
      .eq('poi_type', 'event')
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
    <Layout>
      <div className="relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float animation-delay-0"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/5 rounded-full animate-drift animation-delay-500"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/5 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-primary/3 rounded-full animate-bounce animation-delay-1500"></div>
        </div>

        <OggiHeroSection formattedDate={formattedDate} />

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 lg:py-12 space-y-16 lg:space-y-20 relative z-10">
          {/* Flash Offers Section with 3D Effects */}
          <div className="relative">
            {/* 3D Relief Shadow Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200/30 to-slate-400/20 rounded-3xl transform translate-x-2 translate-y-2 blur-lg -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-slate-300/20 to-slate-100/30 rounded-3xl transform translate-x-1 translate-y-1 -z-10"></div>
            
            <div className="bg-gradient-to-br from-slate-50/95 via-blue-50/90 to-accent/5 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-8 lg:p-10 border border-slate-200/60 shadow-2xl relative overflow-hidden">
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-8 right-8 w-2 h-2 bg-primary/30 rounded-full animate-twinkle animation-delay-0"></div>
                <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-accent/30 rounded-full animate-twinkle animation-delay-500"></div>
                <div className="absolute top-1/3 left-8 w-1 h-1 bg-secondary/30 rounded-full animate-twinkle animation-delay-1000"></div>
              </div>
              
              <FlashOffersSection offers={offers} />
            </div>
          </div>

          {/* Today Events Section with 3D Effects */}
          <div className="relative">
            {/* 3D Relief Shadow Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/30 to-slate-900/20 rounded-3xl transform translate-x-2 translate-y-2 blur-lg -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-slate-600/20 to-slate-800/30 rounded-3xl transform translate-x-1 translate-y-1 -z-10"></div>
            
            <div className="bg-gradient-to-br from-slate-800/95 via-slate-900/98 to-indigo-900/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-8 lg:p-10 border border-gold-400/40 shadow-2xl relative overflow-hidden">
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-8 right-8 w-2 h-2 bg-gold-400/30 rounded-full animate-twinkle animation-delay-200"></div>
                <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-twinkle animation-delay-700"></div>
                <div className="absolute top-1/3 left-8 w-1 h-1 bg-white/30 rounded-full animate-twinkle animation-delay-1200"></div>
              </div>
              
              <TodayEventsSection events={events} loading={loading} />
            </div>
          </div>

          {/* Suggestions Section with 3D Effects */}
          <div className="relative">
            {/* 3D Relief Shadow Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-green-400/20 rounded-3xl transform translate-x-2 translate-y-2 blur-lg -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-green-300/20 to-green-100/30 rounded-3xl transform translate-x-1 translate-y-1 -z-10"></div>
            
            <div className="bg-gradient-to-br from-green-50/95 via-emerald-50/90 to-green-100/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-8 lg:p-10 border border-green-200/60 shadow-2xl relative overflow-hidden">
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-8 right-8 w-2 h-2 bg-green-500/30 rounded-full animate-twinkle animation-delay-400"></div>
                <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-emerald-400/30 rounded-full animate-twinkle animation-delay-900"></div>
                <div className="absolute top-1/3 left-8 w-1 h-1 bg-green-600/30 rounded-full animate-twinkle animation-delay-1400"></div>
              </div>
              
              <SuggestionsSection suggestions={suggestions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OggiInRomagna;
