
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

const PersonalizedWeather = () => {
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
  const [userLocation, setUserLocation] = useState('Rimini');

  useEffect(() => {
    fetchUserLocation();
  }, [user]);

  useEffect(() => {
    if (userLocation) {
      fetchWeather(userLocation);
    }
  }, [userLocation]);

  const fetchUserLocation = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_profiles')
      .select('arrival_location')
      .eq('id', user.id)
      .maybeSingle();
    
    if (data?.arrival_location) {
      setUserLocation(data.arrival_location);
    }
  };

  const fetchWeather = async (location: string) => {
    setLoading(true);
    try {
      // Using OpenWeatherMap API (free tier)
      const API_KEY = '8f4e8e8f8c8f8f8f8f8f8f8f8f8f8f8f'; // Replace with your actual API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location},IT&appid=${API_KEY}&units=metric&lang=it`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        setWeather({
          location: data.name,
          temperature: Math.round(data.main.temp),
          condition: translateCondition(data.weather[0].main),
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          description: data.weather[0].description
        });
      } else {
        // Fallback to mock data for Romagna area
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
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback weather data
      setWeather({
        location: location,
        temperature: 22,
        condition: 'Soleggiato',
        humidity: 65,
        wind: 8,
        description: 'Tempo piacevole'
      });
    } finally {
      setLoading(false);
    }
  };

  const translateCondition = (condition: string) => {
    const translations: { [key: string]: string } = {
      'Clear': 'Soleggiato',
      'Clouds': 'Nuvoloso',
      'Rain': 'Pioggia',
      'Drizzle': 'Pioggerella',
      'Thunderstorm': 'Temporale',
      'Snow': 'Neve',
      'Mist': 'Nebbia',
      'Fog': 'Nebbia'
    };
    return translations[condition] || condition;
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
            <p className="text-white/80 text-sm">{weather.location}</p>
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
      </div>
    </Card>
  );
};

export default PersonalizedWeather;
