import { APIError, APIErrorType } from '@/types/api';

export interface ErrorLogEntry {
  id: string;
  timestamp: number;
  error: APIError;
  context: {
    endpoint?: string;
    userId?: string;
    userAgent: string;
    url: string;
    sessionId: string;
  };
  stackTrace?: string;
  resolved: boolean;
}

export class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 1000;
  private sessionId = this.generateSessionId();

  /**
   * Log an API error with full context
   */
  logError(error: APIError, additionalContext?: Record<string, any>): void {
    const logEntry: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      error,
      context: {
        endpoint: error.endpoint,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.sessionId,
        ...additionalContext
      },
      stackTrace: error.details?.stack,
      resolved: false
    };

    this.logs.unshift(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console logging with appropriate level
    this.consoleLog(logEntry);

    // Try to send critical errors to analytics
    if (this.isCriticalError(error)) {
      this.sendCriticalErrorReport(logEntry);
    }
  }

  /**
   * Get error statistics for monitoring
   */
  getErrorStats(): {
    total: number;
    byType: Record<APIErrorType, number>;
    byEndpoint: Record<string, number>;
    recentErrors: ErrorLogEntry[];
    criticalErrors: number;
  } {
    const byType: Record<APIErrorType, number> = {} as any;
    const byEndpoint: Record<string, number> = {};
    let criticalErrors = 0;

    this.logs.forEach(log => {
      byType[log.error.type] = (byType[log.error.type] || 0) + 1;
      
      if (log.error.endpoint) {
        byEndpoint[log.error.endpoint] = (byEndpoint[log.error.endpoint] || 0) + 1;
      }

      if (this.isCriticalError(log.error)) {
        criticalErrors++;
      }
    });

    return {
      total: this.logs.length,
      byType,
      byEndpoint,
      recentErrors: this.logs.slice(0, 10),
      criticalErrors
    };
  }

  /**
   * Get filtered errors by criteria
   */
  getFilteredErrors(filter: {
    type?: APIErrorType;
    endpoint?: string;
    since?: number;
    resolved?: boolean;
  }): ErrorLogEntry[] {
    return this.logs.filter(log => {
      if (filter.type && log.error.type !== filter.type) return false;
      if (filter.endpoint && log.error.endpoint !== filter.endpoint) return false;
      if (filter.since && log.timestamp < filter.since) return false;
      if (filter.resolved !== undefined && log.resolved !== filter.resolved) return false;
      return true;
    });
  }

  /**
   * Mark an error as resolved
   */
  markErrorResolved(errorId: string): void {
    const log = this.logs.find(l => l.id === errorId);
    if (log) {
      log.resolved = true;
    }
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs for analysis
   */
  exportLogs(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      exportTime: new Date().toISOString(),
      logs: this.logs
    }, null, 2);
  }

  private consoleLog(logEntry: ErrorLogEntry): void {
    const { error } = logEntry;
    const prefix = `[${error.type}] ${error.endpoint || 'Unknown'}:`;

    switch (error.type) {
      case APIErrorType.NETWORK_ERROR:
      case APIErrorType.API_TIMEOUT:
      case APIErrorType.SERVER_ERROR:
        console.error(prefix, error.message, error.details);
        break;
      case APIErrorType.AUTHENTICATION_ERROR:
      case APIErrorType.VALIDATION_ERROR:
        console.warn(prefix, error.message, error.details);
        break;
      case APIErrorType.RATE_LIMIT:
      case APIErrorType.CIRCUIT_BREAKER_OPEN:
        console.info(prefix, error.message);
        break;
      default:
        console.log(prefix, error.message, error.details);
    }
  }

  private isCriticalError(error: APIError): boolean {
    return [
      APIErrorType.AUTHENTICATION_ERROR,
      APIErrorType.SERVER_ERROR,
      APIErrorType.CORS_ERROR
    ].includes(error.type);
  }

  private sendCriticalErrorReport(logEntry: ErrorLogEntry): void {
    // In a real app, this would send to an analytics service
    try {
      // Example: Send to Sentry, LogRocket, or custom analytics
      console.warn('🚨 Critical error detected:', logEntry.error.message);
    } catch (e) {
      // Fail silently for error reporting
    }
  }

  private generateId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();
