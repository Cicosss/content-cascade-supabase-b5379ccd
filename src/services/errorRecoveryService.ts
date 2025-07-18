
import { errorLogger } from './errorLogger';
import { APIError, APIErrorType } from '@/types/api';

export interface RecoveryStrategy {
  id: string;
  name: string;
  canHandle: (error: APIError) => boolean;
  recover: (error: APIError, context?: any) => Promise<any>;
  maxRetries: number;
  backoffMultiplier: number;
}

export interface NetworkHealthStatus {
  isOnline: boolean;
  lastCheck: number;
  consecutiveFailures: number;
  estimatedLatency: number;
}

class ErrorRecoveryService {
  private strategies: Map<string, RecoveryStrategy> = new Map();
  private retryCounters = new Map<string, number>();
  private networkHealth: NetworkHealthStatus = {
    isOnline: navigator.onLine,
    lastCheck: Date.now(),
    consecutiveFailures: 0,
    estimatedLatency: 0
  };
  private circuitBreakers = new Map<string, { isOpen: boolean; openUntil: number }>();

  constructor() {
    this.initializeStrategies();
    this.initializeNetworkMonitoring();
  }

  private initializeStrategies() {
    // Strategia per errori di rete
    this.registerStrategy({
      id: 'network-retry',
      name: 'Network Retry Strategy',
      canHandle: (error) => [
        APIErrorType.NETWORK_ERROR,
        APIErrorType.API_TIMEOUT,
        APIErrorType.CORS_ERROR
      ].includes(error.type),
      recover: async (error, context) => {
        if (!this.networkHealth.isOnline) {
          throw new Error('Network offline, waiting for connection');
        }
        
        // Exponential backoff
        const retryCount = this.getRetryCount(error.endpoint || 'unknown');
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        
        await this.sleep(delay);
        return context?.originalRequest?.();
      },
      maxRetries: 3,
      backoffMultiplier: 2
    });

    // Strategia per rate limiting
    this.registerStrategy({
      id: 'rate-limit-backoff',
      name: 'Rate Limit Backoff',
      canHandle: (error) => error.type === APIErrorType.RATE_LIMIT,
      recover: async (error) => {
        // Estrai retry-after header se disponibile
        const retryAfter = error.details?.retryAfter || 60;
        await this.sleep(retryAfter * 1000);
        return true;
      },
      maxRetries: 2,
      backoffMultiplier: 1
    });

    // Strategia per errori di autenticazione
    this.registerStrategy({
      id: 'auth-refresh',
      name: 'Authentication Refresh',
      canHandle: (error) => error.type === APIErrorType.AUTHENTICATION_ERROR,
      recover: async (error, context) => {
        // Tenta refresh del token
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) throw refreshError;
          
          // Rilancia la richiesta originale
          return context?.originalRequest?.();
        } catch (refreshError) {
          // Se refresh fallisce, redirect al login
          window.location.href = '/auth';
          throw refreshError;
        }
      },
      maxRetries: 1,
      backoffMultiplier: 1
    });

    // Strategia fallback generica
    this.registerStrategy({
      id: 'generic-fallback',
      name: 'Generic Fallback',
      canHandle: () => true, // Catch-all
      recover: async (error, context) => {
        console.warn('Using generic fallback for error:', error);
        
        // Tenta cache stale se disponibile
        if (context?.cacheKey) {
          const staleData = this.getStaleCache(context.cacheKey);
          if (staleData) {
            console.log('Returning stale cached data as fallback');
            return staleData;
          }
        }
        
        // Altrimenti ritorna empty state
        return context?.emptyState || null;
      },
      maxRetries: 1,
      backoffMultiplier: 1
    });
  }

  private initializeNetworkMonitoring() {
    // Online/offline events
    window.addEventListener('online', () => {
      this.networkHealth.isOnline = true;
      this.networkHealth.consecutiveFailures = 0;
      console.log('🟢 Network connection restored');
    });

    window.addEventListener('offline', () => {
      this.networkHealth.isOnline = false;
      console.log('🔴 Network connection lost');
    });

    // Periodic network health check
    setInterval(() => {
      this.checkNetworkHealth();
    }, 30000); // Check every 30 seconds
  }

  private async checkNetworkHealth() {
    const start = Date.now();
    
    try {
      // Ping per verificare latenza
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        this.networkHealth.estimatedLatency = Date.now() - start;
        this.networkHealth.consecutiveFailures = 0;
      } else {
        this.networkHealth.consecutiveFailures++;
      }
    } catch (error) {
      this.networkHealth.consecutiveFailures++;
      console.warn('Network health check failed:', error);
    }
    
    this.networkHealth.lastCheck = Date.now();
  }

  registerStrategy(strategy: RecoveryStrategy) {
    this.strategies.set(strategy.id, strategy);
  }

  async recover<T>(error: APIError, context?: any): Promise<T | null> {
    const endpoint = error.endpoint || 'unknown';
    
    // Controlla circuit breaker
    if (this.isCircuitOpen(endpoint)) {
      console.log(`Circuit breaker open for ${endpoint}, skipping recovery`);
      throw error;
    }

    // Log tentativo di recovery
    errorLogger.logError({
      ...error,
      message: `Recovery attempt for: ${error.message}`
    });

    // Trova strategia appropriata
    const strategy = this.findStrategy(error);
    if (!strategy) {
      console.warn('No recovery strategy found for error:', error);
      throw error;
    }

    const retryKey = `${strategy.id}-${endpoint}`;
    const currentRetries = this.getRetryCount(retryKey);

    if (currentRetries >= strategy.maxRetries) {
      console.log(`Max retries exceeded for ${retryKey}`);
      this.openCircuitBreaker(endpoint);
      throw error;
    }

    try {
      console.log(`Attempting recovery with strategy: ${strategy.name}`);
      const result = await strategy.recover(error, context);
      
      // Reset retry counter on success
      this.retryCounters.delete(retryKey);
      this.closeCircuitBreaker(endpoint);
      
      return result;
    } catch (recoveryError) {
      this.incrementRetryCount(retryKey);
      
      if (currentRetries + 1 >= strategy.maxRetries) {
        this.openCircuitBreaker(endpoint);
      }
      
      throw recoveryError;
    }
  }

  private findStrategy(error: APIError): RecoveryStrategy | null {
    // Ordina per priorità (specifiche prima, generiche dopo)
    const strategiesArray = Array.from(this.strategies.values())
      .filter(s => s.canHandle(error))
      .sort((a, b) => {
        if (a.id === 'generic-fallback') return 1;
        if (b.id === 'generic-fallback') return -1;
        return 0;
      });
    
    return strategiesArray[0] || null;
  }

  private getRetryCount(key: string): number {
    return this.retryCounters.get(key) || 0;
  }

  private incrementRetryCount(key: string): void {
    this.retryCounters.set(key, this.getRetryCount(key) + 1);
  }

  private isCircuitOpen(endpoint: string): boolean {
    const breaker = this.circuitBreakers.get(endpoint);
    if (!breaker) return false;
    
    if (breaker.isOpen && Date.now() > breaker.openUntil) {
      // Circuit breaker timeout expired, close it
      this.closeCircuitBreaker(endpoint);
      return false;
    }
    
    return breaker.isOpen;
  }

  private openCircuitBreaker(endpoint: string): void {
    const openDuration = 60000; // 1 minuto
    this.circuitBreakers.set(endpoint, {
      isOpen: true,
      openUntil: Date.now() + openDuration
    });
    console.warn(`🔴 Circuit breaker opened for ${endpoint}`);
  }

  private closeCircuitBreaker(endpoint: string): void {
    this.circuitBreakers.delete(endpoint);
    console.log(`🟢 Circuit breaker closed for ${endpoint}`);
  }

  private getStaleCache(cacheKey: string): any {
    try {
      const cached = localStorage.getItem(`stale-${cacheKey}`);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getNetworkHealth(): NetworkHealthStatus {
    return { ...this.networkHealth };
  }

  getRecoveryStats() {
    return {
      activeRetries: this.retryCounters.size,
      openCircuitBreakers: Array.from(this.circuitBreakers.entries())
        .filter(([_, breaker]) => breaker.isOpen)
        .map(([endpoint]) => endpoint),
      networkHealth: this.networkHealth,
      availableStrategies: this.strategies.size
    };
  }
}

export const errorRecoveryService = new ErrorRecoveryService();
