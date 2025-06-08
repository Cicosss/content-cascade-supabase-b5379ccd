
import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
}

export const useWeatherAPI = (location: {lat: number; lng: number} | null) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Using OpenWeatherMap free API
        const API_KEY = '894c76d3f5b13b9c7d2b756c89f3ff9b'; // Demo key - users should replace with their own
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=metric&lang=it`
        );

        if (!response.ok) {
          throw new Error('Errore nel recupero dati meteo');
        }

        const data = await response.json();
        
        // Get city name from reverse geocoding
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${location.lat}&lon=${location.lng}&limit=1&appid=${API_KEY}`
        );
        
        let cityName = 'Posizione corrente';
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.length > 0) {
            cityName = geoData[0].local_names?.it || geoData[0].name || 'Posizione corrente';
          }
        }

        setWeather({
          location: cityName,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          description: data.weather[0].description,
          icon: data.weather[0].icon
        });
      } catch (err) {
        console.error('Weather API error:', err);
        setError('Impossibile recuperare i dati meteo');
        
        // Fallback to mock data
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
    };

    fetchWeather();
  }, [location]);

  return { weather, loading, error };
};
