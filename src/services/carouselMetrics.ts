import { CarouselMetrics, CarouselError } from '@/types/carousel';

export class CarouselMetricsService {
  private metricsHistory: Map<string, CarouselMetrics[]> = new Map();
  private errorHistory: Map<string, CarouselError[]> = new Map();
  private maxHistorySize = 100;

  /**
   * Record carousel performance metrics
   */
  recordMetrics(metrics: CarouselMetrics): void {
    const history = this.metricsHistory.get(metrics.carousel_type) || [];
    history.push(metrics);
    
    // Keep only recent history
    if (history.length > this.maxHistorySize) {
      history.splice(0, history.length - this.maxHistorySize);
    }
    
    this.metricsHistory.set(metrics.carousel_type, history);
    
    // Log significant performance issues
    if (metrics.response_time > 5000) {
      console.warn(`🐌 Slow carousel ${metrics.carousel_type}: ${metrics.response_time}ms`);
    }
    
    if (metrics.error_rate > 0.1) {
      console.warn(`❌ High error rate for ${metrics.carousel_type}: ${(metrics.error_rate * 100).toFixed(1)}%`);
    }
  }

  /**
   * Record carousel errors
   */
  recordError(error: CarouselError): void {
    const history = this.errorHistory.get(error.carousel_type) || [];
    history.push(error);
    
    // Keep only recent history
    if (history.length > this.maxHistorySize) {
      history.splice(0, history.length - this.maxHistorySize);
    }
    
    this.errorHistory.set(error.carousel_type, history);
    
    // Alert for critical errors
    if (error.type === 'permission' || error.type === 'rate_limit') {
      console.error(`🚨 Critical carousel error [${error.carousel_type}]:`, error);
    }
  }

  /**
   * Get performance summary for all carousels
   */
  getPerformanceSummary(): Record<string, {
    avgResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
    totalRequests: number;
    recentErrors: CarouselError[];
  }> {
    const summary: Record<string, any> = {};
    
    for (const [type, metrics] of this.metricsHistory) {
      const recent = metrics.slice(-20); // Last 20 requests
      const errors = this.errorHistory.get(type) || [];
      const recentErrors = errors.filter(e => Date.now() - e.timestamp < 300000); // Last 5 minutes
      
      summary[type] = {
        avgResponseTime: recent.reduce((sum, m) => sum + m.response_time, 0) / recent.length || 0,
        errorRate: recent.reduce((sum, m) => sum + m.error_rate, 0) / recent.length || 0,
        cacheHitRate: recent.reduce((sum, m) => sum + m.cache_hit_rate, 0) / recent.length || 0,
        totalRequests: recent.length,
        recentErrors: recentErrors.slice(-5) // Last 5 errors
      };
    }
    
    return summary;
  }

  /**
   * Get health status for monitoring dashboard
   */
  getHealthStatus(): {
    overall: 'healthy' | 'degraded' | 'critical';
    carousels: Record<string, {
      status: 'healthy' | 'degraded' | 'critical';
      issues: string[];
    }>;
  } {
    const summary = this.getPerformanceSummary();
    const carouselHealth: Record<string, any> = {};
    let overallIssues = 0;
    
    for (const [type, stats] of Object.entries(summary)) {
      const issues: string[] = [];
      let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
      
      if (stats.avgResponseTime > 5000) {
        issues.push('Tempi di risposta elevati');
        status = 'degraded';
      }
      
      if (stats.errorRate > 0.1) {
        issues.push('Alto tasso di errori');
        status = stats.errorRate > 0.3 ? 'critical' : 'degraded';
      }
      
      if (stats.cacheHitRate < 0.3) {
        issues.push('Basso hit rate cache');
        status = 'degraded';
      }
      
      if (stats.recentErrors.length > 3) {
        issues.push('Errori frequenti');
        status = 'critical';
      }
      
      carouselHealth[type] = { status, issues };
      
      if (status === 'critical') overallIssues += 2;
      else if (status === 'degraded') overallIssues += 1;
    }
    
    const overall = overallIssues === 0 ? 'healthy' : 
                    overallIssues < 3 ? 'degraded' : 'critical';
    
    return {
      overall,
      carousels: carouselHealth
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const summary = this.getPerformanceSummary();
    const health = this.getHealthStatus();
    
    let report = `📊 Carousel Performance Report\n`;
    report += `Stato generale: ${health.overall.toUpperCase()}\n\n`;
    
    for (const [type, stats] of Object.entries(summary)) {
      const status = health.carousels[type]?.status || 'unknown';
      report += `${type.toUpperCase()} (${status}):\n`;
      report += `  • Tempo medio: ${stats.avgResponseTime.toFixed(0)}ms\n`;
      report += `  • Tasso errori: ${(stats.errorRate * 100).toFixed(1)}%\n`;
      report += `  • Cache hit: ${(stats.cacheHitRate * 100).toFixed(1)}%\n`;
      report += `  • Richieste: ${stats.totalRequests}\n`;
      
      if (health.carousels[type]?.issues.length > 0) {
        report += `  ⚠️ Problemi: ${health.carousels[type].issues.join(', ')}\n`;
      }
      report += '\n';
    }
    
    return report;
  }

  /**
   * Clear old metrics data
   */
  cleanup(maxAge: number = 3600000): void { // Default 1 hour
    const cutoff = Date.now() - maxAge;
    
    for (const [type, errors] of this.errorHistory) {
      const filtered = errors.filter(e => e.timestamp > cutoff);
      this.errorHistory.set(type, filtered);
    }
    
    console.log('🧹 Carousel metrics cleanup completed');
  }
}

export const carouselMetrics = new CarouselMetricsService();
