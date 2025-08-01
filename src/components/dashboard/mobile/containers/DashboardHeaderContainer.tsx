import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { DashboardHeaderView } from '../views/DashboardHeaderView';

/**
 * Smart Container Component - Gestisce stato e logica per l'header
 * Responsabilità: Recupero dati dal context e passaggio ai componenti presentational
 */
export const DashboardHeaderContainer: React.FC = () => {
  const { userName } = useDashboard();

  return <DashboardHeaderView userName={userName} />;
};