import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin } from 'lucide-react';

interface PersonalizedWeatherProps {
  gpsLocation?: {lat: number; lng: number} | null;
}

const PersonalizedWeather: React.FC<PersonalizedWeatherProps> = ({ gpsLocation }) => {
  const { user } = useAuth();
  const [weather, setWeather] = useState({
    location: 'Rimini',
    temperature: 22,
    condition: 'Soleggiato',
    humidity: 65,
    wind: 8,
    description: 'Cielo sereno'
  });
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Rimini');

  useEffect(() => {
    if (gpsLocation) {
      console.log('Using GPS location for weather:', gpsLocation);
      setWeatherByCoordinates(gpsLocation.lat, gpsLocation.lng);
    } else {
      fetchUserProfileLocation();
    }
  }, [gpsLocation, user]);

  const fetchUserProfileLocation = async () => {
    if (!user) {
      setLocationName('Rimini');
      setWeatherByLocation('Rimini');
      return;
    }
    
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('arrival_location')
        .eq('id', user.id)
        .maybeSingle();
      
      const location = data?.arrival_location || 'Rimini';
      setLocationName(location);
      setWeatherByLocation(location);
    } catch (error) {
      console.error('Error fetching user profile location:', error);
      setWeatherByLocation('Rimini');
    }
  };

  const setWeatherByCoordinates = (lat: number, lng: number) => {
    setLoading(true);
    
    // Determina la località basandosi sulle coordinate GPS
    let locationName = 'Romagna';
    let mockData = { temp: 22, condition: 'Soleggiato', humidity: 65, wind: 8 };

    // Controlla se le coordinate sono in aree conosciute della Romagna
    if (lat >= 44.0 && lat <= 44.1 && lng >= 12.5 && lng <= 12.6) {
      locationName = 'Rimini';
      mockData = { temp: 24, condition: 'Soleggiato', humidity: 68, wind: 12 };
    } else if (lat >= 44.0 && lat <= 44.1 && lng >= 12.6 && lng <= 12.7) {
      locationName = 'Riccione';
      mockData = { temp: 23, condition: 'Soleggiato', humidity: 70, wind: 10 };
    } else if (lat >= 44.15 && lat <= 44.25 && lng >= 12.3 && lng <= 12.4) {
      locationName = 'Cesenatico';
      mockData = { temp: 22, condition: 'Nuvoloso', humidity: 72, wind: 8 };
    } else if (lat >= 44.4 && lat <= 44.5 && lng >= 12.1 && lng <= 12.2) {
      locationName = 'Ravenna';
      mockData = { temp: 21, condition: 'Nuvoloso', humidity: 75, wind: 6 };
    } else if (lat >= 44.2 && lat <= 44.3 && lng >= 12.0 && lng <= 12.1) {
      locationName = 'Forlì';
      mockData = { temp: 25, condition: 'Soleggiato', humidity: 65, wind: 14 };
    } else if (lat >= 43.9 && lat <= 44.0 && lng >= 12.4 && lng <= 12.8) {
      locationName = 'Gradara';
      mockData = { temp: 23, condition: 'Soleggiato', humidity: 67, wind: 9 };
    }

    setWeather({
      location: locationName,
      temperature: mockData.temp,
      condition: mockData.condition,
      humidity: mockData.humidity,
      wind: mockData.wind,
      description: `${mockData.condition} nella tua posizione GPS`
    });
    setLocationName(locationName);
    setLoading(false);
  };

  const setWeatherByLocation = (location: string) => {
    setLoading(true);
    
    const mockWeatherData = {
      Rimini: { temp: 24, condition: 'Soleggiato', humidity: 68, wind: 12 },
      Riccione: { temp: 23, condition: 'Soleggiato', humidity: 70, wind: 10 },
      Cesenatico: { temp: 22, condition: 'Nuvoloso', humidity: 72, wind: 8 },
      Ravenna: { temp: 21, condition: 'Nuvoloso', humidity: 75, wind: 6 },
      Forlì: { temp: 25, condition: 'Soleggiato', humidity: 65, wind: 14 }
    };
    
    const locationData = mockWeatherData[location as keyof typeof mockWeatherData] || mockWeatherData.Rimini;
    
    setWeather({
      location: location,
      temperature: locationData.temp,
      condition: locationData.condition,
      humidity: locationData.humidity,
      wind: locationData.wind,
      description: `${locationData.condition} con temperatura piacevole`
    });
    setLoading(false);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Soleggiato':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'Nuvoloso':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'Pioggia':
      case 'Pioggerella':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />;
    }
  };

  const getGradientColors = (condition: string) => {
    switch (condition) {
      case 'Soleggiato':
        return 'from-yellow-400 to-orange-500';
      case 'Nuvoloso':
        return 'from-gray-400 to-blue-500';
      case 'Pioggia':
      case 'Pioggerella':
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

  return (
    <Card className={`p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br ${getGradientColors(weather.condition)} text-white`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Meteo Locale</h3>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="h-3 w-3" />
              <span>{weather.location}</span>
              {gpsLocation && <span className="text-xs">(GPS)</span>}
            </div>
          </div>
          {getWeatherIcon(weather.condition)}
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
            📍 Meteo rilevato tramite GPS dalla mappa
          </div>
        )}
      </div>
    </Card>
  );
};

export default PersonalizedWeather;
