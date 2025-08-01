import React from 'react';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';
import { WeatherErrorBoundary } from '@/components/dashboard/error-boundaries/WeatherErrorBoundary';
import SimpleInteractiveMap from '@/components/dashboard/SimpleInteractiveMap';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import CoastalStatusWidget from '@/components/dashboard/CoastalStatusWidget';

interface DashboardMainSectionViewProps {
  mapFilters: {
    activityTypes: string[];
    zone: string;
    withChildren: string;
  };
}

/**
 * Presentational Component - Vista della sezione principale con mappa e widget
 * Responsabilità: Layout e composizione dei componenti, nessuna logica di business
 */
export const DashboardMainSectionView: React.FC<DashboardMainSectionViewProps> = ({ mapFilters }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
      <div className="w-full max-w-none px-3 sm:px-4 md:px-6 lg:px-8 pb-6 md:pb-8">
        {/* Sezione principale: Mappa + Meteo + Stato Costa - Mobile First */}
        <div className="space-y-8 lg:space-y-0">
          {/* Mobile: Mappa a tutto schermo, Desktop: Grid layout */}
          <div className="lg:grid lg:grid-cols-4 lg:gap-6 lg:h-[500px]">
            {/* Mappa - Mobile: altezza ottimizzata, Desktop: 3/4 della griglia */}
            <div className="min-h-[450px] max-h-[65vh] lg:h-full lg:col-span-3">
              <div className="h-full rounded-3xl overflow-hidden shadow-xl map-container-mobile">
                <APIErrorBoundary>
                  <SimpleInteractiveMap filters={mapFilters} />
                </APIErrorBoundary>
              </div>
            </div>
            
            {/* Meteo e Stato Costa - Mobile: sotto mappa, Desktop: sidebar */}
            <div className="lg:col-span-1 lg:flex lg:flex-col lg:gap-3 lg:h-full">
              {/* Mobile: grid orizzontale, Desktop: stack verticale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-3 lg:h-full">
                <div className="lg:flex-1">
                  <WeatherErrorBoundary>
                    <PersonalizedWeather />
                  </WeatherErrorBoundary>
                </div>
                <div className="lg:flex-1">
                  <APIErrorBoundary>
                    <CoastalStatusWidget />
                  </APIErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};