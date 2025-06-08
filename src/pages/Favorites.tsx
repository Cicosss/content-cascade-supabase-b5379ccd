
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Heart, MapPin, Calendar, Star } from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites] = useState([
    {
      id: 1,
      type: 'restaurant',
      name: 'Osteria del Borgo',
      location: 'Centro Storico',
      rating: 4.8,
      image: '🍝'
    },
    {
      id: 2,
      type: 'experience',
      name: 'Tour del centro storico',
      location: 'Rimini',
      rating: 4.9,
      image: '🏛️'
    },
    {
      id: 3,
      type: 'event',
      name: 'Notte Rosa 2024',
      location: 'Lungomare',
      date: '6 Luglio 2024',
      image: '🌹'
    }
  ]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p>Devi effettuare l'accesso per vedere i tuoi preferiti.</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Heart className="h-6 w-6 mr-3 text-red-500" />
            <h1 className="text-2xl font-bold">I Miei Preferiti</h1>
          </div>

          {favorites.length === 0 ? (
            <Card className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessun preferito ancora
              </h3>
              <p className="text-gray-600">
                Inizia a esplorare e aggiungi le tue esperienze preferite!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                    <span className="text-white text-2xl">{item.image}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.location}
                    </div>
                    {item.rating && (
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{item.rating}</span>
                      </div>
                    )}
                    {item.date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.date}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
