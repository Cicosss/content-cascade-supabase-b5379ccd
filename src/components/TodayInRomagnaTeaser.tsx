
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Clock, Gift, Utensils } from 'lucide-react';
import TeaserAuthModal from './TeaserAuthModal';

const TodayInRomagnaTeaser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Offerte mock per il teaser (semi-trasparenti)
  const mockOffers = [
    {
      id: 1,
      title: 'Aperitivo Sconto 20%',
      partner: 'Bar Centrale',
      icon: Gift,
      color: 'text-orange-400'
    },
    {
      id: 2,
      title: 'Ingresso 2x1 Museo',
      partner: 'Museo della Città',
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      id: 3,
      title: 'Menu Fisso €18',
      partner: 'Osteria del Mare',
      icon: Utensils,
      color: 'text-green-400'
    }
  ];

  return (
    <>
      <section className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 py-16 px-4 mb-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Colonna Sinistra - Testo Promozionale */}
            <div className="text-white space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <Zap className="h-12 w-12 text-white animate-pulse" />
                <div>
                  <h2 className="text-4xl font-bold mb-2">
                    Cosa succede Oggi in Romagna?
                  </h2>
                </div>
              </div>
              
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                Scopri eventi last-minute, sagre imperdibili e offerte esclusive dei nostri partner, 
                valide solo per oggi. Non perderti il meglio della Romagna, ora.
              </p>
              
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="auth-button-secondary text-lg px-8 py-4 h-auto font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="h-5 w-5 mr-2" />
                Scopri le Offerte del Giorno
              </Button>
            </div>

            {/* Colonna Destra - Mini Carosello Teaser */}
            <div className="relative">
              <div className="flex space-x-4 overflow-hidden">
                {mockOffers.map((offer, index) => (
                  <Card 
                    key={offer.id}
                    className="min-w-[200px] p-6 bg-white/10 backdrop-blur-md border-white/20 relative overflow-hidden"
                    style={{
                      filter: 'blur(1px)',
                      opacity: 0.7,
                      transform: `translateY(${index * 8}px)`
                    }}
                  >
                    <div className="text-center space-y-3">
                      <offer.icon className={`h-8 w-8 mx-auto ${offer.color}`} />
                      <h3 className="font-semibold text-white text-sm">
                        {offer.title}
                      </h3>
                      <p className="text-white/70 text-xs">
                        {offer.partner}
                      </p>
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-1 rounded-full">
                        Solo oggi
                      </div>
                    </div>
                    
                    {/* Overlay per effetto "locked" */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-2">
                        <Zap className="h-4 w-4 text-slate-800" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Indicatore "Sblocca per vedere di più" */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-medium text-slate-800 shadow-lg">
                  🔒 Registrati per sbloccare
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeaserAuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default TodayInRomagnaTeaser;
