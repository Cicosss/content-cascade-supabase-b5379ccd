
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

export const useWeatherAPI = (location: {lat: number; lng: number} | null) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (coords: {lat: number; lng: number}) => {
    console.log('🌤️ Recupero dati meteo per:', coords);
    setLoading(true);
    setError(null);

    try {
      // Usa Open-Meteo API (gratuita, senza API key)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe/Rome`,
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
      console.log('✅ Dati meteo ricevuti da Open-Meteo:', data);
      
      // Prova a ottenere il nome della città usando un servizio di geocoding gratuito
      let cityName = 'Posizione corrente';
      try {
        const geoResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=it`
        );
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          cityName = geoData.city || geoData.locality || geoData.principalSubdivision || 'Posizione corrente';
        }
      } catch (geoError) {
        console.warn('⚠️ Errore geocoding:', geoError);
      }

      // Mappa i codici meteo WMO alle descrizioni
      const getWeatherDescription = (code: number) => {
        const weatherCodes: { [key: number]: { description: string; condition: string; icon: string } } = {
          0: { description: 'cielo sereno', condition: 'Clear', icon: '01d' },
          1: { description: 'prevalentemente sereno', condition: 'Clear', icon: '02d' },
          2: { description: 'parzialmente nuvoloso', condition: 'Clouds', icon: '03d' },
          3: { description: 'coperto', condition: 'Clouds', icon: '04d' },
          45: { description: 'nebbia', condition: 'Clouds', icon: '50d' },
          48: { description: 'nebbia con brina', condition: 'Clouds', icon: '50d' },
          51: { description: 'pioggerellina leggera', condition: 'Drizzle', icon: '09d' },
          53: { description: 'pioggerellina moderata', condition: 'Drizzle', icon: '09d' },
          55: { description: 'pioggerellina intensa', condition: 'Drizzle', icon: '09d' },
          61: { description: 'pioggia leggera', condition: 'Rain', icon: '10d' },
          63: { description: 'pioggia moderata', condition: 'Rain', icon: '10d' },
          65: { description: 'pioggia intensa', condition: 'Rain', icon: '10d' },
          71: { description: 'neve leggera', condition: 'Snow', icon: '13d' },
          73: { description: 'neve moderata', condition: 'Snow', icon: '13d' },
          75: { description: 'neve intensa', condition: 'Snow', icon: '13d' },
          95: { description: 'temporale', condition: 'Thunderstorm', icon: '11d' },
          96: { description: 'temporale con grandine leggera', condition: 'Thunderstorm', icon: '11d' },
          99: { description: 'temporale con grandine intensa', condition: 'Thunderstorm', icon: '11d' }
        };

        return weatherCodes[code] || { description: 'tempo variabile', condition: 'Clear', icon: '01d' };
      };

      const weatherInfo = getWeatherDescription(data.current.weather_code);

      setWeather({
        location: cityName,
        temperature: Math.round(data.current.temperature_2m),
        condition: weatherInfo.condition,
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m),
        description: weatherInfo.description,
        icon: weatherInfo.icon
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
