
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
    <Card className="p-4 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Waves className="h-4 w-4 text-cyan-200 flex-shrink-0" />
        <h3 className="typography-small font-bold text-white truncate">{getTitle()}</h3>
      </div>

      {/* Three Circular Indicators */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Flag Safety Indicator */}
        <div className="text-center">
          <div className="mb-2">
            <div className={`w-10 h-10 rounded-full ${getFlagColor()} flex items-center justify-center mx-auto shadow-lg`}>
              <Flag className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="typography-caption font-medium text-cyan-100 leading-tight">{flagStatus.text}</div>
          <div className="typography-caption text-cyan-200 text-xs">Bandiera</div>
        </div>

        {/* Water Temperature Indicator */}
        <div className="text-center">
          <div className="mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center mx-auto shadow-lg">
              <Thermometer className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="typography-caption font-bold text-white">{waterTemperature}°C</div>
          <div className="typography-caption text-cyan-200 text-xs">Acqua</div>
        </div>

        {/* Water Quality Indicator */}
        <div className="text-center">
          <div className="mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center mx-auto shadow-lg">
              <Droplets className={`h-4 w-4 ${getQualityColor()}`} />
            </div>
          </div>
          <div className="typography-caption font-medium text-cyan-100 leading-tight">{waterQuality.text}</div>
          <div className="typography-caption text-cyan-200 text-xs">Qualità</div>
        </div>
      </div>

      {/* Compact Info Section */}
      <div className="pt-2 border-t border-white/20">
        <div className="flex items-center gap-2">
          <Info className="h-3 w-3 flex-shrink-0 text-cyan-200" />
          <span className="typography-caption text-cyan-200 leading-tight">
            {getInfoMessage()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CoastalStatusWidget;
