
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';

const PersonalizedWeather = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState({
    location: 'Rimini',
    temperature: 22,
    condition: 'Soleggiato',
    humidity: 65,
    wind: 8
  });
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    fetchUserLocation();
  }, [user]);

  const fetchUserLocation = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_profiles')
      .select('arrival_location')
      .eq('id', user.id)
      .single();
    
    if (data?.arrival_location) {
      setUserLocation(data.arrival_location);
      setWeather(prev => ({
        ...prev,
        location: data.arrival_location
      }));
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Soleggiato':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'Nuvoloso':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'Pioggia':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <Card className="p-6 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Meteo Locale</h3>
            <p className="text-blue-100 text-sm">{weather.location}</p>
          </div>
          {getWeatherIcon(weather.condition)}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{weather.temperature}°C</div>
            <div className="text-blue-100">{weather.condition}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-200" />
            <div>
              <div className="text-xs text-blue-200">Umidità</div>
              <div className="font-semibold">{weather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-200" />
            <div>
              <div className="text-xs text-blue-200">Vento</div>
              <div className="font-semibold">{weather.wind} km/h</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PersonalizedWeather;
