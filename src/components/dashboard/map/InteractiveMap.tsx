
import React, { memo } from 'react';
import { MapProvider } from '@/contexts/MapContext';
import { MapFiltersProvider } from '@/contexts/MapFiltersContext';
import { MapUIProvider } from '@/contexts/MapUIContext';
import { POIFilters } from '@/types/poi';
import MapContainer from './MapContainer';

interface InteractiveMapProps {
  filters: {
    activityTypes: string[];
    withChildren: string;
    zone?: string;
    period?: any;
  };
}

const InteractiveMap: React.FC<InteractiveMapProps> = memo(({ filters }) => {
  // Transform filters for initial state with proper type casting
  const initialFilters: Partial<POIFilters> = {
    activityTypes: filters.activityTypes || [],
    withChildren: (filters.withChildren === 'si' ? 'si' : 'no') as 'si' | 'no',
    bounds: null
  };

  return (
    <div className="map-isolation-container">
      <MapProvider>
        <MapFiltersProvider initialFilters={initialFilters}>
          <MapUIProvider>
            <MapContainer filters={filters} />
          </MapUIProvider>
        </MapFiltersProvider>
      </MapProvider>
    </div>
  );
});

InteractiveMap.displayName = 'InteractiveMap';

export default InteractiveMap;
