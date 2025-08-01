import React, { memo } from 'react';
import SimpleInteractiveMap from '@/components/dashboard/SimpleInteractiveMap';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';
import { MapFilters } from '../../types/dashboardTypes';

/**
 * Presentational Component - Mobile Map Section
 * 
 * Responsabilità:
 * - Rendering mappa ottimizzato per mobile
 * - Altezza e dimensioni appropriate per mobile
 * - Error boundary specifico per la mappa
 */

interface MobileMapSectionProps {
  mapFilters: MapFilters;
}

const MobileMapSection: React.FC<MobileMapSectionProps> = memo(({ mapFilters }) => {
  return (
    <div className="h-[55vh] min-h-[350px] max-h-[450px]">
      <div className="h-full rounded-2xl overflow-hidden shadow-xl">
        <APIErrorBoundary>
          <SimpleInteractiveMap filters={mapFilters} />
        </APIErrorBoundary>
      </div>
    </div>
  );
});

MobileMapSection.displayName = 'MobileMapSection';

export default MobileMapSection;