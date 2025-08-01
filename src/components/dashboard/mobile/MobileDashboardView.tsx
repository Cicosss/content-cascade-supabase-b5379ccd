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
        <div className="min-h-screen bg-white overflow-x-hidden">
          {/* Header Section - Ottimizzato per mobile */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
            <div className="w-full max-w-full py-4 px-3 sm:py-6 sm:px-4">
              <MobileHeader userName={data.userName} />
              
              {/* Map Section - Full height su mobile */}
              <div className="mt-4 sm:mt-6">
                <MobileMapSection mapFilters={data.mapFilters} />
              </div>
            </div>
          </div>

          {/* Widgets Section - Stack orizzontale compatto su mobile */}
          <div className="bg-slate-800 border-t border-slate-700">
            <div className="w-full max-w-full py-3 px-3 sm:py-4 sm:px-4">
              <MobileWidgetsSection />
            </div>
          </div>

          {/* Content Section - Contenuti principali */}
          <div className="bg-slate-50">
            <div className="w-full max-w-full py-4 px-3 sm:py-6 sm:px-4">
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