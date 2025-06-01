
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
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
      title: "Sagra della Piadina Romagnola",
      date: "12-14 Luglio",
      time: "19:00",
      location: "Piazza Cavour",
      category: "Gastronomia",
      image: "🥟 Sagra Piadina"
    },
    {
      title: "Concerto al Tramonto - Jazz & Blues",
      date: "20 Luglio",
      time: "20:30",
      location: "Terrazza del Marebello",
      category: "Musica",
      image: "🎵 Jazz Sunset"
    },
    {
      title: "Mercatino dell'Antiquariato",
      date: "Ogni Sabato",
      time: "08:00-19:00",
      location: "Centro Storico",
      category: "Mercati",
      image: "🏺 Antiquariato"
    }
  ];

  const restaurants = [
    {
      name: "Osteria del Borgo",
      cuisine: "Tradizionale Romagnola",
      rating: 4.8,
      priceRange: "€€€",
      location: "Centro Storico",
      image: "🍝 Osteria",
      specialty: "Tagliatelle al ragù"
    },
    {
      name: "La Piadineria del Mare",
      cuisine: "Street Food",
      rating: 4.9,
      priceRange: "€",
      location: "Lungomare",
      image: "🥟 Piadineria",
      specialty: "Piadina con squacquerone"
    },
    {
      name: "Il Pescatore",
      cuisine: "Pesce fresco",
      rating: 4.7,
      priceRange: "€€€€",
      location: "Porto",
      image: "🐟 Pescatore",
      specialty: "Crudo di ricciola"
    },
    {
      name: "Agriturismo Collina Verde",
      cuisine: "Km Zero",
      rating: 4.6,
      priceRange: "€€",
      location: "Entroterra",
      image: "🌾 Agriturismo",
      specialty: "Tortellini in brodo"
    }
  ];

  const familyExperiences = [
    {
      title: "Acquario di Cattolica - Mondo Marino",
      image: "🐠 Acquario",
      rating: 4.7,
      duration: "3h",
      groupSize: "Famiglie",
      price: "€22",
      category: "Famiglia"
    },
    {
      title: "Parco Avventura Cervia - Tree Climbing",
      image: "🌳 Adventure Park",
      rating: 4.8,
      duration: "2.5h",
      groupSize: "Età 6+",
      price: "€18",
      category: "Avventura"
    },
    {
      title: "Laboratorio di Ceramica per Bambini",
      image: "🏺 Ceramica Kids",
      rating: 4.9,
      duration: "1.5h",
      groupSize: "Max 8",
      price: "€15",
      category: "Creative"
    },
    {
      title: "Mini Crociera per Famiglie",
      image: "⛵ Mini Cruise",
      rating: 4.6,
      duration: "1h",
      groupSize: "Famiglie",
      price: "€12",
      category: "Mare"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        {/* Top Section: Weather and Guest Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WeatherWidget />
          <GuestCard />
        </div>

        {/* Main Content Carousels */}
        <div className="space-y-12">
          {/* Recommended Experiences */}
          <ContentCarousel 
            title="Esperienze Consigliate per Te" 
            subtitle="Scoperte personalizzate in base ai tuoi interessi"
          />

          {/* Upcoming Events */}
          <ContentCarousel title="Prossimi Eventi" subtitle="Non perdere le migliori occasioni">
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </ContentCarousel>

          {/* Where to Eat */}
          <ContentCarousel title="Dove Mangiare" subtitle="I sapori autentici della Romagna">
            {restaurants.map((restaurant, index) => (
              <RestaurantCard key={index} {...restaurant} />
            ))}
          </ContentCarousel>

          {/* Family Adventures */}
          <ContentCarousel title="Avventure in Famiglia" subtitle="Divertimento per grandi e piccini">
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
