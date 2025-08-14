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
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-50 h-40"></div>
            <svg 
              className="relative z-10 w-full h-32" 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,0 C150,120 350,0 600,60 C850,120 1050,0 1200,60 V120 H0 V0 Z" 
                className="fill-slate-50"
              ></path>
            </svg>
          </div>

          {/* Content Section */}
          <div className="bg-slate-50 -mt-20">
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