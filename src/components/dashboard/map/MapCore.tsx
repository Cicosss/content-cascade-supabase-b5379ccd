import React, { memo, Suspense } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { POI } from '@/types/poi';
import GoogleMapInstance from './GoogleMapInstance';
import MapOverlays from './MapOverlays';
import MarkerSystem from './MarkerSystem';
import MapInteractions from './MapInteractions';

interface MapCoreProps {
  pois: POI[];
  onPOISelect: (poi: POI) => void;
  onBoundsChange: (bounds: any) => void;
  validPOICount: number;
}

const MapCore: React.FC<MapCoreProps> = memo(({ 
  pois, 
  onPOISelect, 
  onBoundsChange,
  validPOICount 
}) => {
  const { mapInstance, isMapReady } = useMapContext();

  const handleCenterOnUser = () => {
    // This will be handled by MapInteractions component
  };

  const handleSearch = () => {
    // This will be handled by MapInteractions component
  };

  return (
    <div className="relative h-full z-map-container-custom google-maps-container">
      {/* Core Google Maps Instance */}
      <GoogleMapInstance />
      
      {/* Marker Management System */}
      {isMapReady && (
        <Suspense fallback={null}>
          <MarkerSystem 
            pois={pois}
            onPOISelect={onPOISelect}
          />
        </Suspense>
      )}
      
      {/* Interaction Management */}
      {isMapReady && (
        <MapInteractions onBoundsChange={onBoundsChange} />
      )}
      
      {/* UI Overlays */}
      <MapOverlays
        onCenterOnUser={handleCenterOnUser}
        onSearch={handleSearch}
        validPOICount={validPOICount}
      />
    </div>
  );
});

MapCore.displayName = 'MapCore';

export default MapCore;