import { supabase } from '@/integrations/supabase/client';
import { APIError, APIErrorType, APIResponse, RequestConfig, APIMetrics } from '@/types/api';

class APIClient {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private requestQueue = new Map<string, Promise<any>>();
  private metricsData = new Map<string, APIMetrics>();
  private circuitBreaker = new Map<string, { failures: number; lastFailure: number; isOpen: boolean }>();
  private activeRequests = new Set<string>();

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
      cacheTTL = 300000, // 5 minutes
      priority = 'medium'
    } = config;

    // Check cache first
    if (cache && cacheKey && this.getCachedData(cacheKey)) {
      const cached = this.getCachedData(cacheKey);
      this.recordMetrics(cacheKey, startTime, true, true, 0);
      return {
        data: cached,
        success: true,
        cached: true,
        timestamp: Date.now()
      };
    }

    // Check circuit breaker
    if (cacheKey && this.isCircuitOpen(cacheKey)) {
      throw this.createError(APIErrorType.SERVER_ERROR, 'Service temporarily unavailable', true);
    }

    // Deduplicate identical requests
    if (cacheKey && this.requestQueue.has(cacheKey)) {
      const result = await this.requestQueue.get(cacheKey)!;
      return result;
    }

    const requestPromise = this.executeWithRetry(operation, retryCount, timeout);
    
    if (cacheKey) {
      this.requestQueue.set(cacheKey, requestPromise);
    }

    try {
      const result = await requestPromise;
      
      // Cache successful result
      if (cache && cacheKey) {
        this.setCachedData(cacheKey, result, cacheTTL);
      }

      // Reset circuit breaker on success
      if (cacheKey) {
        this.resetCircuitBreaker(cacheKey);
      }

      this.recordMetrics(cacheKey || 'unknown', startTime, true, false, retryCount);

      return {
        data: result,
        success: true,
        cached: false,
        timestamp: Date.now()
      };

    } catch (error) {
      // Update circuit breaker on failure
      if (cacheKey) {
        this.updateCircuitBreaker(cacheKey);
      }

      this.recordMetrics(cacheKey || 'unknown', startTime, false, false, retryCount);

      // Try to return cached data as fallback
      if (cache && cacheKey) {
        const cached = this.getCachedData(cacheKey, true); // Allow stale
        if (cached) {
          console.warn('Using stale cached data due to API error:', error);
          return {
            data: cached,
            success: true,
            cached: true,
            timestamp: Date.now()
          };
        }
      }

      throw this.normalizeError(error);
    } finally {
      if (cacheKey) {
        this.requestQueue.delete(cacheKey);
      }
    }
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number,
    timeout: number
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        return await Promise.race([operation(), timeoutPromise]);
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries && this.isRetryableError(error)) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await this.sleep(delay);
          continue;
        }
        
        break;
      }
    }

    throw lastError;
  }

  private getCachedData(key: string, allowStale = false): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired && !allowStale) return null;

    return cached.data;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private isCircuitOpen(key: string): boolean {
    const breaker = this.circuitBreaker.get(key);
    if (!breaker) return false;

    // Reset circuit breaker after 60 seconds
    if (breaker.isOpen && Date.now() - breaker.lastFailure > 60000) {
      breaker.isOpen = false;
      breaker.failures = 0;
    }

    return breaker.isOpen;
  }

  private updateCircuitBreaker(key: string): void {
    const breaker = this.circuitBreaker.get(key) || { failures: 0, lastFailure: 0, isOpen: false };
    breaker.failures++;
    breaker.lastFailure = Date.now();
    
    // Open circuit after 5 failures
    if (breaker.failures >= 5) {
      breaker.isOpen = true;
    }

    this.circuitBreaker.set(key, breaker);
  }

  private resetCircuitBreaker(key: string): void {
    this.circuitBreaker.delete(key);
  }

  // Initialize metrics object for new endpoints
  private initializeMetrics(endpoint: string): void {
    if (!this.metricsData.has(endpoint)) {
      this.metricsData.set(endpoint, {
        endpoint,
        totalRequests: 0,
        successCount: 0,
        failureCount: 0,
        averageResponseTime: 0,
        lastRequestTime: Date.now(),
        cached: 0,
        retries: 0,
        totalPayloadSize: 0,
        errorTypes: {} as Record<APIErrorType, number>
      });
    }
  }

  private recordMetrics(endpoint: string, startTime: number, success: boolean, cached: boolean, retryCount: number, payloadSize = 0): void {
    this.initializeMetrics(endpoint);
    const metrics = this.metricsData.get(endpoint)!;
    
    const responseTime = Date.now() - startTime;
    
    metrics.totalRequests++;
    metrics.lastRequestTime = Date.now();
    metrics.totalPayloadSize += payloadSize;
    metrics.retries += retryCount;
    
    if (success) {
      metrics.successCount++;
    } else {
      metrics.failureCount++;
    }
    
    if (cached) {
      metrics.cached++;
    }
    
    // Update average response time
    metrics.averageResponseTime = 
      (metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime) / metrics.totalRequests;
  }

  private isRetryableError(error: any): boolean {
    if (error?.message?.includes('timeout')) return true;
    if (error?.code === 'PGRST301') return true; // Temporary Supabase issues
    if (error?.status >= 500) return true;
    return false;
  }

  private normalizeError(error: any): APIError {
    if (error?.message?.includes('timeout')) {
      return this.createError(APIErrorType.API_TIMEOUT, 'Request timed out', true);
    }
    
    if (error?.code === 'PGRST116') {
      return this.createError(APIErrorType.INVALID_RESPONSE, 'Invalid response format', false);
    }

    if (error?.status === 401) {
      return this.createError(APIErrorType.AUTHENTICATION_ERROR, 'Authentication failed', false);
    }

    if (error?.status === 429) {
      return this.createError(APIErrorType.RATE_LIMIT, 'Rate limit exceeded', true);
    }

    if (error?.status >= 500) {
      return this.createError(APIErrorType.SERVER_ERROR, 'Server error', true);
    }

    return this.createError(APIErrorType.NETWORK_ERROR, error?.message || 'Unknown error', true);
  }

  private createError(type: APIErrorType, message: string, retryable: boolean): APIError {
    return {
      type,
      message,
      retryable
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getMetrics(): APIMetrics[] {
    return Array.from(this.metricsData.values());
  }

  clearCache(): void {
    this.cache.clear();
    this.metricsData.clear();
  }

  getHealthStatus() {
    const allMetrics = Array.from(this.metricsData.values());
    const recentMetrics = allMetrics.filter(m => Date.now() - m.lastRequestTime < 300000); // Last 5 minutes
    
    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        cacheHitRate: 0,
        circuitBreakersOpen: 0,
        endpoints: []
      };
    }

    const totalRequests = recentMetrics.reduce((sum, m) => sum + m.totalRequests, 0);
    const totalSuccess = recentMetrics.reduce((sum, m) => sum + m.successCount, 0);
    const totalCached = recentMetrics.reduce((sum, m) => sum + m.cached, 0);
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / recentMetrics.length;

    return {
      totalRequests,
      successRate: totalSuccess / totalRequests || 0,
      avgResponseTime,
      cacheHitRate: totalCached / totalRequests || 0,
      circuitBreakersOpen: Array.from(this.circuitBreaker.values()).filter(b => b.isOpen).length,
      endpoints: recentMetrics.map(m => ({
        endpoint: m.endpoint,
        status: this.getEndpointHealth(m),
        responseTime: m.averageResponseTime,
        errorRate: m.failureCount / m.totalRequests || 0,
        circuitBreakerOpen: this.isCircuitOpen(m.endpoint)
      }))
    };
  }

  private getEndpointHealth(metrics: APIMetrics): 'healthy' | 'degraded' | 'unhealthy' {
    const errorRate = metrics.failureCount / metrics.totalRequests || 0;
    const isRecentlyActive = Date.now() - metrics.lastRequestTime < 60000; // Last minute
    
    if (!isRecentlyActive || this.isCircuitOpen(metrics.endpoint)) {
      return 'unhealthy';
    }
    
    if (errorRate > 0.1 || metrics.averageResponseTime > 5000) {
      return 'degraded';
    }
    
    return 'healthy';
  }
}

export const apiClient = new APIClient();
