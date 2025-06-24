
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, MapPin, Utensils, Camera, Heart, Star } from 'lucide-react';
import TeaserAuthModal from './TeaserAuthModal';

const PassportTeaser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Badge di esempio basati sui veri achievements del sistema
  const sampleBadges = [
    {
      id: 'first_visit',
      name: 'Primo Passo',
      icon: Trophy,
      difficulty: 'easy', // Badge colorato
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'visit_borghi',
      name: 'Esploratore dei Borghi',
      icon: MapPin,
      difficulty: 'easy', // Badge colorato
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'beach_lover',
      name: 'Amante del Mare',
      icon: Heart,
      difficulty: 'easy', // Badge colorato
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'try_restaurants',
      name: 'Gourmet Romagnolo',
      icon: Utensils,
      difficulty: 'hard', // Badge in scala di grigi
      color: ''
    },
    {
      id: 'explore_culture',
      name: 'Cultore del Territorio',
      icon: Star,
      difficulty: 'hard', // Badge in scala di grigi
      color: ''
    },
    {
      id: 'visit_attractions',
      name: 'Scopritore di Attrazioni',
      icon: Camera,
      difficulty: 'hard', // Badge in scala di grigi
      color: ''
    }
  ];

  return (
    <>
      <section className="w-full bg-white py-16 px-4 mb-16">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Header del Widget */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Inizia la Tua Collezione di Esperienze
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Ogni luogo visitato è un timbro sul tuo passaporto digitale. Sblocca badge, 
              mettiti alla prova e diventa un vero esperto della Romagna.
            </p>
          </div>

          {/* Griglia dei Badge */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {sampleBadges.map((badge) => {
              const IconComponent = badge.icon;
              const isEasy = badge.difficulty === 'easy';

              return (
                <Card 
                  key={badge.id}
                  className={`p-6 transition-all duration-300 ${
                    isEasy 
                      ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-md hover:shadow-lg' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-center space-y-3">
                    {/* Icona del Badge */}
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
                      isEasy 
                        ? `bg-gradient-to-r ${badge.color} shadow-lg` 
                        : 'bg-gray-300'
                    }`}>
                      <IconComponent 
                        className={`h-8 w-8 ${
                          isEasy ? 'text-white' : 'text-gray-500'
                        }`} 
                      />
                    </div>
                    
                    {/* Nome del Badge */}
                    <h3 className={`font-semibold text-sm ${
                      isEasy ? 'text-slate-900' : 'text-gray-500'
                    }`}>
                      {badge.name}
                    </h3>

                    {/* Indicatore di Stato */}
                    {isEasy ? (
                      <div className="text-xs text-green-600 font-medium">
                        ✓ Facile da ottenere
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 font-medium">
                        🔒 Da sbloccare
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Crea il Tuo Passaporto
            </Button>
            
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Inizia subito a collezionare esperienze e scopri tutti i segreti della Romagna
            </p>
          </div>
        </div>
      </section>

      <TeaserAuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        variant="passport"
      />
    </>
  );
};

export default PassportTeaser;
