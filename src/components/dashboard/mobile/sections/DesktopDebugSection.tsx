import React, { memo } from 'react';
import { APIHealthMonitor } from '@/components/dashboard/APIHealthMonitor';
import { ErrorRecoveryMonitor } from '@/components/dashboard/ErrorRecoveryMonitor';
import CarouselMetrics from '@/components/dashboard/CarouselMetrics';

/**
 * Presentational Component - Desktop Debug Section
 * 
 * Responsabilità:
 * - Componenti debug visibili solo su desktop
 * - Monitoraggio performance e health
 * - Metriche development-only
 */

const DesktopDebugSection: React.FC = memo(() => {
  return (
    <div className="hidden lg:block">
      <APIHealthMonitor />
      <ErrorRecoveryMonitor />
      
      {/* Sistema di monitoraggio performance ottimizzato */}
      <CarouselMetrics 
        metrics={{
          responseTime: 120,
          cacheHit: true,
          retryCount: 0,
          hitRate: 92,
          staleData: false
        }}
        carouselType="dashboard"
      />
    </div>
  );
});

DesktopDebugSection.displayName = 'DesktopDebugSection';

export default DesktopDebugSection;