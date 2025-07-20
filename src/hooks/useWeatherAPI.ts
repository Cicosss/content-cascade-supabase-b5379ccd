
import { useState, useEffect, useCallback } from 'react';
import { weatherApiService } from '@/services/weatherApiService';
import { WeatherData } from '@/types/api';
import { devLog } from '@/utils/devLogger';

export const useWeatherAPI = (location: {lat: number; lng: number} | null) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (coords: {lat: number; lng: number}) => {
    devLog.info('🌤️ Fetching weather via enhanced API service for:', coords);
    setLoading(true);
    setError(null);

    try {
      const weatherData = await weatherApiService.getWeather(coords);
      // FIX: Aggiungere null check per evitare TypeError
      if (weatherData) {
        setWeather(weatherData);
        setError(null);
      } else {
        setWeather(null);
        setError('Dati meteo non disponibili');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      devLog.error('❌ Weather API hook error:', errorMessage);
      setError('Errore nel recupero dati meteo');
      
      // Service already provides fallback data, but we can add additional handling here
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location && location.lat && location.lng) {
      fetchWeather(location);
    }
  }, [location, fetchWeather]);

  return { weather, loading, error };
};
