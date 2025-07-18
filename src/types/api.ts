export enum APIErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CORS_ERROR = 'CORS_ERROR',
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',
  PARSE_ERROR = 'PARSE_ERROR'
}

export interface APIError {
  type: APIErrorType;
  message: string;
  code?: string;
  details?: any;
  retryable: boolean;
  endpoint?: string;
  payloadSize?: number;
  timestamp?: number;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  error?: APIError;
  cached?: boolean;
  timestamp: number;
  payloadSize?: number;
  responseTime?: number;
  retryCount?: number;
}

export interface RequestConfig {
  retryCount?: number;
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
  priority?: 'low' | 'medium' | 'high';
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
  corsMode?: 'cors' | 'no-cors' | 'same-origin';
  deduplicationKey?: string;
  compress?: boolean;
}

export interface APIMetrics {
  endpoint: string;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  averageResponseTime: number;
  lastRequestTime: number;
  cached: number;
  retries: number;
  totalPayloadSize: number;
  errorTypes: Record<APIErrorType, number>;
}

// Weather API Types
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
}

export interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

export interface GeocodingResponse {
  address?: {
    suburb?: string;
    quarter?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
  };
  display_name?: string;
  locality?: string;
  principalSubdivision?: string;
}

// API Health Status
export interface APIHealthStatus {
  endpoint: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: number;
  errorRate: number;
  circuitBreakerOpen: boolean;
}