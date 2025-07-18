import React, { memo } from 'react';
import { MapProvider } from '@/contexts/MapContext';
import { MapFiltersProvider } from '@/contexts/MapFiltersContext';
import { MapUIProvider } from '@/contexts/MapUIContext';
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
  // Transform filters for initial state
  const initialFilters = {
    activityTypes: filters.activityTypes || [],
    withChildren: filters.withChildren || 'no',
    bounds: null
  };

  return (
    <MapProvider>
      <MapFiltersProvider initialFilters={initialFilters}>
        <MapUIProvider>
          <MapContainer filters={filters} />
        </MapUIProvider>
      </MapFiltersProvider>
    </MapProvider>
  );
});

InteractiveMap.displayName = 'InteractiveMap';

export default InteractiveMap;