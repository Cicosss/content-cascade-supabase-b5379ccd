
import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
}

const WEATHER_API_KEY = '894c76d3f5b13b9c7d2b756c89f3ff9b';

export const useWeatherAPI = (location: {lat: number; lng: number} | null) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (coords: {lat: number; lng: number}) => {
    console.log('🌤️ Recupero dati meteo per:', coords);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${WEATHER_API_KEY}&units=metric&lang=it`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Dati meteo ricevuti:', data);
      
      // Prova a ottenere il nome della città
      let cityName = 'Posizione corrente';
      try {
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${coords.lat}&lon=${coords.lng}&limit=1&appid=${WEATHER_API_KEY}`
        );
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.length > 0) {
            cityName = geoData[0].local_names?.it || geoData[0].name || 'Posizione corrente';
          }
        }
      } catch (geoError) {
        console.warn('⚠️ Errore geocoding:', geoError);
      }

      setWeather({
        location: cityName,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        description: data.weather[0].description,
        icon: data.weather[0].icon
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      console.error('❌ Errore Weather API:', errorMessage);
      setError('Errore nel recupero dati meteo');
      
      // Fallback a dati mock
      console.log('🔄 Usando dati meteo fallback...');
      setWeather({
        location: 'Romagna',
        temperature: 22,
        condition: 'Clear',
        humidity: 65,
        wind: 8,
        description: 'cielo sereno',
        icon: '01d'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
  }, [location, fetchWeather]);

  return { weather, loading, error };
};
