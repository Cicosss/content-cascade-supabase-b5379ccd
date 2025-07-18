import { POI } from '@/types/poi';
import { WeatherData } from '@/types/api';
import { errorLogger } from './errorLogger';

export interface FallbackData {
  pois: POI[];
  weather: WeatherData | null;
  lastUpdated: number;
}

export class FallbackManager {
  private static readonly STORAGE_KEY = 'api-fallback-data';
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Store fallback data in localStorage
   */
  static storeFallbackData(type: keyof FallbackData, data: any): void {
    try {
      const existing = this.getFallbackData();
      const updated = {
        ...existing,
        [type]: data,
        lastUpdated: Date.now()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      console.log(`💾 Stored fallback data for ${type}`);
    } catch (error) {
      console.warn('Failed to store fallback data:', error);
    }
  }

  /**
   * Get fallback data from localStorage
   */
  static getFallbackData(): FallbackData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return this.getDefaultFallbackData();
      }

      const data = JSON.parse(stored);
      
      // Check if data is too old
      if (Date.now() - data.lastUpdated > this.MAX_AGE) {
        console.log('🗑️ Fallback data expired, using defaults');
        return this.getDefaultFallbackData();
      }

      return data;
    } catch (error) {
      console.warn('Failed to parse fallback data:', error);
      return this.getDefaultFallbackData();
    }
  }

  /**
   * Get fallback POIs when API fails
   */
  static getFallbackPOIs(): POI[] {
    const fallbackData = this.getFallbackData();
    
    if (fallbackData.pois.length > 0) {
      console.log('📋 Using cached POI fallback data');
      return fallbackData.pois;
    }

    // Return essential Rimini POIs as hardcoded fallback
    console.log('🏛️ Using hardcoded POI fallback data');
    return this.getEssentialRiminiPOIs();
  }

  /**
   * Get fallback weather when API fails
   */
  static getFallbackWeather(): WeatherData | null {
    const fallbackData = this.getFallbackData();
    
    if (fallbackData.weather) {
      console.log('🌤️ Using cached weather fallback data');
      return fallbackData.weather;
    }

    // Return generic Rimini weather
    console.log('🌊 Using default weather fallback');
    return {
      location: 'Rimini, IT',
      temperature: 22,
      condition: 'partly-cloudy',
      humidity: 65,
      wind: 8,
      description: 'Parzialmente nuvoloso',
      icon: '02d'
    };
  }

  /**
   * Clear expired fallback data
   */
  static clearExpiredData(): void {
    const data = this.getFallbackData();
    if (Date.now() - data.lastUpdated > this.MAX_AGE) {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Cleared expired fallback data');
    }
  }

  /**
   * Handle API failure with appropriate fallback
   */
  static handleAPIFailure<T>(
    apiName: string,
    fallbackValue: T,
    originalError: Error
  ): T {
    errorLogger.logError({
      type: originalError.name as any,
      message: `${apiName} failed, using fallback`,
      details: originalError,
      retryable: true,
      endpoint: apiName
    } as any);

    console.warn(`⚠️ ${apiName} failed, using fallback data:`, fallbackValue);
    return fallbackValue;
  }

  private static getDefaultFallbackData(): FallbackData {
    return {
      pois: [],
      weather: null,
      lastUpdated: 0
    };
  }

  private static getEssentialRiminiPOIs(): POI[] {
    return [
      {
        id: 'fallback-1',
        name: 'Centro Storico di Rimini',
        description: 'Il cuore della città con monumenti storici e shopping',
        category: 'attraction',
        latitude: 44.0678,
        longitude: 12.5695,
        address: 'Centro, Rimini',
        target_audience: 'everyone',
        images: [],
        price_info: 'Gratuito',
        avg_rating: 4.5
      },
      {
        id: 'fallback-2',
        name: 'Spiaggia di Rimini',
        description: 'La famosa spiaggia adriatica con stabilimenti balneari',
        category: 'beach',
        latitude: 44.0773,
        longitude: 12.5951,
        address: 'Lungomare, Rimini',
        target_audience: 'families',
        images: [],
        price_info: 'Vario',
        avg_rating: 4.2
      },
      {
        id: 'fallback-3',
        name: 'Ponte di Tiberio',
        description: 'Antico ponte romano del I secolo d.C.',
        category: 'monument',
        latitude: 44.0649,
        longitude: 12.5657,
        address: 'Corso d\'Augusto, Rimini',
        target_audience: 'everyone',
        images: [],
        price_info: 'Gratuito',
        avg_rating: 4.6
      }
    ];
  }
}

// Clear expired data on module load
FallbackManager.clearExpiredData();