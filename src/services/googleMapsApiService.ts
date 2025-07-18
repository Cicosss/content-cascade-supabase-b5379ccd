import { Loader } from '@googlemaps/js-api-loader';
import { apiClient } from './apiClient';
import { APIErrorType, RequestConfig } from '@/types/api';
import { devLog } from '@/utils/devLogger';
import { fallbackMapService } from './fallbackMapService';
import { supabase } from '@/integrations/supabase/client';

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
  private fallbackMode = false;
  private circuitBreakerState = {
    failures: 0,
    lastFailureTime: 0,
    threshold: 3,
    resetTimeout: 60000 // 1 minuto
  };

  private readonly config: GoogleMapsConfig = {
    apiKey: '', // Verrà caricata dall'edge function
    version: 'weekly',
    libraries: ['places'],
    region: 'IT',
    language: 'it'
  };

  /**
   * Verifica se il circuit breaker è aperto
   */
  private isCircuitOpen(): boolean {
    if (this.circuitBreakerState.failures < this.circuitBreakerState.threshold) {
      return false;
    }
    
    const timeSinceFailure = Date.now() - this.circuitBreakerState.lastFailureTime;
    return timeSinceFailure < this.circuitBreakerState.resetTimeout;
  }

  /**
   * Registra un fallimento del circuit breaker
   */
  private recordFailure(): void {
    this.circuitBreakerState.failures++;
    this.circuitBreakerState.lastFailureTime = Date.now();
    devLog.warn('⚠️ Google Maps API failure recorded', this.circuitBreakerState);
  }

  /**
   * Resetta il circuit breaker dopo un successo
   */
  private recordSuccess(): void {
    this.circuitBreakerState.failures = 0;
    devLog.info('✅ Google Maps API circuit breaker reset');
  }

  /**
   * Load Google Maps API with fallback strategy
   */
  async loadMapsAPI(): Promise<typeof google> {
    // Verifica circuit breaker
    if (this.isCircuitOpen()) {
      devLog.warn('🚨 Google Maps API circuit breaker is open, using fallback');
      this.fallbackMode = true;
      throw new Error('Google Maps API temporarily unavailable - using fallback');
    }

    try {
      // Prima prova a caricare tramite edge function sicura
      const edgeFunctionResult = await this.loadViaEdgeFunction();
      if (edgeFunctionResult) {
        this.recordSuccess();
        return edgeFunctionResult;
      }
    } catch (error) {
      devLog.warn('⚠️ Edge function failed, trying direct load:', error);
    }

    // Fallback a caricamento diretto
    const response = await apiClient.request(
      async () => {
        if (this.isLoaded && window.google?.maps?.places) {
          devLog.info('✅ Google Maps API already loaded');
          return window.google;
        }

        // Ottieni API key dall'edge function o usa fallback
        const apiKey = await this.getSecureApiKey();
        if (!apiKey) {
          throw new Error('Google Maps API key not available');
        }

        if (!this.loadPromise) {
          devLog.info('🔧 Initializing Google Maps Loader...');
          this.loader = new Loader({
            ...this.config,
            apiKey,
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
        timeout: 15000, // Aumentato timeout
        cache: true,
        cacheTTL: 3600000, // 1 hour
        priority: 'high',
        corsMode: 'cors'
      } as RequestConfig,
      'google-maps-api-load'
    );

    if (response.success) {
      this.recordSuccess();
      return response.data;
    } else {
      this.recordFailure();
      this.fallbackMode = true;
      throw response.error || new Error('Failed to load Google Maps API');
    }
  }

  /**
   * Carica l'API tramite edge function sicura
   */
  private async loadViaEdgeFunction(): Promise<typeof google | null> {
    try {
      devLog.info('🔐 Loading Google Maps via secure edge function...');
      
      const { data, error } = await supabase.functions.invoke('maps-proxy', {
        body: {
          action: 'loadScript',
          params: {
            libraries: this.config.libraries.join(','),
            version: this.config.version
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        // Inserisce lo script nel DOM
        const script = document.createElement('script');
        script.src = data.data.scriptUrl;
        script.async = true;
        script.defer = true;
        
        return new Promise((resolve, reject) => {
          script.onload = () => {
            if (window.google?.maps?.places) {
              this.isLoaded = true;
              resolve(window.google);
            } else {
              reject(new Error('Google Maps not properly loaded'));
            }
          };
          script.onerror = () => reject(new Error('Failed to load Google Maps script'));
          document.head.appendChild(script);
        });
      }
      
      throw new Error('Edge function returned error');
    } catch (error) {
      devLog.error('❌ Edge function load failed:', error);
      return null;
    }
  }

  /**
   * Ottieni API key in modo sicuro
   */
  private async getSecureApiKey(): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('maps-proxy', {
        body: { action: 'getApiKey' }
      });

      if (error || !data.success) {
        devLog.warn('⚠️ Cannot get secure API key, using environment fallback');
        return null;
      }

      return data.apiKey;
    } catch (error) {
      devLog.error('❌ Secure API key fetch failed:', error);
      return null;
    }
  }

  /**
   * Search for places with fallback strategy
   */
  async searchPlaces(request: PlaceSearchRequest): Promise<PlaceSearchResult[]> {
    if (this.fallbackMode || this.isCircuitOpen()) {
      return this.searchPlacesWithFallback(request);
    }

    const cacheKey = `places-search-${JSON.stringify(request)}`;
    
    try {
      const response = await apiClient.request(
        async () => {
          // Prova prima tramite edge function
          try {
            const { data, error } = await supabase.functions.invoke('maps-proxy', {
              body: {
                action: 'placesSearch',
                params: {
                  query: request.query,
                  location: request.location,
                  radius: request.radius || 5000
                }
              }
            });

            if (error) throw error;
            if (data.success) return data.data.results || [];
          } catch (edgeError) {
            devLog.warn('⚠️ Edge function search failed, trying direct API');
          }

          // Fallback a Google Maps diretto
          const google = await this.loadMapsAPI();
          
          if (!google.maps.places.PlacesService) {
            throw new Error('Places service not available');
          }

          return new Promise<PlaceSearchResult[]>((resolve, reject) => {
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
                reject(new Error(`Places search failed: ${status}`));
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
        this.recordSuccess();
        return response.data;
      } else {
        throw response.error || new Error('Failed to search places');
      }
    } catch (error) {
      this.recordFailure();
      return this.searchPlacesWithFallback(request);
    }
  }

  /**
   * Search places with OpenStreetMap fallback
   */
  private async searchPlacesWithFallback(request: PlaceSearchRequest): Promise<PlaceSearchResult[]> {
    try {
      devLog.info('🗺️ Using OpenStreetMap fallback for places search');
      const result = await fallbackMapService.geocodeWithOpenStreetMap(request.query);
      return result.results || [];
    } catch (error) {
      devLog.error('❌ All place search methods failed:', error);
      return [];
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