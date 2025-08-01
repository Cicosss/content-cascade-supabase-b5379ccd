
import React from 'react';
import Layout from '@/components/Layout';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { DashboardErrorBoundary } from '@/components/dashboard/error-boundaries/DashboardErrorBoundary';
import { DashboardLayout } from '@/components/dashboard/mobile/DashboardLayout';
import { DashboardHeaderContainer } from '@/components/dashboard/mobile/containers/DashboardHeaderContainer';
import { DashboardMainSectionContainer } from '@/components/dashboard/mobile/containers/DashboardMainSectionContainer';
import { DashboardContentContainer } from '@/components/dashboard/mobile/containers/DashboardContentContainer';
import { DashboardDebugContainer } from '@/components/dashboard/mobile/containers/DashboardDebugContainer';

/**
 * Dashboard - Component principale della dashboard
 * 
 * Architettura:
 * ├── DashboardProvider (Context per state management)
 * ├── DashboardLayout (Wrapper presentational)
 * ├── DashboardHeaderContainer (Smart component per header)
 * ├── DashboardMainSectionContainer (Smart component per mappa e widget)
 * ├── DashboardContentContainer (Smart component per contenuti)
 * └── DashboardDebugContainer (Smart component per debug tools)
 * 
 * Principi applicati:
 * - Separazione netta tra container (smart) e presentational (dumb) components
 * - State management centralizzato tramite Context API
 * - Riduzione prop drilling attraverso hook personalizzati
 * - Responsabilità singola per ogni componente
 * - Interfacce chiare e ben documentate
 */
const Dashboard = () => {
  return (
    <DashboardErrorBoundary>
      <DashboardProvider>
        <Layout>
          <DashboardLayout>
            <DashboardHeaderContainer />
            <DashboardMainSectionContainer />
            <DashboardContentContainer />
            <DashboardDebugContainer />
          </DashboardLayout>
        </Layout>
      </DashboardProvider>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;
