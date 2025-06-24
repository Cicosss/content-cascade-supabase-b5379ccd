
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Sun, Cloud, CloudRain } from 'lucide-react';
import TeaserAuthModal from './TeaserAuthModal';

const WeatherTeaser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [randomCity, setRandomCity] = useState('');

  // Lista delle città della Romagna per la rotazione casuale
  const romagnaCities = [
    'Rimini', 'Riccione', 'Cattolica', 'Cesenatico', 
    'Bellaria', 'Misano Adriatico', 'San Mauro Pascoli', 'Cervia'
  ];

  // Seleziona una città casuale al caricamento
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * romagnaCities.length);
    setRandomCity(romagnaCities[randomIndex]);
  }, []);

  // Dati meteo mock per il teaser blurrato
  const mockWeatherData = [
    { day: 'Oggi', icon: Sun, temp: '28°', desc: 'Soleggiato' },
    { day: 'Dom', icon: Cloud, temp: '26°', desc: 'Nuvoloso' },
    { day: 'Mar', icon: CloudRain, temp: '24°', desc: 'Pioggia' },
    { day: 'Mer', icon: Sun, temp: '29°', desc: 'Soleggiato' },
  ];

  return (
    <>
      <Card className="p-6 relative overflow-hidden">
        {/* Header con icona animata e testo */}
        <div className="flex items-start gap-4 mb-6">
          {/* Icona GPS animata */}
          <div className="flex-shrink-0">
            <MapPin 
              className="h-6 w-6 text-blue-600 animate-pulse" 
              strokeWidth={2}
              fill="currentColor"
            />
          </div>
          
          {/* Testo principale */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Il Meteo, su Misura per Te
            </h3>
            <p className="text-slate-600 text-sm">
              Stai visitando {randomCity}?
            </p>
          </div>
        </div>

        {/* Contenuto meteo blurrato (teaser) */}
        <div 
          className="mb-6 relative"
          style={{ 
            filter: 'blur(4px)', 
            opacity: 0.6,
            pointerEvents: 'none'
          }}
        >
          <div className="grid grid-cols-4 gap-3">
            {mockWeatherData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-600 mb-2">{day.day}</div>
                <day.icon className="h-6 w-6 mx-auto mb-2 text-blue-500" strokeWidth={1.5} />
                <div className="font-semibold text-sm">{day.temp}</div>
                <div className="text-xs text-gray-500">{day.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay gradient per enfatizzare il blur */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"
          style={{ top: '120px' }}
        ></div>

        {/* Call to Action Button */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-semibold py-3 text-base transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <MapPin className="h-5 w-5 mr-2" />
          📍 Attiva il Meteo GPS
        </Button>

        {/* Testo informativo sotto il pulsante */}
        <p className="text-center text-xs text-slate-500 mt-3">
          Registrati per ottenere previsioni precise basate sulla tua posizione
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
