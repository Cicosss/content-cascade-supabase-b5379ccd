
import React from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin, Satellite } from 'lucide-react';
import { useWeatherAPI } from '@/hooks/useWeatherAPI';

interface PersonalizedWeatherProps {
  gpsLocation?: {lat: number; lng: number} | null;
}

const PersonalizedWeather: React.FC<PersonalizedWeatherProps> = ({ gpsLocation }) => {
  const { weather, loading, error } = useWeatherAPI(gpsLocation);

  const getWeatherIcon = (condition: string, iconCode?: string) => {
    // Use OpenWeatherMap icon codes for more accurate icons
    if (iconCode) {
      if (iconCode.includes('01')) return <Sun className="h-8 w-8 text-yellow-400" />;
      if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) 
        return <Cloud className="h-8 w-8 text-gray-400" />;
      if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) 
        return <CloudRain className="h-8 w-8 text-blue-400" />;
    }

    // Fallback to condition-based icons
    switch (condition) {
      case 'Clear':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'Clouds':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'Rain':
      case 'Drizzle':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />;
    }
  };

  const getGradientColors = (condition: string) => {
    switch (condition) {
      case 'Clear':
        return 'from-yellow-400 to-orange-500';
      case 'Clouds':
        return 'from-gray-400 to-blue-500';
      case 'Rain':
      case 'Drizzle':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-blue-500 to-cyan-600';
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

  if (error || !weather) {
    return (
      <Card className="p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Errore Meteo</h3>
          <p className="text-red-100 text-sm">{error || 'Dati meteo non disponibili'}</p>
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
              {gpsLocation ? (
                <>
                  <Satellite className="h-3 w-3" />
                  <span>{weather.location}</span>
                  <span className="text-xs ml-1">(GPS Live)</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3 w-3" />
                  <span>{weather.location}</span>
                </>
              )}
            </div>
          </div>
          {getWeatherIcon(weather.condition, weather.icon)}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{weather.temperature}°C</div>
            <div className="text-white/90 capitalize">{weather.description}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-xs text-white/70">Umidità</div>
              <div className="font-semibold">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-white/70" />
            <div>
              <div className="text-xs text-white/70">Vento</div>
              <div className="font-semibold">{weather.wind} km/h</div>
            </div>
          </div>
        </div>

        {gpsLocation && (
          <div className="text-xs text-white/70 text-center pt-2 border-t border-white/20">
            🛰️ Meteo aggiornato in tempo reale dalla tua posizione GPS via OpenWeatherMap
          </div>
        )}
      </div>
    </Card>
  );
};

export default PersonalizedWeather;
