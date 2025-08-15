import React, { memo } from 'react';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import CoastalStatusWidget from '@/components/dashboard/CoastalStatusWidget';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';
import { WeatherErrorBoundary } from '@/components/dashboard/error-boundaries/WeatherErrorBoundary';

/**
 * Presentational Component - Mobile Widgets Section
 * 
 * Responsabilità:
 * - Layout orizzontale compatto per mobile
 * - Widget meteo e stato costa affiancati
 * - Error boundaries separati per ogni widget
 * - Dimensioni ottimizzate per touch
 */

const MobileWidgetsSection: React.FC = memo(() => {
  return (
    <div className="space-y-3">
      {/* Weather Widget */}
      <div className="w-full">
        <WeatherErrorBoundary>
          <PersonalizedWeather />
        </WeatherErrorBoundary>
      </div>
      
      {/* Coastal Status Widget */}
      <div className="w-full">
        <APIErrorBoundary>
          <CoastalStatusWidget />
        </APIErrorBoundary>
      </div>
    </div>
  );
});

MobileWidgetsSection.displayName = 'MobileWidgetsSection';

export default MobileWidgetsSection;