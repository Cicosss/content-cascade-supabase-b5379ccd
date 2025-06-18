import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Star, Zap, Timer, Lightbulb } from 'lucide-react';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

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
      <Header />
      
      {/* Hero Section */}
      <div className="sunset-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Oggi in Romagna: {formattedDate}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Scopri gli eventi imperdibili, le offerte esclusive e le esperienze uniche disponibili solo per le prossime 24 ore
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Sezione 1: Offerte Lampo */}
        <section>
          <div className="flex items-center mb-6">
            <Zap className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Offerte Lampo (Valide solo Oggi!)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="relative overflow-hidden border-2 border-yellow-400 shadow-lg animate-pulse-border">
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <Timer className="h-3 w-3 mr-1" />
                  Fino alle {offer.validUntil}
                </div>
                
                <CardHeader>
                  <div className="text-4xl text-center mb-2">{offer.image}</div>
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <p className="text-sm text-gray-600">{offer.partner}</p>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{offer.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-green-600">{offer.discountedPrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{offer.originalPrice}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Scopri l'Offerta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sezione 2: Eventi in Corso Oggi */}
        <section>
          <div className="flex items-center mb-6">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Eventi in Corso Oggi</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-80 bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nessun evento oggi</h3>
              <p className="text-gray-500">Non ci sono eventi programmati per oggi, ma controlla domani!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    <span className="text-white text-sm">🎉 {event.category}</span>
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-blue-100 text-blue-800">OGGI</Badge>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center font-semibold text-blue-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatTime(event.start_datetime)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location_name || event.address}
                      </div>
                    </div>
                    {event.price_info && (
                      <div className="text-lg font-semibold text-green-600">
                        {event.price_info}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Sezione 3: Suggerito per Te Oggi */}
        <section>
          <div className="flex items-center mb-6">
            <Lightbulb className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Suggerito per Te, Oggi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="overflow-hidden relative">
                <Badge className="absolute top-3 left-3 z-10 bg-purple-600 text-white">
                  Consigliato per te
                </Badge>
                
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white text-4xl">{suggestion.image}</span>
                </div>
                
                <CardContent className="p-4">
                  <Badge className="mb-2" variant="outline">{suggestion.category}</Badge>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{suggestion.rating}</span>
                    </div>
                    <span className="text-xs text-purple-600 font-medium">
                      {suggestion.reason}
                    </span>
                  </div>
                  <Button className="w-full">
                    Scopri di più
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default OggiInRomagna;
