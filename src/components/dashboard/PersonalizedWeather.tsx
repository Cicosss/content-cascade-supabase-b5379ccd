
import React from 'react';
import { Card } from '@/components/ui/card';
import { Wind, Droplets, MapPin, Crosshair, Info } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useWeatherAPI } from '@/hooks/useWeatherAPI';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

const PersonalizedWeather: React.FC = () => {
  const { userLocation, isLoadingLocation } = useLocation();
  const { weather, loading: weatherLoading, error } = useWeatherAPI(userLocation);

  const loading = isLoadingLocation || weatherLoading;


  // Standardized institutional blue gradient
  const getStandardGradient = () => {
    return 'from-blue-600 via-blue-700 to-blue-800';
  };

  if (loading) {
    return (
      <Card className={`p-3 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br ${getStandardGradient()} text-white`}>
        <div className="animate-pulse">
          <div className="h-3 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-2 bg-white/20 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error && !weather) {
    return (
      <Card className="p-3 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div className="text-center">
          <h3 className="text-sm font-semibold mb-1">Errore Meteo</h3>
          <p className="text-red-100 text-xs">{error}</p>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className={`p-3 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br ${getStandardGradient()} text-white`}>
        <div className="text-center">
          <h3 className="text-sm font-semibold mb-1">Meteo non disponibile</h3>
          <p className="text-blue-100 text-xs">Dati meteo in caricamento...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-3 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br ${getStandardGradient()} text-white flex flex-col justify-between`}>
      <div className="space-y-2">
        {/* Header with proper visual hierarchy */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base font-bold mb-1 text-white">Meteo Locale</h3>
            <div className="flex items-center gap-1 text-blue-100 text-xs">
              {userLocation ? (
                <Crosshair className="h-3 w-3 flex-shrink-0" />
              ) : (
                <MapPin className="h-3 w-3 flex-shrink-0" />
              )}
              <span className="font-medium truncate">{weather.location}</span>
            </div>
          </div>
          <AnimatedWeatherIcon 
            condition={weather.condition} 
            iconCode={weather.icon}
            className="h-8 w-8 flex-shrink-0"
          />
        </div>
        
        {/* Temperature display with proper hierarchy */}
        <div className="text-center py-2">
          <div className="text-3xl font-bold tracking-tight text-white">{weather.temperature}°C</div>
          <div className="text-blue-100 capitalize text-xs mt-1 font-medium">{weather.description}</div>
        </div>

        {/* Weather details grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Droplets className="h-3 w-3 text-blue-200 flex-shrink-0" />
            <div>
              <div className="text-xs text-blue-200 font-medium">Umidità</div>
              <div className="font-bold text-white text-xs">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-3 w-3 text-blue-200 flex-shrink-0" />
            <div>
              <div className="text-xs text-blue-200 font-medium">Vento</div>
              <div className="font-bold text-white text-xs">{weather.wind} km/h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info with consistent styling */}
      <div className="flex items-start gap-2 text-xs text-blue-200 pt-2 border-t border-white/20 mt-2">
        <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
        <span className="leading-tight text-xs">
          {error ? `Usando dati fallback - ${error}` : 
           userLocation ? 'Meteo preciso dalla tua posizione GPS' : 'Meteo per la zona selezionata'}
        </span>
      </div>
    </Card>
  );
};

export default PersonalizedWeather;
