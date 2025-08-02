import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { POIFilters } from '@/types/poi';

interface MapDebugPanelProps {
  isVisible: boolean;
  filters: POIFilters;
  poiCount: number;
  isCircuitBreakerOpen: boolean;
  cacheStats?: {
    hitRate: number;
    totalRequests: number;
  };
  networkHealth?: {
    latency: number;
    errorRate: number;
  };
}

export const MapDebugPanel: React.FC<MapDebugPanelProps> = ({
  isVisible,
  filters,
  poiCount,
  isCircuitBreakerOpen,
  cacheStats,
  networkHealth
}) => {
  if (!isVisible || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed top-4 right-4 z-50 max-w-sm bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Map Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {/* POI Stats */}
        <div className="flex items-center justify-between">
          <span>POIs Loaded:</span>
          <Badge variant={poiCount > 0 ? "default" : "destructive"}>
            {poiCount}
          </Badge>
        </div>

        {/* Circuit Breaker Status */}
        <div className="flex items-center justify-between">
          <span>Circuit Breaker:</span>
          <Badge variant={isCircuitBreakerOpen ? "destructive" : "default"}>
            {isCircuitBreakerOpen ? "OPEN" : "CLOSED"}
          </Badge>
        </div>

        {/* Active Filters */}
        <div className="space-y-1">
          <span className="font-medium">Active Filters:</span>
          <div className="grid grid-cols-2 gap-1">
            <span>Categories:</span>
            <span className="text-right">
              {filters.activityTypes.length || "All"}
            </span>
            <span>Children:</span>
            <span className="text-right">{filters.withChildren}</span>
            <span>Bounds:</span>
            <span className="text-right">
              {filters.bounds ? "Yes" : "No"}
            </span>
          </div>
        </div>

        {/* Cache Stats */}
        {cacheStats && (
          <div className="space-y-1">
            <span className="font-medium">Cache:</span>
            <div className="grid grid-cols-2 gap-1">
              <span>Hit Rate:</span>
              <span className="text-right">
                {(cacheStats.hitRate * 100).toFixed(1)}%
              </span>
              <span>Requests:</span>
              <span className="text-right">{cacheStats.totalRequests}</span>
            </div>
          </div>
        )}

        {/* Network Health */}
        {networkHealth && (
          <div className="space-y-1">
            <span className="font-medium">Network:</span>
            <div className="grid grid-cols-2 gap-1">
              <span>Latency:</span>
              <span className="text-right">{networkHealth.latency}ms</span>
              <span>Error Rate:</span>
              <span className="text-right">
                {(networkHealth.errorRate * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Bounds Details */}
        {filters.bounds && (
          <div className="space-y-1">
            <span className="font-medium">Map Bounds:</span>
            <div className="text-xs text-muted-foreground">
              N: {filters.bounds.north.toFixed(4)}<br/>
              S: {filters.bounds.south.toFixed(4)}<br/>
              E: {filters.bounds.east.toFixed(4)}<br/>
              W: {filters.bounds.west.toFixed(4)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};