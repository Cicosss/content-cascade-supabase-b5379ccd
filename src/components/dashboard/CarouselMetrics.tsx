import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3, RefreshCw, Zap, Clock, TrendingUp } from 'lucide-react';

interface CarouselMetricsProps {
  metrics: {
    responseTime: number;
    cacheHit: boolean;
    retryCount: number;
    hitRate?: number;
    staleData?: boolean;
  };
  carouselType: string;
}

interface SystemMetrics {
  totalRequests: number;
  errorRate: number;
  avgResponseTime: number;
  cacheEfficiency: number;
  lastUpdated: number;
}

const CarouselMetrics: React.FC<CarouselMetricsProps> = ({ metrics, carouselType }) => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalRequests: 0,
    errorRate: 0,
    avgResponseTime: 0,
    cacheEfficiency: 0,
    lastUpdated: Date.now()
  });

  const [isVisible, setIsVisible] = useState(false);

  // Aggiorna metriche di sistema
  useEffect(() => {
    const updateSystemMetrics = () => {
      // Simula aggregazione di metriche reali
      setSystemMetrics(prev => ({
        totalRequests: prev.totalRequests + 1,
        errorRate: metrics.retryCount > 0 ? prev.errorRate + 0.1 : Math.max(0, prev.errorRate - 0.05),
        avgResponseTime: (prev.avgResponseTime + metrics.responseTime) / 2,
        cacheEfficiency: metrics.hitRate || (metrics.cacheHit ? 100 : 0),
        lastUpdated: Date.now()
      }));
    };

    updateSystemMetrics();
  }, [metrics]);

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadgeVariant = (isGood: boolean) => {
    return isGood ? 'default' : 'destructive';
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Activity className="h-4 w-4 mr-1" />
          Metriche
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="p-4 bg-white/95 backdrop-blur-sm border shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold">Performance Monitor</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>

        {/* Carosello corrente */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Carosello: {carouselType}</span>
            <Badge variant={getStatusBadgeVariant(metrics.cacheHit)}>
              {metrics.cacheHit ? 'Cache HIT' : 'Cache MISS'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className={getPerformanceColor(metrics.responseTime, { good: 200, warning: 500 })}>
                {metrics.responseTime}ms
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              <span className={getPerformanceColor(metrics.retryCount, { good: 0, warning: 1 })}>
                {metrics.retryCount} retry
              </span>
            </div>
            
            {metrics.staleData && (
              <div className="col-span-2">
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Dati Stale in uso
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Metriche di sistema */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium">Sistema</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-600">Richieste: </span>
              <span className="font-mono">{systemMetrics.totalRequests}</span>
            </div>
            
            <div>
              <span className="text-slate-600">Errori: </span>
              <span className={getPerformanceColor(systemMetrics.errorRate, { good: 1, warning: 5 }) + " font-mono"}>
                {systemMetrics.errorRate.toFixed(1)}%
              </span>
            </div>
            
            <div>
              <span className="text-slate-600">Tempo Medio: </span>
              <span className={getPerformanceColor(systemMetrics.avgResponseTime, { good: 300, warning: 800 }) + " font-mono"}>
                {Math.round(systemMetrics.avgResponseTime)}ms
              </span>
            </div>
            
            <div>
              <span className="text-slate-600">Cache: </span>
              <span className={getPerformanceColor(100 - systemMetrics.cacheEfficiency, { good: 20, warning: 50 }) + " font-mono"}>
                {systemMetrics.cacheEfficiency.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-2">
            Aggiornato: {new Date(systemMetrics.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CarouselMetrics;