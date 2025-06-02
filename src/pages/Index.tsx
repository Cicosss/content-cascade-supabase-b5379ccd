
import React from 'react';
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
  const events = [
    {
      title: "Notte Rosa 2024 - La Grande Festa dell'Estate",
      date: "6 Luglio 2024",
      time: "21:00",
      location: "Lungomare di Rimini",
      category: "Festival",
      image: "🌹 Notte Rosa"
    },
    {
      title: "Festival della Piadina Romagnola",
      date: "12-14 Luglio",
      time: "19:00",
      location: "Piazza Cavour",
      category: "Tradizione Culinaria",
      image: "🥟 Festival Piadina"
    },
    {
      title: "Vetrina delle Eccellenze del Territorio",
      date: "20 Luglio",
      time: "18:00",
      location: "Centro Fiera",
      category: "Evento Mia Romagna",
      image: "🏆 Eccellenze"
    },
    {
      title: "Podcast Mia Romagna Live",
      date: "Ogni Venerdì",
      time: "20:00",
      location: "Streaming e Location",
      category: "Cultura Digitale",
      image: "🎙️ Podcast Live"
    }
  ];

  const restaurants = [
    {
      name: "Osteria delle Tradizioni Romagnole",
      cuisine: "Tradizione Culinaria Autentica",
      rating: 4.9,
      priceRange: "€€€",
      location: "Centro Storico",
      image: "🍝 Tradizioni",
      specialty: "Cappelletti in brodo di cappone"
    },
    {
      name: "La Vera Piadineria Artigianale",
      cuisine: "Street Food Romagnolo",
      rating: 4.8,
      priceRange: "€",
      location: "Borgo San Giuliano",
      image: "🥟 Vera Piadina",
      specialty: "Piadina con squacquerone e rucola"
    },
    {
      name: "Pescatore del Porto Antico",
      cuisine: "Pesce dell'Adriatico",
      rating: 4.7,
      priceRange: "€€€€",
      location: "Porto Canale",
      image: "🐟 Porto Antico",
      specialty: "Brodetto di pesce tradizionale"
    },
    {
      name: "Agriturismo Terre di Romagna",
      cuisine: "Km Zero e Sostenibilità",
      rating: 4.6,
      priceRange: "€€",
      location: "Colline dell'Entroterra",
      image: "🌾 Terre Romagna",
      specialty: "Passatelli in brodo con erbe selvatiche"
    }
  ];

  const culturalExperiences = [
    {
      title: "Tour Guidato Tempio Malatestiano",
      image: "🏛️ Malatestiano",
      rating: 4.9,
      duration: "1.5h",
      groupSize: "Max 15",
      price: "€15",
      category: "Esperienze Culturali"
    },
    {
      title: "Laboratorio di Ceramica Faentina",
      image: "🏺 Ceramica",
      rating: 4.8,
      duration: "2h",
      groupSize: "Max 8",
      price: "€25",
      category: "Tradizione Artigianale"
    },
    {
      title: "Escursione in Barca Tradizionale",
      image: "⛵ Barca",
      rating: 4.7,
      duration: "3h",
      groupSize: "Max 12",
      price: "€35",
      category: "Attività Marittime"
    },
    {
      title: "Trekking Patrimonio UNESCO",
      image: "🥾 Trekking",
      rating: 4.8,
      duration: "4h",
      groupSize: "Max 10",
      price: "€30",
      category: "Escursioni"
    }
  ];

  const familyExperiences = [
    {
      title: "Avventure Family nel Parco del Mare",
      image: "🎠 Family Park",
      rating: 4.8,
      duration: "4h",
      groupSize: "Famiglie",
      price: "€18",
      category: "Sezione Family"
    },
    {
      title: "Laboratorio Didattico Tradizioni",
      image: "👨‍👩‍👧‍👦 Family Lab",
      rating: 4.9,
      duration: "2h",
      groupSize: "Età 5+",
      price: "€12",
      category: "Famiglia e Cultura"
    },
    {
      title: "Mini Crociera per Bambini",
      image: "🚢 Mini Cruise",
      rating: 4.7,
      duration: "1.5h",
      groupSize: "Famiglie",
      price: "€15",
      category: "Attività Marittime Family"
    },
    {
      title: "Caccia al Tesoro del Territorio",
      image: "🗺️ Treasure Hunt",
      rating: 4.8,
      duration: "2.5h",
      groupSize: "Max 6 famiglie",
      price: "€20",
      category: "Esperienze del Territorio"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection />
      <AppFeaturesSection />
      
      <div className="container mx-auto px-4 py-8">
        {/* Top Section: Weather and Guest Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WeatherWidget />
          <GuestCard />
        </div>

        {/* Main Content Carousels - aggiornati con contenuti del progetto */}
        <div className="space-y-12">
          {/* Esperienze Culturali */}
          <ContentCarousel 
            title="Esperienze Culturali" 
            subtitle="Arte, storia e tradizioni autentiche della Romagna"
          >
            {culturalExperiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </ContentCarousel>

          {/* Eventi Speciali */}
          <ContentCarousel title="Eventi Speciali" subtitle="Non perdere gli appuntamenti più esclusivi">
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </ContentCarousel>

          {/* Tradizione Culinaria */}
          <ContentCarousel title="Tradizione Culinaria" subtitle="I sapori autentici tramandati di generazione in generazione">
            {restaurants.map((restaurant, index) => (
              <RestaurantCard key={index} {...restaurant} />
            ))}
          </ContentCarousel>

          {/* Sezione Family */}
          <ContentCarousel title="Sezione Family" subtitle="Divertimento e cultura per tutta la famiglia">
            {familyExperiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </ContentCarousel>
        </div>

        {/* Services Section */}
        <div className="mt-12">
          <ServicesSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
