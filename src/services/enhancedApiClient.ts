
import { supabase } from '@/integrations/supabase/client';
import { APIError, APIErrorType, APIResponse, RequestConfig } from '@/types/api';
import { errorLogger } from './errorLogger';
import { errorRecoveryService } from './errorRecoveryService';

export class EnhancedAPIClient {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private activeRequests = new Map<string, Promise<any>>();

  async request<T>(
    operation: () => Promise<T>,
    config: RequestConfig = {},
    cacheKey?: string
  ): Promise<APIResponse<T>> {
    const startTime = Date.now();
    const {
      retryCount = 3,
      timeout = 10000,
      cache = true,
      cacheTTL = 300000,
      priority = 'medium'
    } = config;

    try {
      // Check cache first
      if (cache && cacheKey && this.getCachedData(cacheKey)) {
        const cached = this.getCachedData(cacheKey);
        return {
          data: cached,
          success: true,
          cached: true,
          timestamp: Date.now()
        };
      }

      // Deduplicate identical requests
      if (cacheKey && this.activeRequests.has(cacheKey)) {
        const result = await this.activeRequests.get(cacheKey)!;
        return result;
      }

      // Execute request with timeout
      const requestPromise = this.executeWithTimeout(operation, timeout);
      
      if (cacheKey) {
        this.activeRequests.set(cacheKey, requestPromise);
      }

      const result = await requestPromise;
      
      // Cache successful result
      if (cache && cacheKey) {
        this.setCachedData(cacheKey, result, cacheTTL);
        this.setStaleCache(cacheKey, result); // Keep for recovery
      }

      return {
        data: result,
        success: true,
        cached: false,
        timestamp: Date.now(),
        responseTime: Date.now() - startTime
      };

    } catch (error) {
      const apiError = this.normalizeError(error);
      
      // Log error
      errorLogger.logError(apiError, {
        cacheKey,
        responseTime: Date.now() - startTime,
        priority
      });

      // Attempt recovery
      try {
        const recovered = await errorRecoveryService.recover(apiError, {
          originalRequest: operation,
          cacheKey,
          emptyState: this.getEmptyState(cacheKey)
        });

        if (recovered !== null) {
          return {
            data: recovered,
            success: true,
            cached: false,
            timestamp: Date.now(),
            recovered: true
          };
        }
      } catch (recoveryError) {
        console.warn('Recovery failed:', recoveryError);
      }

      // Final fallback: return stale cache if available
      if (cache && cacheKey) {
        const stale = this.getStaleCache(cacheKey);
        if (stale) {
          console.warn('Using stale cached data as final fallback');
          return {
            data: stale,
            success: true,
            cached: true,
            stale: true,
            timestamp: Date.now()
          };
        }
      }

      throw apiError;

    } finally {
      if (cacheKey) {
        this.activeRequests.delete(cacheKey);
      }
    }
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });

    return Promise.race([operation(), timeoutPromise]);
  }

  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) return null;

    return cached.data;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getStaleCache(key: string): any {
    try {
      const cached = localStorage.getItem(`stale-${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  }

  private setStaleCache(key: string, data: any): void {
    try {
      localStorage.setItem(`stale-${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to set stale cache:', e);
    }
  }

  private getEmptyState(cacheKey?: string): any {
    const emptyStates: Record<string, any> = {
      'carousel-events': [],
      'carousel-restaurants': [],
      'carousel-experiences': [],
      'poi-data': [],
      'weather': null
    };

    if (cacheKey) {
      const matchingKey = Object.keys(emptyStates).find(key => 
        cacheKey.includes(key)
      );
      if (matchingKey) {
        return emptyStates[matchingKey];
      }
    }

    return null;
  }

  private normalizeError(error: any): APIError {
    if (error?.message?.includes('timeout')) {
      return {
        type: APIErrorType.API_TIMEOUT,
        message: 'Richiesta scaduta - il server impiega troppo tempo a rispondere',
        retryable: true
      };
    }
    
    if (error?.code === 'PGRST116') {
      return {
        type: APIErrorType.INVALID_RESPONSE,
        message: 'Risposta del server non valida',
        retryable: false
      };
    }

    if (error?.status === 401) {
      return {
        type: APIErrorType.AUTHENTICATION_ERROR,
        message: 'Autenticazione richiesta - effettua il login',
        retryable: false
      };
    }

    if (error?.status === 429) {
      return {
        type: APIErrorType.RATE_LIMIT,
        message: 'Troppe richieste - riprova tra qualche secondo',
        retryable: true
      };
    }

    if (error?.status >= 500) {
      return {
        type: APIErrorType.SERVER_ERROR,
        message: 'Errore del server - il nostro team è stato avvisato',
        retryable: true
      };
    }

    return {
      type: APIErrorType.NETWORK_ERROR,
      message: 'Problema di connessione - verifica la tua rete',
      retryable: true
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getHealthStatus() {
    const recoveryStats = errorRecoveryService.getRecoveryStats();
    const networkHealth = errorRecoveryService.getNetworkHealth();
    
    return {
      cacheSize: this.cache.size,
      activeRequests: this.activeRequests.size,
      networkHealth,
      circuitBreakers: recoveryStats.openCircuitBreakers,
      recoveryStrategies: recoveryStats.availableStrategies
    };
  }
}

export const enhancedApiClient = new EnhancedAPIClient();
