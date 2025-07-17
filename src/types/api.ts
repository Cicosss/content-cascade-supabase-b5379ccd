export enum APIErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_TIMEOUT = 'API_TIMEOUT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR'
}

export interface APIError {
  type: APIErrorType;
  message: string;
  code?: string;
  details?: any;
  retryable: boolean;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  error?: APIError;
  cached?: boolean;
  timestamp: number;
}

export interface RequestConfig {
  retryCount?: number;
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface APIMetrics {
  endpoint: string;
  responseTime: number;
  success: boolean;
  cached: boolean;
  retryCount: number;
  timestamp: number;
}