
import { useMemo } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  wind: number;
  humidity: number;
}

interface FlagStatus {
  level: 'green' | 'yellow' | 'red';
  text: string;
}

interface WaterQuality {
  level: 'excellent' | 'good' | 'fair';
  text: string;
}

export const useCoastalStatus = (weather: WeatherData | null) => {
  // Check if we're in swimming season (May 1 - September 30)
  const isSwimmingSeason = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const seasonStart = new Date(currentYear, 4, 1); // May 1st
    const seasonEnd = new Date(currentYear, 8, 30); // September 30th
    
    return today >= seasonStart && today <= seasonEnd;
  }, []);

  // Calculate flag status based on weather conditions
  const flagStatus = useMemo((): FlagStatus => {
    if (!weather) {
      return { level: 'yellow', text: 'Prudenza' };
    }

    const { temperature, condition, wind } = weather;
    
    // Red flag conditions
    if (temperature < 15 || wind > 25 || condition === 'Thunderstorm') {
      return { level: 'red', text: 'Pericolo' };
    }
    
    // Yellow flag conditions
    if (temperature < 20 || wind > 15 || condition === 'Rain' || condition === 'Clouds') {
      return { level: 'yellow', text: 'Prudenza' };
    }
    
    // Green flag conditions
    return { level: 'green', text: 'Sicuro' };
  }, [weather]);

  // Calculate water temperature (approximation based on air temperature and season)
  const waterTemperature = useMemo(() => {
    if (!weather) return 20;
    
    const today = new Date();
    const month = today.getMonth();
    
    // Seasonal water temperature adjustment
    let seasonalAdjustment = 0;
    if (month >= 4 && month <= 6) { // May-July: warming up
      seasonalAdjustment = -2;
    } else if (month >= 7 && month <= 8) { // August-September: peak warmth
      seasonalAdjustment = 0;
    } else { // Other months
      seasonalAdjustment = -4;
    }
    
    // Water is typically 3-5 degrees cooler than air
    const baseWaterTemp = weather.temperature - 4 + seasonalAdjustment;
    
    // Clamp between reasonable values
    return Math.max(12, Math.min(28, Math.round(baseWaterTemp)));
  }, [weather]);

  // Calculate water quality (simulated based on weather and season)
  const waterQuality = useMemo((): WaterQuality => {
    if (!weather) {
      return { level: 'good', text: 'Buona' };
    }

    const { condition, wind } = weather;
    
    // Poor quality during storms or very windy conditions
    if (condition === 'Thunderstorm' || wind > 20) {
      return { level: 'fair', text: 'Sufficiente' };
    }
    
    // Excellent quality during calm, clear conditions
    if (condition === 'Clear' && wind < 10) {
      return { level: 'excellent', text: 'Eccellente' };
    }
    
    // Good quality for normal conditions
    return { level: 'good', text: 'Buona' };
  }, [weather]);

  return {
    flagStatus,
    waterTemperature,
    waterQuality,
    isSwimmingSeason
  };
};
