
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

  if (!isSwimmingSeason) {
    return null;
  }

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

  return (
    <Card className="p-4 h-auto rounded-3xl border-0 shadow-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 text-white">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-cyan-200" />
          <h3 className="text-lg font-bold text-white">Stato della Costa Oggi</h3>
        </div>

        {/* Three Circular Indicators */}
        <div className="grid grid-cols-3 gap-3">
          {/* Flag Safety Indicator */}
          <div className="text-center group cursor-pointer">
            <div className="relative mb-2 transform transition-transform duration-200 hover:scale-105">
              <div className={`w-12 h-12 rounded-full ${getFlagColor()} flex items-center justify-center mx-auto shadow-lg`}>
                <Flag className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-xs font-medium text-cyan-100">{flagStatus.text}</div>
            <div className="text-xs text-cyan-200">Bandiera</div>
          </div>

          {/* Water Temperature Indicator */}
          <div className="text-center group cursor-pointer">
            <div className="relative mb-2 transform transition-transform duration-200 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center mx-auto shadow-lg">
                <Thermometer className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-xs font-bold text-white">{waterTemperature}°C</div>
            <div className="text-xs text-cyan-200">Acqua</div>
          </div>

          {/* Water Quality Indicator */}
          <div className="text-center group cursor-pointer">
            <div className="relative mb-2 transform transition-transform duration-200 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center mx-auto shadow-lg">
                <Droplets className={`h-6 w-6 ${getQualityColor()}`} />
              </div>
            </div>
            <div className="text-xs font-medium text-cyan-100">{waterQuality.text}</div>
            <div className="text-xs text-cyan-200">Qualità</div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex items-start gap-2 text-xs text-cyan-200 pt-3 border-t border-white/20">
          <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
          <button className="leading-tight hover:text-white transition-colors duration-200 text-left">
            Scopri il significato dei colori e i consigli di sicurezza
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CoastalStatusWidget;
