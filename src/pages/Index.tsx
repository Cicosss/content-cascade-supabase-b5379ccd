import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AppFeaturesSection from '@/components/AppFeaturesSection';
import WeatherWidget from '@/components/WeatherWidget';
import GuestCard from '@/components/GuestCard';
import ContentCarousel from '@/components/ContentCarousel';
import EventCard from '@/components/EventCard';
import RestaurantCard from '@/components/RestaurantCard';
import ServicesSection from '@/components/ServicesSection';
import ExperienceCard from '@/components/ExperienceCard';

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

  // Esperienze culturali più dettagliate
  const culturalExperiences = [
    {
      title: "Tour Guidato Tempio Malatestiano - Capolavoro Rinascimentale",
      image: "🏛️ Tempio Malatestiano",
      rating: 4.9,
      duration: "2h",
      groupSize: "Max 15 persone",
      price: "€18",
      category: "Patrimonio UNESCO"
    },
    {
      title: "Laboratorio di Ceramica Faentina - Arte Millenaria",
      image: "🏺 Ceramica Faenza",
      rating: 4.8,
      duration: "3h",
      groupSize: "Max 8 persone",
      price: "€35",
      category: "Tradizione Artigianale"
    },
    {
      title: "Escursione in Barca Tradizionale - Trabaccolo Storico",
      image: "⛵ Trabaccolo",
      rating: 4.7,
      duration: "4h",
      groupSize: "Max 12 persone",
      price: "€45",
      category: "Tradizione Marinara"
    },
    {
      title: "Trekking Patrimonio UNESCO - San Leo e San Marino",
      image: "🥾 Trekking UNESCO",
      rating: 4.8,
      duration: "6h",
      groupSize: "Max 10 persone",
      price: "€40",
      category: "Natura e Storia"
    },
    {
      title: "Visita alle Grotte di Onferno - Meraviglia Sotterranea",
      image: "🦇 Grotte Onferno",
      rating: 4.6,
      duration: "2.5h",
      groupSize: "Max 20 persone",
      price: "€22",
      category: "Natura Selvaggia"
    }
  ];

  // Attività per famiglie più specifiche
  const familyExperiences = [
    {
      title: "Parco Avventura Famiglia - Percorsi Acrobatici",
      image: "🌳 Parco Avventura",
      rating: 4.8,
      duration: "4h",
      groupSize: "Famiglie (età 4+)",
      price: "€25",
      category: "Avventura Outdoor"
    },
    {
      title: "Laboratorio Didattico - Piccoli Ceramisti",
      image: "👨‍👩‍👧‍👦 Lab Ceramica",
      rating: 4.9,
      duration: "2h",
      groupSize: "Famiglie (età 5+)",
      price: "€18",
      category: "Arte e Creatività"
    },
    {
      title: "Mini Crociera per Bambini - Alla Scoperta dei Delfini",
      image: "🐬 Mini Crociera",
      rating: 4.7,
      duration: "2.5h",
      groupSize: "Famiglie",
      price: "€20",
      category: "Esperienza Marina"
    },
    {
      title: "Caccia al Tesoro del Territorio - Avventura Educativa",
      image: "🗺️ Caccia Tesoro",
      rating: 4.8,
      duration: "3h",
      groupSize: "Max 6 famiglie",
      price: "€28",
      category: "Gioco Educativo"
    },
    {
      title: "Fattoria Didattica Bio - Vita Contadina",
      image: "🐄 Fattoria Bio",
      rating: 4.6,
      duration: "4h",
      groupSize: "Famiglie",
      price: "€22",
      category: "Natura e Animali"
    }
  ];

  // Attività marittime specifiche
  const maritimeExperiences = [
    {
      title: "Corso di Vela Base - Scuola Nautica Certificata",
      image: "⛵ Corso Vela",
      rating: 4.9,
      duration: "6h",
      groupSize: "Max 8 persone",
      price: "€85",
      category: "Sport Acquatici"
    },
    {
      title: "Immersione Guidata - Relitti dell'Adriatico",
      image: "🤿 Diving",
      rating: 4.8,
      duration: "4h",
      groupSize: "Max 6 persone",
      price: "€65",
      category: "Subacquea"
    },
    {
      title: "Escursione in Kayak - Costa Adriatica",
      image: "🚣 Kayak",
      rating: 4.7,
      duration: "3h",
      groupSize: "Max 10 persone",
      price: "€35",
      category: "Eco-turismo"
    },
    {
      title: "Pesca Sportiva in Alto Mare - Esperienza Autentica",
      image: "🎣 Pesca Sportiva",
      rating: 4.6,
      duration: "8h",
      groupSize: "Max 12 persone",
      price: "€75",
      category: "Tradizione Marinara"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection />
      <AppFeaturesSection />
      
      <div className="container mx-auto px-4 py-12">
        {/* Top Section: Weather and Guest Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <WeatherWidget />
          <GuestCard />
        </div>

        {/* Main Content Carousels - contenuti più ricchi e fedeli al documento */}
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

          {/* Esperienze Culturali */}
          <ContentCarousel 
            title="Esperienze Culturali Uniche" 
            subtitle="Immergiti nella storia millenaria e nell'arte della Provincia di Rimini"
          >
            {culturalExperiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </ContentCarousel>

          {/* Attività Marittime */}
          <ContentCarousel 
            title="Attività Marittime Adriatiche" 
            subtitle="Vivi il mare come un vero romagnolo con esperienze autentiche"
          >
            {maritimeExperiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </ContentCarousel>

          {/* Eventi Speciali */}
          <ContentCarousel 
            title="Eventi Speciali e Manifestazioni" 
            subtitle="Non perdere gli appuntamenti più esclusivi del territorio"
          >
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </ContentCarousel>

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

        {/* Services Section */}
        <div className="mt-16">
          <ServicesSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
