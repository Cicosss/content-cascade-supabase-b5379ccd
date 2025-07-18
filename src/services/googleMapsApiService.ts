import { Loader } from '@googlemaps/js-api-loader';
import { apiClient } from './apiClient';
import { APIErrorType, RequestConfig } from '@/types/api';
import { devLog } from '@/utils/devLogger';

export interface GoogleMapsConfig {
  apiKey: string;
  version: string;
  libraries: string[];
  region: string;
  language: string;
}

export interface PlaceSearchRequest {
  query: string;
  location?: { lat: number; lng: number };
  radius?: number;
  type?: string;
}

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  rating?: number;
  photos?: google.maps.places.PlacePhoto[];
}

export class GoogleMapsAPIService {
  private loader: Loader | null = null;
  private isLoaded = false;
  private loadPromise: Promise<typeof google> | null = null;

  private readonly config: GoogleMapsConfig = {
    apiKey: 'AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A',
    version: 'weekly',
    libraries: ['places'],
    region: 'IT',
    language: 'it'
  };

  /**
   * Load Google Maps API through APIClient with caching and error handling
   */
  async loadMapsAPI(): Promise<typeof google> {
    const response = await apiClient.request(
      async () => {
        if (this.isLoaded && window.google?.maps?.places) {
          devLog.info('✅ Google Maps API already loaded');
          return window.google;
        }

        if (!this.loadPromise) {
          devLog.info('🔧 Initializing Google Maps Loader...');
          this.loader = new Loader({
            ...this.config,
            libraries: this.config.libraries as any
          });
          this.loadPromise = this.loader.load();
        }

        devLog.info('⏳ Loading Google Maps API...');
        const google = await this.loadPromise;

        // Verify the API loaded correctly
        if (!window.google?.maps?.places?.Autocomplete) {
          throw {
            type: APIErrorType.INVALID_RESPONSE,
            message: 'Google Places API not available after load',
            retryable: true
          };
        }

        this.isLoaded = true;
        devLog.info('✅ Google Maps API loaded successfully with Places library');
        return google;
      },
      {
        retryCount: 3,
        timeout: 10000,
        cache: true,
        cacheTTL: 3600000, // 1 hour
        priority: 'high',
        corsMode: 'cors'
      } as RequestConfig,
      'google-maps-api-load'
    );

    if (response.success) {
      return response.data;
    } else {
      throw response.error || new Error('Failed to load Google Maps API');
    }
  }

  /**
   * Search for places using Google Places API through APIClient
   */
  async searchPlaces(request: PlaceSearchRequest): Promise<PlaceSearchResult[]> {
    const cacheKey = `places-search-${JSON.stringify(request)}`;
    
    const response = await apiClient.request(
      async () => {
        // Ensure Maps API is loaded
        const google = await this.loadMapsAPI();
        
        if (!google.maps.places.PlacesService) {
          throw {
            type: APIErrorType.API_TIMEOUT,
            message: 'Places service not available',
            retryable: true
          };
        }

        return new Promise<PlaceSearchResult[]>((resolve, reject) => {
          // Create a temporary map for PlacesService
          const tempDiv = document.createElement('div');
          const tempMap = new google.maps.Map(tempDiv);
          const service = new google.maps.places.PlacesService(tempMap);

          const searchRequest: google.maps.places.TextSearchRequest = {
            query: request.query,
            location: request.location,
            radius: request.radius || 5000,
            type: request.type as any
          };

          service.textSearch(searchRequest, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              const transformedResults: PlaceSearchResult[] = results.map(place => ({
                place_id: place.place_id!,
                name: place.name!,
                formatted_address: place.formatted_address!,
                geometry: {
                  location: {
                    lat: place.geometry!.location!.lat(),
                    lng: place.geometry!.location!.lng()
                  }
                },
                rating: place.rating,
                photos: place.photos
              }));
              
              resolve(transformedResults);
            } else {
              reject({
                type: APIErrorType.API_TIMEOUT,
                message: `Places search failed: ${status}`,
                retryable: status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS
              });
            }
          });
        });
      },
      {
        retryCount: 2,
        timeout: 8000,
        cache: true,
        cacheTTL: 600000, // 10 minutes
        priority: 'medium'
      } as RequestConfig,
      cacheKey
    );

    if (response.success) {
      return response.data;
    } else {
      throw response.error || new Error('Failed to search places');
    }
  }

  /**
   * Get place details by place_id
   */
  async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    const cacheKey = `place-details-${placeId}`;
    
    const response = await apiClient.request(
      async () => {
        const google = await this.loadMapsAPI();
        
        return new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
          const tempDiv = document.createElement('div');
          const tempMap = new google.maps.Map(tempDiv);
          const service = new google.maps.places.PlacesService(tempMap);

          service.getDetails(
            {
              placeId,
              fields: ['name', 'formatted_address', 'geometry', 'rating', 'photos', 'opening_hours', 'formatted_phone_number', 'website']
            },
            (place, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                resolve(place);
              } else {
                reject({
                  type: APIErrorType.API_TIMEOUT,
                  message: `Place details fetch failed: ${status}`,
                  retryable: status !== google.maps.places.PlacesServiceStatus.NOT_FOUND
                });
              }
            }
          );
        });
      },
      {
        retryCount: 2,
        timeout: 6000,
        cache: true,
        cacheTTL: 1800000, // 30 minutes
        priority: 'medium'
      } as RequestConfig,
      cacheKey
    );

    if (response.success) {
      return response.data;
    } else {
      throw response.error || new Error('Failed to get place details');
    }
  }

  /**
   * Geocode an address
   */
  async geocodeAddress(address: string): Promise<google.maps.GeocoderResult[]> {
    const cacheKey = `geocode-${address}`;
    
    const response = await apiClient.request(
      async () => {
        const google = await this.loadMapsAPI();
        
        return new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          const geocoder = new google.maps.Geocoder();
          
          geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              resolve(results);
            } else {
              reject({
                type: APIErrorType.API_TIMEOUT,
                message: `Geocoding failed: ${status}`,
                retryable: status !== google.maps.GeocoderStatus.ZERO_RESULTS
              });
            }
          });
        });
      },
      {
        retryCount: 2,
        timeout: 5000,
        cache: true,
        cacheTTL: 1800000, // 30 minutes
        priority: 'low'
      } as RequestConfig,
      cacheKey
    );

    if (response.success) {
      return response.data;
    } else {
      throw response.error || new Error('Failed to geocode address');
    }
  }

  /**
   * Get health status of Google Maps API
   */
  getHealthStatus() {
    return {
      isLoaded: this.isLoaded,
      hasPlacesLibrary: !!window.google?.maps?.places,
      hasGeocoder: !!window.google?.maps?.Geocoder,
      apiKeyConfigured: !!this.config.apiKey
    };
  }

  /**
   * Clear any cached data
   */
  clearCache() {
    apiClient.clearCache();
  }
}

// Export singleton instance
export const googleMapsApiService = new GoogleMapsAPIService();