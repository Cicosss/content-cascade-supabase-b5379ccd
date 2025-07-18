import { apiClient } from './apiClient';
import { WeatherData, OpenMeteoResponse, GeocodingResponse, APIErrorType } from '@/types/api';
import { devLog } from '@/utils/devLogger';

class WeatherAPIService {
  private readonly BASE_URL = 'https://api.open-meteo.com/v1/forecast';
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
  private readonly BIGDATA_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

  async getWeather(coords: { lat: number; lng: number }): Promise<WeatherData> {
    devLog.info('🌤️ Fetching weather data for:', coords);

    const cacheKey = `weather_${coords.lat}_${coords.lng}`;
    
    try {
      const response = await apiClient.request<OpenMeteoResponse>(
        () => this.fetchWeatherData(coords),
        {
          cache: true,
          cacheTTL: 600000, // 10 minutes
          retryCount: 2,
          timeout: 8000,
          corsMode: 'cors'
        },
        cacheKey
      );

      const locationName = await this.getLocationName(coords);
      
      return this.transformWeatherData(response.data, locationName);
    } catch (error) {
      devLog.error('❌ Weather API error:', error);
      
      // Return fallback data instead of throwing
      return this.getFallbackWeatherData();
    }
  }

  private async fetchWeatherData(coords: { lat: number; lng: number }): Promise<OpenMeteoResponse> {
    const url = `${this.BASE_URL}?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe/Rome`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MiaRomagna-App/1.0'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    devLog.info('✅ Weather data received:', data);
    
    return data;
  }

  private async getLocationName(coords: { lat: number; lng: number }): Promise<string> {
    try {
      // Try Nominatim first (more accurate for Italian locations)
      const nominatimResponse = await apiClient.request<GeocodingResponse>(
        () => this.fetchNominatimData(coords),
        {
          cache: true,
          cacheTTL: 3600000, // 1 hour
          retryCount: 1,
          timeout: 5000
        },
        `geocoding_${coords.lat}_${coords.lng}`
      );

      const locationName = this.parseNominatimLocation(nominatimResponse.data);
      if (locationName !== 'Posizione corrente') {
        return locationName;
      }
    } catch (error) {
      devLog.warn('⚠️ Nominatim geocoding failed:', error);
    }

    try {
      // Fallback to BigDataCloud
      const bigdataResponse = await apiClient.request<GeocodingResponse>(
        () => this.fetchBigDataCloudData(coords),
        {
          cache: true,
          cacheTTL: 3600000, // 1 hour
          retryCount: 1,
          timeout: 5000
        },
        `geocoding_fallback_${coords.lat}_${coords.lng}`
      );

      return this.parseBigDataCloudLocation(bigdataResponse.data);
    } catch (error) {
      devLog.warn('⚠️ BigDataCloud geocoding failed:', error);
      return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
    }
  }

  private async fetchNominatimData(coords: { lat: number; lng: number }): Promise<GeocodingResponse> {
    const url = `${this.NOMINATIM_URL}?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1&accept-language=it`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MiaRomagna-App/1.0 (contact@miaromagna.it)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    return response.json();
  }

  private async fetchBigDataCloudData(coords: { lat: number; lng: number }): Promise<GeocodingResponse> {
    const url = `${this.BIGDATA_URL}?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=it`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`BigDataCloud error: ${response.status}`);
    }

    return response.json();
  }

  private parseNominatimLocation(data: GeocodingResponse): string {
    const address = data.address || {};
    const parts = [];
    
    // Add neighborhood/suburb if available
    if (address.suburb) parts.push(address.suburb);
    else if (address.quarter) parts.push(address.quarter);
    else if (address.neighbourhood) parts.push(address.neighbourhood);
    
    // Add city
    if (address.city) parts.push(address.city);
    else if (address.town) parts.push(address.town);
    else if (address.village) parts.push(address.village);
    else if (address.municipality) parts.push(address.municipality);
    
    // Add province if different from city
    if (address.county && !parts.includes(address.county)) {
      parts.push(`(${address.county})`);
    }
    
    if (parts.length > 0) {
      return parts.join(', ');
    } else if (data.display_name) {
      const displayParts = data.display_name.split(',').slice(0, 3);
      return displayParts.join(', ');
    }
    
    return 'Posizione corrente';
  }

  private parseBigDataCloudLocation(data: any): string {
    const parts = [];
    
    if (data.locality && data.locality !== data.city) {
      parts.push(data.locality);
    }
    if (data.city) parts.push(data.city);
    else if (data.principalSubdivision) parts.push(data.principalSubdivision);
    
    return parts.length > 0 ? parts.join(', ') : 'Posizione corrente';
  }

  private transformWeatherData(data: OpenMeteoResponse, location: string): WeatherData {
    const weatherInfo = this.getWeatherDescription(data.current.weather_code);
    
    return {
      location,
      temperature: Math.round(data.current.temperature_2m),
      condition: weatherInfo.condition,
      humidity: data.current.relative_humidity_2m,
      wind: Math.round(data.current.wind_speed_10m),
      description: weatherInfo.description,
      icon: weatherInfo.icon
    };
  }

  private getWeatherDescription(code: number) {
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
  }

  private getFallbackWeatherData(): WeatherData {
    devLog.info('🔄 Using fallback weather data...');
    return {
      location: 'Romagna',
      temperature: 22,
      condition: 'Clear',
      humidity: 65,
      wind: 8,
      description: 'cielo sereno',
      icon: '01d'
    };
  }

  // Health check method for monitoring
  async healthCheck(): Promise<boolean> {
    try {
      const testCoords = { lat: 44.4056, lng: 12.2059 }; // Ravenna
      await this.fetchWeatherData(testCoords);
      return true;
    } catch (error) {
      devLog.error('Weather API health check failed:', error);
      return false;
    }
  }
}

export const weatherApiService = new WeatherAPIService();