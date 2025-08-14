import React, { memo } from 'react';
import { DashboardViewProps } from '../types/dashboardTypes';
import DesktopHeader from './sections/DesktopHeader';
import DesktopMainSection from './sections/DesktopMainSection';
import DesktopContentSection from './sections/DesktopContentSection';
import DesktopDebugSection from './sections/DesktopDebugSection';
import Layout from '@/components/Layout';
import { DashboardErrorBoundary } from '@/components/dashboard/error-boundaries/DashboardErrorBoundary';

/**
 * Presentational Component (Dumb) - Desktop Dashboard View
 * 
 * Responsabilità:
 * - Rendering ottimizzato per desktop
 * - Layout grid per desktop
 * - Componenti debug visibili solo su desktop
 * - Gestione spazio disponibile maggiore
 */
const DesktopDashboardView: React.FC<DashboardViewProps> = memo(({ data }) => {
  return (
    <DashboardErrorBoundary>
      <Layout>
        <div className="min-h-screen -mt-16 md:-mt-20 lg:-mt-24">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
            <div className="container mx-auto py-8 space-y-8">
              <DesktopHeader userName={data.userName} />
              
              {/* Main Section - Grid layout per desktop */}
              <DesktopMainSection mapFilters={data.mapFilters} />
            </div>
          </div>

          {/* Elegant Divider with Wave Effect */}
          <div className="relative bg-slate-800 overflow-hidden">
            <svg 
              className="w-full h-20" 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,120 C150,0 350,120 600,60 C850,0 1050,120 1200,60 V0 H0 V120 Z" 
                className="fill-slate-50"
              ></path>
            </svg>
          </div>

          {/* Content Section */}
          <div className="bg-slate-50">
            <div className="container mx-auto py-8">
              <DesktopContentSection />
            </div>
          </div>

          {/* Debug Section - Solo su desktop */}
          <DesktopDebugSection />
        </div>
      </Layout>
    </DashboardErrorBoundary>
  );
});

DesktopDashboardView.displayName = 'DesktopDashboardView';

export default DesktopDashboardView;