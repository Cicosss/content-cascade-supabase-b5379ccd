
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Wind, Droplets, MapPin, Crosshair, Info, Clock } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useWeatherAPI } from '@/hooks/useWeatherAPI';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

const PersonalizedWeather: React.FC = () => {
  const { userLocation, isLoadingLocation } = useLocation();
  const { weather, loading: weatherLoading, error } = useWeatherAPI(userLocation);
  const [currentTime, setCurrentTime] = useState('');

  const loading = isLoadingLocation || weatherLoading;

  // Determine if it's night based on time (simple 6PM-6AM rule)
  const isNight = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 18 || hour < 6;
  };

  // Update local time based on user location or timezone
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // If we have user location, we could determine timezone, but for simplicity using local time
      const timeString = now.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [userLocation]);


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
          <h3 className="typography-small font-semibold mb-1">Errore Meteo</h3>
          <p className="typography-caption text-red-100">{error}</p>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className={`p-3 h-full rounded-3xl border-0 shadow-xl bg-gradient-to-br ${getStandardGradient()} text-white`}>
        <div className="text-center">
          <h3 className="typography-small font-semibold mb-1">Meteo non disponibile</h3>
          <p className="typography-caption text-blue-100">Dati meteo in caricamento...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 rounded-3xl border-0 shadow-xl bg-gradient-to-br ${getStandardGradient()} text-white`}>
      {/* Header with proper mobile layout */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="typography-small font-bold text-white">Meteo Locale</h3>
          <div className="typography-caption flex items-center gap-1 text-blue-100 mt-1">
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
          className="h-8 w-8 flex-shrink-0 ml-2"
          isNight={isNight()}
        />
      </div>
      
      {/* Temperature and description */}
      <div className="text-center mb-3">
        <div className="text-2xl font-bold text-white mb-1">{weather.temperature}°C</div>
        <div className="typography-caption text-blue-100 capitalize font-medium">{weather.description}</div>
      </div>

      {/* Compact weather details */}
      <div className="flex items-center justify-between gap-4 py-2 border-t border-white/20">
        <div className="flex items-center gap-2 flex-1">
          <Droplets className="h-3 w-3 text-blue-200 flex-shrink-0" />
          <div className="min-w-0">
            <div className="typography-caption text-blue-200">Umidità</div>
            <div className="typography-caption font-bold text-white">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Wind className="h-3 w-3 text-blue-200 flex-shrink-0" />
          <div className="min-w-0">
            <div className="typography-caption text-blue-200">Vento</div>
            <div className="typography-caption font-bold text-white">{weather.wind} km/h</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Clock className="h-3 w-3 text-blue-200 flex-shrink-0" />
          <div className="min-w-0">
            <div className="typography-caption text-blue-200">Ora</div>
            <div className="typography-caption font-bold text-white">{currentTime}</div>
          </div>
        </div>
      </div>

      {/* Compact footer info */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/20 mt-2">
        <Info className="h-3 w-3 flex-shrink-0 text-blue-200" />
        <span className="typography-caption text-blue-200 leading-tight">
          {error ? 'Dati fallback' : 
           userLocation ? 'GPS attivo' : 'Zona selezionata'}
        </span>
      </div>
    </Card>
  );
};

export default PersonalizedWeather;
