import React, { memo } from 'react';
import { DashboardViewProps } from '../types/dashboardTypes';
import MobileHeader from './sections/MobileHeader';
import MobileMapSection from './sections/MobileMapSection';
import MobileWidgetsSection from './sections/MobileWidgetsSection';
import MobileContentSection from './sections/MobileContentSection';
import Layout from '@/components/Layout';
import { DashboardErrorBoundary } from '@/components/dashboard/error-boundaries/DashboardErrorBoundary';

/**
 * Presentational Component (Dumb) - Mobile Dashboard View
 * 
 * Responsabilità:
 * - Rendering ottimizzato per mobile
 * - Layout stack verticale per mobile
 * - Gestione responsive dei componenti
 * - Separazione chiara delle sezioni
 */
const MobileDashboardView: React.FC<DashboardViewProps> = memo(({ data }) => {
  return (
    <DashboardErrorBoundary>
      <Layout>
        <div className="min-h-screen overflow-x-hidden -mt-16 md:-mt-20 lg:-mt-24">
          {/* Header Section - Ottimizzato per mobile */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
            <div className="container mx-auto py-4 px-3 md:px-4 lg:px-6 sm:py-6">
              <MobileHeader userName={data.userName} />
              
              {/* Map Section - Full height su mobile */}
              <div className="mt-4 sm:mt-6">
                <MobileMapSection mapFilters={data.mapFilters} />
              </div>
            </div>
          </div>

          {/* Elegant Divider with Wave Effect */}
          <div className="relative bg-slate-800 overflow-hidden">
            <svg 
              className="w-full h-16" 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,120 C150,0 350,120 600,60 C850,0 1050,120 1200,60 V0 H0 V120 Z" 
                className="fill-slate-50"
              ></path>
            </svg>
          </div>

          {/* Widgets Section - Stack orizzontale compatto su mobile */}
          <div className="bg-slate-800">
            <div className="container mx-auto py-3 px-3 md:px-4 lg:px-6 sm:py-4">
              <MobileWidgetsSection />
            </div>
          </div>

          {/* Content Section - Contenuti principali */}
          <div className="bg-slate-50">
            <div className="container mx-auto py-4 px-3 md:px-4 lg:px-6 sm:py-6">
              <MobileContentSection />
            </div>
          </div>
        </div>
      </Layout>
    </DashboardErrorBoundary>
  );
});

MobileDashboardView.displayName = 'MobileDashboardView';

export default MobileDashboardView;