
import React from 'react';
import { Card } from '@/components/ui/card';
import { Flag, Thermometer, Droplets, Info, Waves } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useWeatherAPI } from '@/hooks/useWeatherAPI';
import { useCoastalStatus } from '@/hooks/useCoastalStatus';

const CoastalStatusWidget: React.FC = () => {
  const { userLocation } = useLocation();
  const { weather } = useWeatherAPI(userLocation);
  const { flagStatus, waterTemperature, waterQuality, isSwimmingSeason } = useCoastalStatus(weather);


  const getFlagColor = () => {
    switch (flagStatus.level) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getQualityColor = () => {
    switch (waterQuality.level) {
      case 'excellent': return 'text-blue-500';
      case 'good': return 'text-green-500';
      case 'fair': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  // Dynamic title based on season
  const getTitle = () => {
    return isSwimmingSeason ? 'Stato della Costa Oggi' : 'Condizioni Marine';
  };

  // Info message based on season and data availability
  const getInfoMessage = () => {
    if (!weather) {
      return 'Caricamento dati meteorologici in corso...';
    }
    if (!isSwimmingSeason) {
      return 'Informazioni generali sulle condizioni marine';
    }
    return 'Scopri il significato dei colori e i consigli di sicurezza';
  };

  return (
    <Card className="p-3 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 text-white flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-cyan-200" />
          <h3 className="typography-small font-bold text-white">{getTitle()}</h3>
        </div>

        {/* Three Circular Indicators */}
        <div className="grid grid-cols-3 gap-2">
          {/* Flag Safety Indicator */}
          <div className="text-center group cursor-pointer">
            <div className="relative mb-2 transform transition-transform duration-200 hover:scale-105">
              <div className={`w-10 h-10 rounded-full ${getFlagColor()} flex items-center justify-center mx-auto shadow-lg`}>
                <Flag className="h-5 w-5 text-white animate-pulse" />
              </div>
            </div>
            <div className="typography-caption font-medium text-cyan-100">{flagStatus.text}</div>
            <div className="typography-caption text-cyan-200">Bandiera</div>
          </div>

          {/* Water Temperature Indicator */}
          <div className="text-center group cursor-pointer">
            <div className="relative mb-2 transform transition-transform duration-200 hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center mx-auto shadow-lg">
                <Thermometer className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="typography-caption font-bold text-white">{waterTemperature}°C</div>
            <div className="typography-caption text-cyan-200">Acqua</div>
          </div>

          {/* Water Quality Indicator */}
          <div className="text-center group cursor-pointer">
            <div className="relative mb-2 transform transition-transform duration-200 hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center mx-auto shadow-lg">
                <Droplets className={`h-5 w-5 ${getQualityColor()}`} />
              </div>
            </div>
            <div className="typography-caption font-medium text-cyan-100">{waterQuality.text}</div>
            <div className="typography-caption text-cyan-200">Qualità</div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="typography-caption flex items-start gap-2 text-cyan-200 pt-2 border-t border-white/20">
        <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
        <button className="typography-caption leading-tight hover:text-white transition-colors duration-200 text-left">
          {getInfoMessage()}
        </button>
      </div>
    </Card>
  );
};

export default CoastalStatusWidget;
