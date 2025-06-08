
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Star, Route } from 'lucide-react';

const Itineraries = () => {
  const [itineraries] = useState([
    {
      id: 1,
      title: 'Romagna Classica - 3 Giorni',
      description: 'Un viaggio attraverso i luoghi più iconici della Romagna',
      duration: '3 giorni',
      difficulty: 'Facile',
      rating: 4.8,
      image: '🏛️',
      stops: ['Rimini Centro', 'San Marino', 'Santarcangelo'],
      category: 'Arte e Cultura'
    },
    {
      id: 2,
      title: 'Sapori Romagnoli - Tour Gastronomico',
      description: 'Degustazioni e tradizioni culinarie della regione',
      duration: '1 giorno',
      difficulty: 'Facile',
      rating: 4.9,
      image: '🍝',
      stops: ['Mercato coperto', 'Osteria tradizionale', 'Caseificio'],
      category: 'Gastronomia'
    },
    {
      id: 3,
      title: 'Natura e Relax - Terme e Parchi',
      description: 'Relax tra terme naturali e parchi regionali',
      duration: '2 giorni',
      difficulty: 'Facile',
      rating: 4.7,
      image: '🌳',
      stops: ['Terme di Riccione', 'Parco del Conero', 'Borgo di Gradara'],
      category: 'Natura'
    },
    {
      id: 4,
      title: 'Avventura in Riviera - Sport e Mare',
      description: 'Attività sportive lungo la costa romagnola',
      duration: '4 giorni',
      difficulty: 'Moderata',
      rating: 4.6,
      image: '🏄‍♂️',
      stops: ['Windsurf Rimini', 'Trekking Gabicce', 'Bike tour costa'],
      category: 'Sport'
    },
    {
      id: 5,
      title: 'Famiglia Fun - Divertimento per Tutti',
      description: 'Itinerario perfetto per famiglie con bambini',
      duration: '3 giorni',
      difficulty: 'Facile',
      rating: 4.8,
      image: '👨‍👩‍👧‍👦',
      stops: ['Acquario Cattolica', 'Parco Oltremare', 'Spiaggia attrezzata'],
      category: 'Famiglia'
    },
    {
      id: 6,
      title: 'Borghi Medievali - Storia e Tradizione',
      description: 'Alla scoperta dei borghi più belli della Romagna',
      duration: '2 giorni',
      difficulty: 'Moderata',
      rating: 4.7,
      image: '🏰',
      stops: ['San Leo', 'Montegridolfo', 'Mondaino'],
      category: 'Storia'
    }
  ]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moderata': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Itinerari in Romagna</h1>
          <p className="text-xl">Percorsi studiati per vivere al meglio la nostra terra</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white text-2xl">{itinerary.image}</span>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{itinerary.category}</Badge>
                  <Badge className={getDifficultyColor(itinerary.difficulty)}>
                    {itinerary.difficulty}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {itinerary.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {itinerary.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {itinerary.duration}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {itinerary.rating}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Route className="h-4 w-4 mr-1" />
                    Tappe principali:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {itinerary.stops.map((stop, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {stop}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full romagna-gradient">
                  Scopri Itinerario
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Itineraries;
