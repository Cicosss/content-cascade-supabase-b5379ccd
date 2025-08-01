import React from 'react';
import { DashboardDebugView } from '../views/DashboardDebugView';

/**
 * Smart Container Component - Gestisce componenti di debug
 * Responsabilità: Controllo visibilità e metriche di debug
 */
export const DashboardDebugContainer: React.FC = () => {
  const debugMetrics = {
    responseTime: 120,
    cacheHit: true,
    retryCount: 0,
    hitRate: 92,
    staleData: false
  };

  // Nasconde debug in produzione o su mobile
  const shouldShowDebug = process.env.NODE_ENV === 'development' && window.innerWidth >= 1024;

  if (!shouldShowDebug) {
    return null;
  }

  return <DashboardDebugView metrics={debugMetrics} />;
};