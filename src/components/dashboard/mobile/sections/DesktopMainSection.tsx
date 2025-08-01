import React, { memo } from 'react';
import SimpleInteractiveMap from '@/components/dashboard/SimpleInteractiveMap';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import CoastalStatusWidget from '@/components/dashboard/CoastalStatusWidget';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';
import { WeatherErrorBoundary } from '@/components/dashboard/error-boundaries/WeatherErrorBoundary';
import { MapFilters } from '../../types/dashboardTypes';

/**
 * Presentational Component - Desktop Main Section
 * 
 * Responsabilità:
 * - Layout grid per desktop (mappa + sidebar)
 * - Gestione spazio ottimale per schermi grandi
 * - Componenti affiancati invece che stacked
 */

interface DesktopMainSectionProps {
  mapFilters: MapFilters;
}

const DesktopMainSection: React.FC<DesktopMainSectionProps> = memo(({ mapFilters }) => {
  return (
    <div className="space-y-8 lg:space-y-0">
      {/* Grid layout per desktop */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-6 lg:h-[500px]">
        {/* Mappa - 3/4 della griglia su desktop */}
        <div className="h-[60vh] min-h-[400px] lg:h-full lg:col-span-3">
          <div className="h-full rounded-3xl overflow-hidden shadow-xl">
            <APIErrorBoundary>
              <SimpleInteractiveMap filters={mapFilters} />
            </APIErrorBoundary>
          </div>
        </div>
        
        {/* Sidebar widgets - 1/4 della griglia su desktop */}
        <div className="lg:col-span-1 lg:flex lg:flex-col lg:gap-3 lg:h-full">
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
  );
});

DesktopMainSection.displayName = 'DesktopMainSection';

export default DesktopMainSection;