
import React from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ExperienceCard from '@/components/ExperienceCard';

const Family = () => {
  const familyActivities = [
    {
      title: "Parco Avventura per Famiglie",
      image: "🌳 Adventure Family",
      rating: 4.9,
      duration: "4h",
      groupSize: "Famiglie",
      price: "€22",
      category: "Avventura"
    },
    {
      title: "Laboratorio di Ceramica per Bambini",
      image: "🏺 Kids Ceramica",
      rating: 4.8,
      duration: "1.5h",
      groupSize: "Età 5+",
      price: "€15",
      category: "Arte e Cultura"
    },
    {
      title: "Mini Crociera Family",
      image: "⛵ Family Cruise",
      rating: 4.7,
      duration: "2h",
      groupSize: "Famiglie",
      price: "€18",
      category: "Mare"
    },
    {
      title: "Caccia al Tesoro del Territorio",
      image: "🗺️ Treasure",
      rating: 4.8,
      duration: "2.5h",
      groupSize: "Max 6 famiglie",
      price: "€25",
      category: "Scoperta"
    },
    {
      title: "Fattoria Didattica Romagnola",
      image: "🐄 Fattoria",
      rating: 4.6,
      duration: "3h",
      groupSize: "Famiglie",
      price: "€20",
      category: "Natura"
    },
    {
      title: "Museo Interattivo per Bambini",
      image: "🎭 Museo Kids",
      rating: 4.7,
      duration: "2h",
      groupSize: "Tutte le età",
      price: "€12",
      category: "Cultura"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section for Family */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            👨‍👩‍👧‍👦 Sezione Family
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
            Divertimento, cultura e avventure pensate per tutta la famiglia
          </p>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Scopri attività che coinvolgono grandi e piccini per creare ricordi indimenticabili in Romagna
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Family Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {familyActivities.map((activity, index) => (
            <ExperienceCard key={index} {...activity} />
          ))}
        </div>

        {/* Family Tips Section */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            💡 Consigli per Famiglie in Romagna
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Attività per Tutte le Età</h3>
                  <p className="text-slate-600 text-sm">Esperienze pensate per coinvolgere bambini, ragazzi e adulti insieme</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Sicurezza Garantita</h3>
                  <p className="text-slate-600 text-sm">Tutte le attività sono certificate e seguono rigorosi standard di sicurezza</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Prezzi Family Friendly</h3>
                  <p className="text-slate-600 text-sm">Tariffe speciali per famiglie e sconti per più bambini</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Educazione e Divertimento</h3>
                  <p className="text-slate-600 text-sm">Impara giocando con le tradizioni e la cultura romagnola</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Family;
