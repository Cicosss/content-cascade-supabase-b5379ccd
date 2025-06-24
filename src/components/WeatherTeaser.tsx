
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Lock } from 'lucide-react';
import TeaserAuthModal from './TeaserAuthModal';

const WeatherTeaser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<string>('');

  // Città della Romagna per la personalizzazione simulata
  const romagnaCities = [
    'Rimini', 'Riccione', 'Cattolica', 'Cesenatico', 'Cervia', 
    'Milano Marittima', 'Bellaria-Igea Marina', 'Misano Adriatico',
    'Ravenna', 'Forlì', 'Cesena', 'Faenza', 'Imola'
  ];

  // Seleziona una città casuale al caricamento
  useEffect(() => {
    const randomCity = romagnaCities[Math.floor(Math.random() * romagnaCities.length)];
    setCurrentCity(randomCity);
  }, []);

  return (
    <>
      <Card className="bg-[#FEFDFB] p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        
        {/* Header Caldo e Accogliente */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            La Tua Giornata in Romagna
          </h3>
          <p className="text-slate-600 text-lg">
            Stai visitando <span className="font-semibold text-slate-700">{currentCity}</span>?
          </p>
        </div>

        {/* Illustrazione Paesaggistica Sfocata */}
        <div className="mb-6 relative">
          <div className="relative h-48 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 rounded-xl overflow-hidden">
            {/* Illustrazione stilizzata di paesaggio romagnolo */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-200/40 via-yellow-100/30 to-blue-200/40"></div>
            
            {/* Elementi paesaggistici stilizzati */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-300/60 to-transparent"></div>
            <div className="absolute bottom-8 left-1/4 w-8 h-12 bg-amber-600/70 rounded-t-full"></div>
            <div className="absolute bottom-8 right-1/3 w-6 h-8 bg-red-400/60 rounded-t-lg"></div>
            <div className="absolute top-1/4 right-1/4 w-12 h-8 bg-yellow-300/50 rounded-full"></div>
            
            {/* Effetto blur forte per il teaser */}
            <div 
              className="absolute inset-0 backdrop-blur-[12px]"
              style={{ backdropFilter: 'blur(12px)' }}
            ></div>
            
            {/* Overlay con lucchetto */}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-4 shadow-lg">
                <Lock className="h-8 w-8 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Testo Descrittivo Caldo */}
        <div className="mb-6">
          <p className="text-slate-700 leading-relaxed text-base">
            <span className="font-semibold">Registrati gratuitamente.</span> Ti aiuteremo a pianificare la giornata perfetta con previsioni precise per dove ti trovi, consigli su cosa fare se piove e allerte per goderti il sole al meglio.
          </p>
        </div>

        {/* Call to Action Caldo */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-4 text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          style={{
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <Sun className="h-5 w-5" />
            <span>☀️ Scopri la Tua Giornata Ideale</span>
          </div>
        </Button>

        {/* Testo informativo finale */}
        <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
          Previsioni precise, consigli personalizzati e tutto quello che ti serve per vivere al meglio la Romagna
        </p>
      </Card>

      {/* Modal di registrazione con tema meteo */}
      <TeaserAuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        variant="weather"
      />
    </>
  );
};

export default WeatherTeaser;
