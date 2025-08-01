import React from 'react';
import { APIHealthMonitor } from '@/components/dashboard/APIHealthMonitor';
import { ErrorRecoveryMonitor } from '@/components/dashboard/ErrorRecoveryMonitor';
import CarouselMetrics from '@/components/dashboard/CarouselMetrics';

interface DashboardDebugViewProps {
  metrics: {
    responseTime: number;
    cacheHit: boolean;
    retryCount: number;
    hitRate: number;
    staleData: boolean;
  };
}

/**
 * Presentational Component - Vista dei componenti di debug
 * Responsabilità: Rendering strumenti di debug e monitoraggio
 */
export const DashboardDebugView: React.FC<DashboardDebugViewProps> = ({ metrics }) => {
  return (
    <div className="hidden lg:block">
      <APIHealthMonitor />
      <ErrorRecoveryMonitor />
      
      {/* Sistema di monitoraggio performance ottimizzato */}
      <CarouselMetrics 
        metrics={metrics}
        carouselType="dashboard"
      />
    </div>
  );
};