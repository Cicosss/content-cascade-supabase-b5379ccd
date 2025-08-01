import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Presentational component - Layout wrapper per la dashboard
 * Responsabilità: Solo struttura e styling, nessuna logica di business
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {children}
    </div>
  );
};