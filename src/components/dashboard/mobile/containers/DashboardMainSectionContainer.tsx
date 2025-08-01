import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { DashboardMainSectionView } from '../views/DashboardMainSectionView';

/**
 * Smart Container Component - Gestisce stato e logica per la sezione principale
 * Responsabilità: Fornisce dati dal context ai componenti figli
 */
export const DashboardMainSectionContainer: React.FC = () => {
  const { mapFilters } = useDashboard();

  return <DashboardMainSectionView mapFilters={mapFilters} />;
};