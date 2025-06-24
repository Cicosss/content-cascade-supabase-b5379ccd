import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import AppFeaturesSection from '@/components/AppFeaturesSection';
import WeatherWidget from '@/components/WeatherWidget';
import GuestCard from '@/components/GuestCard';
import ContentCarousel from '@/components/ContentCarousel';
import EventCard from '@/components/EventCard';
import RestaurantCard from '@/components/RestaurantCard';
import ServicesSection from '@/components/ServicesSection';
import ExperienceCard from '@/components/ExperienceCard';
import TodayInRomagnaTeaser from '@/components/TodayInRomagnaTeaser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Zap, ParkingCircle, AlertTriangle, MessageCircle } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  // Se l'utente è loggato, non mostrare nulla (sta per essere reindirizzato)
  if (user) {
    return null;
  }

  // Eventi più specifici e dettagliati basati sui documenti
  const events = [
    {
      title: "Notte Rosa 2024 - Il Rosa che Accende l'Estate",
      date: "6 Luglio 2024",
      time: "21:00 - 06:00",
      location: "Riviera Romagnola",
      category: "Festival Storico",
      image: "🌹 Notte Rosa"
    },
    {
      title: "Festival Internazionale della Piadina Romagnola IGP",
      date: "12-14 Luglio 2024",
      time: "10:00 - 24:00",
      location: "Piazza Cavour, Rimini",
      category: "Tradizione Culinaria",
      image: "🥟 Festival Piadina"
    },
    {
      title: "Vetrina delle Eccellenze del Territorio Romagnolo",
      date: "20 Luglio 2024",
      time: "18:00 - 23:00",
      location: "Centro Congressi Rimini Fiera",
      category: "Evento Mia Romagna",
      image: "🏆 Eccellenze"
    },
    {
      title: "Podcast Mia Romagna Live - Storie del Territorio",
      date: "Ogni Venerdì",
      time: "20:00 - 21:30",
      location: "Streaming + Location Esclusiva",
      category: "Cultura Digitale",
      image: "🎙️ Podcast Live"
    },
    {
      title: "Sagra del Brodetto alla Marinara",
      date: "27-29 Luglio 2024",
      time: "19:00 - 24:00",
      location: "Porto Canale, Cesenatico",
      category: "Tradizione Marinara",
      image: "🐟 Brodetto"
    }
  ];

  // Ristoranti e tradizione culinaria più approfonditi
  const restaurants = [
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
    },
    {
      name: "Trattoria del Mare e Monti",
      cuisine: "Fusion Romagnola Contemporanea",
      rating: 4.8,
      priceRange: "€€€",
      location: "Santarcangelo di Romagna",
      image: "🏔️ Mare Monti",
      specialty: "Tortelloni di ricotta e spinaci con ragù di cinghiale"
    }
  ];

  // Esperienze del territorio unificate (culturali + marittime)
  const territoryExperiences = [
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
    },
    {
      id: 'escursione-trabaccolo-storico',
      name: "Escursione in Barca Tradizionale - Trabaccolo Storico",
      title: "Escursione in Barca Tradizionale - Trabaccolo Storico",
      image: "⛵ Trabaccolo",
      rating: 4.7,
      duration: "4h",
      groupSize: "Max 12 persone",
      price: "€45",
      category: "Tradizione Marinara"
    },
    {
      id: 'corso-vela-base',
      name: "Corso di Vela Base - Scuola Nautica Certificata",
      title: "Corso di Vela Base - Scuola Nautica Certificata",
      image: "⛵ Corso Vela",
      rating: 4.9,
      duration: "6h",
      groupSize: "Max 8 persone",
      price: "€85",
      category: "Sport Acquatici"
    },
    {
      id: 'trekking-unesco-san-leo',
      name: "Trekking Patrimonio UNESCO - San Leo e San Marino",
      title: "Trekking Patrimonio UNESCO - San Leo e San Marino",
      image: "🥾 Trekking UNESCO",
      rating: 4.8,
      duration: "6h",
      groupSize: "Max 10 persone",
      price: "€40",
      category: "Natura e Storia"
    },
    {
      id: 'immersione-relitti-adriatico',
      name: "Immersione Guidata - Relitti dell'Adriatico",
      title: "Immersione Guidata - Relitti dell'Adriatico",
      image: "🤿 Diving",
      rating: 4.8,
      duration: "4h",
      groupSize: "Max 6 persone",
      price: "€65",
      category: "Subacquea"
    },
    {
      id: 'grotte-onferno',
      name: "Visita alle Grotte di Onferno - Meraviglia Sotterranea",
      title: "Visita alle Grotte di Onferno - Meraviglia Sotterranea",
      image: "🦇 Grotte Onferno",
      rating: 4.6,
      duration: "2.5h",
      groupSize: "Max 20 persone",
      price: "€22",
      category: "Natura Selvaggia"
    },
    {
      id: 'kayak-costa-adriatica',
      name: "Escursione in Kayak - Costa Adriatica",
      title: "Escursione in Kayak - Costa Adriatica",
      image: "🚣 Kayak",
      rating: 4.7,
      duration: "3h",
      groupSize: "Max 10 persone",
      price: "€35",
      category: "Eco-turismo"
    }
  ];

  // Attività per famiglie più specifiche
  const familyExperiences = [
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
    },
    {
      id: 'laboratorio-ceramisti-index',
      name: "Laboratorio Didattico - Piccoli Ceramisti",
      title: "Laboratorio Didattico - Piccoli Ceramisti",
      image: "👨‍👩‍👧‍👦 Lab Ceramica",
      rating: 4.9,
      duration: "2h",
      groupSize: "Famiglie (età 5+)",
      price: "€18",
      category: "Arte e Creatività"
    },
    {
      id: 'mini-crociera-delfini',
      name: "Mini Crociera per Bambini - Alla Scoperta dei Delfini",
      title: "Mini Crociera per Bambini - Alla Scoperta dei Delfini",
      image: "🐬 Mini Crociera",
      rating: 4.7,
      duration: "2.5h",
      groupSize: "Famiglie",
      price: "€20",
      category: "Esperienza Marina"
    },
    {
      id: 'caccia-tesoro-territorio',
      name: "Caccia al Tesoro del Territorio - Avventura Educativa",
      title: "Caccia al Tesoro del Territorio - Avventura Educativa",
      image: "🗺️ Caccia Tesoro",
      rating: 4.8,
      duration: "3h",
      groupSize: "Max 6 famiglie",
      price: "€28",
      category: "Gioco Educativo"
    },
    {
      id: 'fattoria-didattica-index',
      name: "Fattoria Didattica Bio - Vita Contadina",
      title: "Fattoria Didattica Bio - Vita Contadina",
      image: "🐄 Fattoria Bio",
      rating: 4.6,
      duration: "4h",
      groupSize: "Famiglie",
      price: "€22",
      category: "Natura e Animali"
    }
  ];

  const services = [
    { icon: Car, label: 'Taxi', desc: 'Chiama un taxi' },
    { icon: Zap, label: 'Ricarica EV', desc: 'Stazioni di ricarica' },
    { icon: ParkingCircle, label: 'Parcheggi', desc: 'Trova parcheggio' },
  ];

  return (
    <Layout showSidebar={true}>
      <HeroSection />
      <AppFeaturesSection />
      
      <div className="container mx-auto px-4 py-12">
        {/* Top Section: Weather and Guest Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <WeatherWidget />
          <GuestCard />
        </div>

        {/* Main Content Carousels */}
        <div className="space-y-16">
          {/* Tradizione Culinaria */}
          <ContentCarousel 
            title="Tradizione Culinaria Autentica" 
            subtitle="I sapori genuini della Romagna tramandati di generazione in generazione"
          >
            {restaurants.map((restaurant, index) => (
              <RestaurantCard key={index} {...restaurant} />
            ))}
          </ContentCarousel>

          {/* NUOVO: Widget Teaser "Oggi in Romagna" */}
          <TodayInRomagnaTeaser />

          {/* Servizi Vicini Card */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Servizi Vicini</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <service.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <div className="font-semibold text-lg mb-2">{service.label}</div>
                  <div className="text-gray-600">{service.desc}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* Esperienze del Territorio Unificate */}
          <ContentCarousel 
            title="Esperienze del Territorio" 
            subtitle="Scopri la cultura, la storia e le tradizioni marinare della Provincia di Rimini"
          >
            {territoryExperiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </ContentCarousel>

          {/* Prudenza in Mare Card */}
          <Card className="p-6 bg-amber-50 border-amber-200 mb-16">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-amber-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-amber-900 mb-3">Prudenza in Mare</h3>
                <p className="text-amber-800 leading-relaxed">
                  Controlla sempre le condizioni meteo marine prima di entrare in acqua. Rispetta le bandiere di sicurezza 
                  e segui le indicazioni del personale di salvataggio. La tua sicurezza e quella degli altri è la priorità.
                </p>
              </div>
            </div>
          </Card>

          {/* Eventi Speciali */}
          <ContentCarousel 
            title="Eventi Speciali e Manifestazioni" 
            subtitle="Non perdere gli appuntamenti più esclusivi del territorio"
          >
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </ContentCarousel>

          {/* Hai bisogno di aiuto? Card */}
          <Card className="p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center mb-16">
            <MessageCircle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Hai bisogno di aiuto?</h3>
            <p className="text-green-100 mb-6 text-lg leading-relaxed">
              I nostri esperti locali sono sempre disponibili per consigli personalizzati, 
              informazioni aggiornate e supporto durante la tua visita in Romagna.
            </p>
            <Button variant="secondary" className="px-8 py-3 text-lg font-semibold">
              Contattaci Subito
            </Button>
          </Card>

          {/* Sezione Family */}
          <ContentCarousel 
            title="Sezione Family - Divertimento per Tutti" 
            subtitle="Esperienze pensate per creare ricordi indimenticabili in famiglia"
          >
            {familyExperiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </ContentCarousel>
        </div>

        {/* Services Section mantiene solo le funzionalità base */}
        <div className="mt-16">
          <ServicesSection />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
