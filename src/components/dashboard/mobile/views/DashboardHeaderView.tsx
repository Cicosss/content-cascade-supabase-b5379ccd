import React from 'react';

interface DashboardHeaderViewProps {
  userName: string;
}

/**
 * Presentational Component - Vista dell'header della dashboard
 * Responsabilità: Solo rendering UI, nessuna logica di business
 */
export const DashboardHeaderView: React.FC<DashboardHeaderViewProps> = ({ userName }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
      <div className="w-full max-w-none px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Intestazione Fluttuante Elegante Premium */}
        <div className="text-center space-y-6 py-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent">
            Ciao, {userName}!
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed tracking-wide">
            Iniziamo? Esplora la mappa o applica i filtri per scoprire la tua Romagna.
          </p>
          <div className="flex justify-center">
            <div className="w-36 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};