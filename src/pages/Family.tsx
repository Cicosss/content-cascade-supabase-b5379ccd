import React from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ExperienceCard from '@/components/ExperienceCard';
import { Users, Star, Clock, MapPin, Heart, Shield, Gift, Camera } from 'lucide-react';

const Family = () => {
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

  const familyBenefits = [
    {
      icon: Shield,
      title: "Sicurezza Certificata",
      description: "Tutte le attività rispettano rigorosi standard di sicurezza per bambini",
      color: "green"
    },
    {
      icon: Star,
      title: "Guide Specializzate",
      description: "Educatori esperti nell'intrattenimento e formazione per famiglie",
      color: "blue"
    },
    {
      icon: Gift,
      title: "Prezzi Family-Friendly",
      description: "Tariffe speciali per famiglie numerose e sconti per più bambini",
      color: "purple"
    },
    {
      icon: Heart,
      title: "Educazione Divertente",
      description: "Impara giocando con le tradizioni e la cultura romagnola autentica",
      color: "orange"
    }
  ];

  const ageGroups = [
    {
      age: "0-3 anni",
      activities: "Attività sensoriali, mini-laboratori, spazi gioco sicuri",
      icon: "👶"
    },
    {
      age: "4-8 anni",
      activities: "Laboratori creativi, giochi didattici, mini-avventure",
      icon: "🧒"
    },
    {
      age: "9-14 anni",
      activities: "Esperienze interattive, sport, tecnologia educativa",
      icon: "👦"
    },
    {
      age: "Adulti",
      activities: "Relax, cultura, enogastronomia, benessere",
      icon: "👨‍👩‍👧‍👦"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Enhanced Hero Section for Family */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              👨‍👩‍👧‍👦 Sezione Family
            </h1>
            <p className="text-2xl md:text-3xl mb-6 font-light">
              Avventure autentiche pensate per tutta la famiglia
            </p>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed mb-8">
              Scopri la Romagna attraverso esperienze educative e divertenti che coinvolgono 
              grandi e piccini, creando ricordi indimenticabili nel rispetto delle tradizioni locali
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="bg-white/20 px-4 py-2 rounded-full">✅ Attività certificate</div>
              <div className="bg-white/20 px-4 py-2 rounded-full">✅ Guide specializzate</div>
              <div className="bg-white/20 px-4 py-2 rounded-full">✅ Prezzi family-friendly</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Age Groups Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
            Attività per Ogni Età
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ageGroups.map((group, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{group.icon}</div>
                <h3 className="font-bold text-slate-900 mb-3">{group.age}</h3>
                <p className="text-slate-600 text-sm">{group.activities}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Family Activities Grid */}
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

        {/* Family Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
            Perché Scegliere la Sezione Family
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {familyBenefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 mx-auto mb-4 bg-${benefit.color}-100 rounded-full flex items-center justify-center`}>
                  <benefit.icon className={`h-8 w-8 text-${benefit.color}-600`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Family Tips Section */}
        <Card className="p-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-0 shadow-xl">
          <div className="text-center mb-8">
            <Camera className="h-12 w-12 mx-auto text-purple-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Consigli per una Vacanza Family Perfetta
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Suggerimenti dai nostri esperti per vivere al meglio la Romagna in famiglia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Pianifica con Anticipo</h3>
                  <p className="text-slate-600 text-sm">Prenota le attività più richieste almeno una settimana prima per garantire la disponibilità</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Esplora i Dintorni</h3>
                  <p className="text-slate-600 text-sm">Ogni attività include suggerimenti per scoprire attrazioni nelle vicinanze</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Sconti Famiglia</h3>
                  <p className="text-slate-600 text-sm">Tariffe ridotte per famiglie numerose e pacchetti combinati vantaggiosi</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Tradizioni Locali</h3>
                  <p className="text-slate-600 text-sm">Ogni esperienza include elementi della cultura romagnola autentica</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Sicurezza Primo</h3>
                  <p className="text-slate-600 text-sm">Tutte le attività seguono protocolli di sicurezza certificati per bambini</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Esperienze Uniche</h3>
                  <p className="text-slate-600 text-sm">Accesso esclusivo a luoghi e attività non disponibili al turismo di massa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <Users className="h-5 w-5 mr-2" />
              Inizia la Tua Avventura Family
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Family;
