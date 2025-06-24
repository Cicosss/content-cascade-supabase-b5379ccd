
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Sun, Cloud, CloudRain, Wind, Droplets } from 'lucide-react';
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

  // Dati meteo mock migliorati per il teaser blurrato
  const mockWeatherData = [
    { 
      day: 'Oggi', 
      icon: Sun, 
      temp: '28°', 
      desc: 'Soleggiato',
      wind: '12 km/h',
      humidity: '65%'
    },
    { 
      day: 'Dom', 
      icon: Cloud, 
      temp: '26°', 
      desc: 'Nuvoloso',
      wind: '8 km/h',
      humidity: '72%'
    },
    { 
      day: 'Lun', 
      icon: CloudRain, 
      temp: '24°', 
      desc: 'Pioggia',
      wind: '15 km/h',
      humidity: '88%'
    },
    { 
      day: 'Mar', 
      icon: Sun, 
      temp: '29°', 
      desc: 'Soleggiato',
      wind: '10 km/h',
      humidity: '58%'
    },
  ];

  return (
    <>
      <Card className="p-6 relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Header con icona animata e testo */}
        <div className="flex items-start gap-4 mb-6">
          {/* Icona GPS animata con custom animation */}
          <div className="flex-shrink-0">
            <MapPin 
              className="h-6 w-6 text-blue-600 animate-gps-pulse" 
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

        {/* Contenuto meteo blurrato (teaser migliorato) */}
        <div 
          className="mb-6 relative"
          style={{ 
            filter: 'blur(8px)', 
            opacity: 0.5,
            pointerEvents: 'none'
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockWeatherData.map((day, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-2 font-medium">{day.day}</div>
                <day.icon className="h-8 w-8 mx-auto mb-2 text-blue-500" strokeWidth={1.5} />
                <div className="font-bold text-lg mb-1">{day.temp}</div>
                <div className="text-xs text-gray-500 mb-2">{day.desc}</div>
                
                {/* Dettagli extra per mostrare cosa si perde */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Wind className="h-3 w-3" />
                    <span>{day.wind}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3" />
                    <span>{day.humidity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dettagli aggiuntivi blurrati */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Indice UV</span>
              <span className="font-semibold text-orange-600">Alto (7)</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">Qualità dell'aria</span>
              <span className="font-semibold text-green-600">Buona</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">Mare</span>
              <span className="font-semibold text-blue-600">Calmo</span>
            </div>
          </div>
        </div>

        {/* Overlay gradient migliorato per enfatizzare il blur */}
        <div 
          className="absolute weather-tease-overlay pointer-events-none"
          style={{ 
            top: '120px', 
            left: '24px', 
            right: '24px', 
            bottom: '80px',
            borderRadius: '8px'
          }}
        ></div>

        {/* Call to Action Button con micro-interazioni */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-semibold py-3 text-base transition-all duration-300 shadow-md hover:shadow-lg animate-button-glow hover:scale-[1.02] active:scale-[0.98]"
        >
          <MapPin className="h-5 w-5 mr-2" />
          📍 Attiva il Meteo GPS
        </Button>

        {/* Testo informativo migliorato sotto il pulsante */}
        <p className="text-center text-xs text-slate-500 mt-3 leading-relaxed">
          <span className="font-medium">Registrati gratuitamente</span> per ottenere previsioni precise, 
          allerte personalizzate e consigli per la tua giornata
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
