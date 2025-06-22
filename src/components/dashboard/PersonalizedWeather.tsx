
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

  console.log('🌤️ Stati meteo:', {
    userLocation: !!userLocation,
    isLoadingLocation,
    weatherLoading,
    hasWeather: !!weather,
    error
  });

  const getGradientColors = (condition: string) => {
    switch (condition) {
      case 'Clear':
        return 'from-blue-400 via-blue-500 to-orange-400';
      case 'Clouds':
        return 'from-blue-500 via-blue-600 to-blue-700';
      case 'Rain':
      case 'Drizzle':
        return 'from-blue-600 via-blue-700 to-indigo-700';
      case 'Snow':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'Thunderstorm':
        return 'from-blue-700 via-purple-600 to-indigo-700';
      default:
        return 'from-blue-500 via-blue-600 to-cyan-600';
    }
  };

  if (loading) {
    return (
      <Card className="p-4 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-3"></div>
          <div className="h-6 bg-white/20 rounded mb-2"></div>
          <div className="h-3 bg-white/20 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error && !weather) {
    return (
      <Card className="p-4 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div className="text-center">
          <h3 className="text-base font-semibold mb-2">Errore Meteo</h3>
          <p className="text-red-100 text-xs">{error}</p>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-4 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white">
        <div className="text-center">
          <h3 className="text-base font-semibold mb-2">Meteo non disponibile</h3>
          <p className="text-gray-100 text-xs">Dati meteo in caricamento...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br ${getGradientColors(weather.condition)} text-white flex flex-col justify-between`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold mb-1">Meteo Locale</h3>
            <div className="flex items-center gap-1 text-white/80 text-xs">
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
        
        <div className="text-center py-2">
          <div className="text-3xl font-bold tracking-tight">{weather.temperature}°C</div>
          <div className="text-white/80 capitalize text-xs mt-1">{weather.description}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Droplets className="h-3 w-3 text-white/70 flex-shrink-0" />
            <div>
              <div className="text-xs text-white/70">Umidità</div>
              <div className="font-bold text-white text-sm">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-3 w-3 text-white/70 flex-shrink-0" />
            <div>
              <div className="text-xs text-white/70">Vento</div>
              <div className="font-bold text-white text-sm">{weather.wind} km/h</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-white/70 pt-2 border-t border-white/20 mt-2">
          <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
          <span className="leading-tight">Usando dati fallback - {error}</span>
        </div>
      )}

      {!error && (
        <div className="flex items-start gap-2 text-xs text-white/70 pt-2 border-t border-white/20 mt-2">
          <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
          <span className="leading-tight">
            {userLocation ? 'Meteo preciso dalla tua posizione GPS' : 'Meteo per la zona selezionata'}
          </span>
        </div>
      )}
    </Card>
  );
};

export default PersonalizedWeather;
