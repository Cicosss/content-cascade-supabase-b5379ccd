
import React from 'react';
import ExperienceCard from '@/components/ExperienceCard';

const FamilyActivitiesSection = () => {
  const familyActivities = [
    {
      title: "Parco Avventura Famiglia - Percorsi Acrobatici Sicuri",
      image: "🌳 Parco Avventura",
      rating: 4.9,
      duration: "4h",
      groupSize: "Famiglie (età 4+)",
      price: "€25",
      category: "Avventura Outdoor"
    },
    {
      title: "Laboratorio di Ceramica per Piccoli Artisti",
      image: "🏺 Lab Ceramica Kids",
      rating: 4.8,
      duration: "2h",
      groupSize: "Bambini 5-12 anni",
      price: "€18",
      category: "Arte e Creatività"
    },
    {
      title: "Mini Crociera Family - Alla Scoperta dei Delfini",
      image: "⛵ Family Cruise",
      rating: 4.7,
      duration: "2.5h",
      groupSize: "Famiglie",
      price: "€20",
      category: "Esperienza Marina"
    },
    {
      title: "Caccia al Tesoro del Territorio Romagnolo",
      image: "🗺️ Treasure Hunt",
      rating: 4.8,
      duration: "3h",
      groupSize: "Max 6 famiglie",
      price: "€28",
      category: "Gioco Educativo"
    },
    {
      title: "Fattoria Didattica Biologica - Vita Contadina",
      image: "🐄 Fattoria Bio",
      rating: 4.6,
      duration: "4h",
      groupSize: "Famiglie",
      price: "€22",
      category: "Natura e Animali"
    },
    {
      title: "Museo Interattivo della Marineria per Bambini",
      image: "🎭 Museo Kids",
      rating: 4.7,
      duration: "2.5h",
      groupSize: "Tutte le età",
      price: "€15",
      category: "Cultura Interattiva"
    },
    {
      title: "Laboratorio di Piadina per Piccoli Chef",
      image: "🥟 Lab Piadina",
      rating: 4.9,
      duration: "1.5h",
      groupSize: "Famiglie",
      price: "€16",
      category: "Tradizione Culinaria"
    },
    {
      title: "Escursione in Bicicletta - Piste Ciclabili Family",
      image: "🚴 Bike Family",
      rating: 4.6,
      duration: "3h",
      groupSize: "Famiglie",
      price: "€12",
      category: "Sport e Natura"
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
        Le Nostre Esperienze Family
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {familyActivities.map((activity, index) => (
          <ExperienceCard key={index} {...activity} />
        ))}
      </div>
    </div>
  );
};

export default FamilyActivitiesSection;
