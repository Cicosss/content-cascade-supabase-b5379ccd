
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Satellite, Radar } from 'lucide-react';
import TeaserAuthModal from './TeaserAuthModal';

const WeatherTeaser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [glitchData, setGlitchData] = useState<string[]>([]);
  const [isDataStreaming, setIsDataStreaming] = useState(true);

  // Dati simulati per l'effetto "streaming dati satellitari"
  const dataTemplates = [
    'SAT_DATA_001: ████████████',
    'TEMP_READING: ██.█°C',
    'HUMIDITY_LVL: ██%',
    'WIND_VECTOR: ███ km/h ███°',
    'PRESSURE_KPA: ████.█',
    'UV_INDEX: █.██',
    'PRECIPITATION: ██.█mm',
    'VISIBILITY: ██.█km',
    'CLOUD_COVER: ██%',
    'AIR_QUALITY: ███',
    'COORDINATES: ██.████, ██.████',
    'TIMESTAMP: ████-██-██ ██:██:██'
  ];

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Funzione per generare caratteri casuali
  const generateRandomChar = () => {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  };

  // Funzione per "glitchare" una riga di dati
  const glitchLine = (template: string) => {
    return template.replace(/█/g, () => generateRandomChar());
  };

  // Effetto per aggiornare costantemente i dati glitchanti
  useEffect(() => {
    if (!isDataStreaming) return;

    const interval = setInterval(() => {
      const numberOfLines = 8 + Math.floor(Math.random() * 4); // 8-12 righe
      const selectedTemplates = dataTemplates
        .sort(() => 0.5 - Math.random())
        .slice(0, numberOfLines);
      
      const newGlitchData = selectedTemplates.map(template => glitchLine(template));
      setGlitchData(newGlitchData);
    }, 400); // Cambio ogni 400ms per effetto più fluido

    return () => clearInterval(interval);
  }, [isDataStreaming]);

  // Avvia lo streaming dati al caricamento
  useEffect(() => {
    setIsDataStreaming(true);
  }, []);

  return (
    <>
      <Card className="futuristic-container animate-container-glow p-8 relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
        {/* Linea di scansione animata */}
        <div className="scan-line-overlay animate-scan-line"></div>
        
        {/* Header Futuristico */}
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="relative">
            <Satellite 
              className="h-8 w-8 text-cyan-400 animate-satellite-orbit" 
              strokeWidth={1.5}
            />
            <div className="absolute -inset-2 bg-cyan-400/20 rounded-full animate-ping"></div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1 tracking-wide">
              Meteo Satellitare in Tempo Reale
            </h3>
            <div className="flex items-center gap-2 text-cyan-300 text-sm">
              <Radar className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              <span>Ricevendo dati GPS...</span>
              <span className="animate-typing-cursor">|</span>
            </div>
          </div>
        </div>

        {/* Zona Dati Glitchanti (Il Mistero) */}
        <div className="mb-8 relative">
          <div className="bg-black/30 rounded-lg p-6 border border-cyan-500/30 relative overflow-hidden">
            {/* Effetto Matrix Rain sottile */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-matrix-rain text-green-400/20 text-xs"
                  style={{
                    left: `${15 + i * 15}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${4 + Math.random() * 2}s`
                  }}
                >
                  {generateRandomChar()}
                </div>
              ))}
            </div>

            {/* Stream di Dati Simulati */}
            <div className="space-y-2 relative z-10">
              {glitchData.map((line, index) => (
                <div
                  key={index}
                  className="data-stream-line animate-data-glitch flex items-center"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: `${2 + Math.random()}s`
                  }}
                >
                  <span className="text-cyan-400 mr-3 text-xs">▶</span>
                  <span className="flex-1">{line}</span>
                  <span className="text-yellow-400 text-xs ml-2">
                    {Math.random() > 0.7 ? '✓' : '●'}
                  </span>
                </div>
              ))}
            </div>

            {/* Overlay di "accesso negato" */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Messaggio di stato */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-500/50 rounded-full">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-300 text-sm font-medium">
                  ACCESSO RICHIESTO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sottotitolo Esplicativo */}
        <div className="mb-6 text-center">
          <p className="text-cyan-100 text-lg leading-relaxed">
            <span className="font-semibold">Registrati</span> per sbloccare le previsioni{' '}
            <span className="text-cyan-300 font-semibold">iper-localizzate</span> per la tua posizione
          </p>
        </div>

        {/* Call to Action Sbalorditivo */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-black font-bold py-4 text-lg transition-all duration-300 animate-unlock-pulse hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
          style={{
            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
          }}
        >
          <div className="flex items-center justify-center gap-3 relative z-10">
            <Satellite className="h-6 w-6 animate-satellite-orbit" />
            <span className="tracking-wide">🛰️ SBLOCCA ORA</span>
          </div>
          
          {/* Effetto "energia" nel pulsante */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </Button>

        {/* Testo informativo finale */}
        <p className="text-center text-xs text-cyan-200/80 mt-4 leading-relaxed">
          <span className="font-medium">Accesso istantaneo</span> a dati meteorologici satellitari, 
          allerte personalizzate e previsioni con precisione GPS
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
