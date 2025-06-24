
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Flag, Thermometer, Waves, Wind } from 'lucide-react';
import { useCoastalStatus } from '@/hooks/useCoastalStatus';

interface SeaConditions {
  waterTemp: number;
  waveHeight: number;
  waveDescription: string;
  windSpeed: number;
  windDescription: string;
}

const SeaBulletinWidget = () => {
  // Mock weather data for coastal status calculation
  const mockWeatherData = {
    temperature: 26,
    condition: 'Clear' as const,
    wind: 8,
    humidity: 65
  };

  const { flagStatus, waterTemperature } = useCoastalStatus(mockWeatherData);
  
  const [seaConditions, setSeaConditions] = useState<SeaConditions>({
    waterTemp: waterTemperature,
    waveHeight: 0.3,
    waveDescription: 'Calmo',
    windSpeed: 8,
    windDescription: 'Brezza leggera'
  });

  // Update sea conditions when coastal data changes
  useEffect(() => {
    setSeaConditions(prev => ({
      ...prev,
      waterTemp: waterTemperature,
      windSpeed: mockWeatherData.wind
    }));
  }, [waterTemperature, mockWeatherData.wind]);

  // Get flag color and status text based on coastal status
  const getFlagStyles = () => {
    switch (flagStatus.level) {
      case 'green':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-500',
          statusText: 'MARE SICURO',
          statusColor: 'text-green-700'
        };
      case 'yellow':  
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-500',
          statusText: 'ATTENZIONE',
          statusColor: 'text-yellow-700'
        };
      case 'red':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-500',
          statusText: 'BALNEAZIONE PERICOLOSA',
          statusColor: 'text-red-700'
        };
      default:
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-500',
          statusText: 'ATTENZIONE',
          statusColor: 'text-yellow-700'
        };
    }
  };

  const flagStyles = getFlagStyles();

  return (
    <Card className="sea-gradient-background animate-gradient-wave p-8 rounded-2xl shadow-lg border-0 mb-16 overflow-hidden relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Colonna Sinistra: Dati e Avviso (70% su desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Titolo */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-blue-900 mb-2">
              🌊 Bollettino del Mare Oggi
            </h3>
          </div>

          {/* Riga Dati Live */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            
            {/* Temperatura Acqua */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-sea-data-pulse border border-white/30">
              <div className="flex items-center space-x-3">
                <Thermometer className="h-6 w-6 text-blue-800" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Temp. Acqua</p>
                  <p className="text-xl font-bold text-blue-900">{seaConditions.waterTemp}°C</p>
                </div>
              </div>
            </div>

            {/* Altezza Onde */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-sea-data-pulse border border-white/30" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-3">
                <Waves className="h-6 w-6 text-blue-800" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Altezza Onde</p>
                  <p className="text-xl font-bold text-blue-900">{seaConditions.waveHeight}m</p>
                  <p className="text-xs text-blue-700">({seaConditions.waveDescription})</p>
                </div>
              </div>
            </div>

            {/* Vento */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-sea-data-pulse border border-white/30" style={{ animationDelay: '2s' }}>
              <div className="flex items-center space-x-3">
                <Wind className="h-6 w-6 text-blue-800" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Vento</p>
                  <p className="text-xl font-bold text-blue-900">{seaConditions.windSpeed} km/h</p>
                  <p className="text-xs text-blue-700">({seaConditions.windDescription})</p>
                </div>
              </div>
            </div>

          </div>

          {/* Avviso di Sicurezza */}
          <div className="bg-white/25 backdrop-blur-sm rounded-xl p-6 border border-white/40">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Sicurezza Prima di Tutto</h4>
                <p className="text-blue-800 leading-relaxed">
                  Controlla sempre le condizioni e il colore della bandiera di salvataggio prima di entrare in acqua. 
                  Rispetta le indicazioni del personale di salvataggio. La tua sicurezza è la nostra priorità.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Colonna Destra: Indicatore Bandiera (30% su desktop) */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center">
          
          {/* Asta della Bandiera */}
          <div className="relative flex flex-col items-center">
            
            {/* Bandiera */}
            <div className="relative mb-4">
              <Flag 
                className={`h-20 w-20 ${flagStyles.color} animate-flag-waving drop-shadow-lg`}
                fill="currentColor"
              />
              {/* Overlay colorato sulla bandiera */}
              <div 
                className={`absolute inset-0 ${flagStyles.bgColor} opacity-80 animate-flag-waving`}
                style={{
                  maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'currentColor\'%3E%3Cpath d=\'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z\'/%3E%3C/svg%3E")',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }}
              />
            </div>

            {/* Asta */}
            <div className="w-1 h-32 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-md"></div>

            {/* Etichetta Stato */}
            <div className="mt-6 text-center">
              <div className="bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/50">
                <p className={`text-sm font-bold ${flagStyles.statusColor} uppercase tracking-wide`}>
                  {flagStyles.statusText}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {flagStatus.text}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Overlay decorativo per profondità */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
    </Card>
  );
};

export default SeaBulletinWidget;
