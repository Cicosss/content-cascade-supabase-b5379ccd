import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/services/apiClient';
import { weatherApiService } from '@/services/weatherApiService';

export const APIHealthMonitor: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateHealth = () => {
      const healthData = apiClient.getHealthStatus();
      setHealth(healthData);
    };

    updateHealth();
    const interval = setInterval(updateHealth, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Show monitor only in development or when there are issues
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' || 
        (health && (health.successRate < 0.95 || health.circuitBreakersOpen > 0))) {
      setIsVisible(true);
    }
  }, [health]);

  if (!isVisible || !health) return null;

  const getStatusColor = (value: number, good: number, ok: number) => {
    if (value >= good) return 'default';
    if (value >= ok) return 'secondary';
    return 'destructive';
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-border/50 bg-background/95 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4" />
            API Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span className="text-xs font-medium">Success Rate</span>
              </div>
              <Badge variant={getStatusColor(health.successRate, 0.95, 0.85)}>
                {(health.successRate * 100).toFixed(1)}%
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs font-medium">Avg Response</span>
              </div>
              <Badge variant={getStatusColor(2000 - health.avgResponseTime, 1500, 500)}>
                {formatTime(health.avgResponseTime)}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                <span className="text-xs font-medium">Cache Hit</span>
              </div>
              <Badge variant={getStatusColor(health.cacheHitRate, 0.6, 0.3)}>
                {(health.cacheHitRate * 100).toFixed(1)}%
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span className="text-xs font-medium">Requests</span>
              </div>
              <Badge variant="outline">
                {health.totalRequests}
              </Badge>
            </div>
          </div>

          {health.circuitBreakersOpen > 0 && (
            <div className="pt-2 border-t border-border">
              <Badge variant="destructive" className="text-xs">
                ⚠️ {health.circuitBreakersOpen} circuit breaker(s) open
              </Badge>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Last 5 minutes • Updates every 30s
          </div>
        </CardContent>
      </Card>
    </div>
  );
};