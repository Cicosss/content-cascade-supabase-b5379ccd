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
      <Card className="p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error && !weather) {
    return (
      <Card className="p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Errore Meteo</h3>
          <p className="text-red-100 text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Meteo non disponibile</h3>
          <p className="text-gray-100 text-sm">Dati meteo in caricamento...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br ${getGradientColors(weather.condition)} text-white`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Meteo Locale</h3>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              {userLocation ? (
                <Crosshair className="h-3 w-3" />
              ) : (
                <MapPin className="h-3 w-3" />
              )}
              <span className="font-medium">{weather.location}</span>
            </div>
            {userLocation && (
              <div className="text-xs text-white/60 mt-1">
                📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
            )}
          </div>
          <AnimatedWeatherIcon 
            condition={weather.condition} 
            iconCode={weather.icon}
            className="h-12 w-12"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold tracking-tight">{weather.temperature}°C</div>
            <div className="text-white/80 capitalize text-sm">{weather.description}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-xs text-white/70">Umidità</div>
              <div className="font-bold text-white">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-xs text-white/70">Vento</div>
              <div className="font-bold text-white">{weather.wind} km/h</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-white/70 text-center pt-2 border-t border-white/20">
            <Info className="h-3 w-3 flex-shrink-0" />
            <span>Usando dati fallback - {error}</span>
          </div>
        )}

        {userLocation && !error && (
          <div className="flex items-center gap-2 text-xs text-white/70 text-center pt-2 border-t border-white/20">
            <Info className="h-3 w-3 flex-shrink-0" />
            <span>Meteo preciso dalla tua posizione GPS tramite Open-Meteo + OpenStreetMap</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PersonalizedWeather;
