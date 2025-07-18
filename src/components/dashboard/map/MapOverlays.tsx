import React, { memo, Suspense } from 'react';
import { useMapUI } from '@/contexts/MapUIContext';
import { useLocation } from '@/contexts/LocationContext';
import MapControls from '../MapControls';
import MapSearchControls from '../MapSearchControls';
import MapLoadingIndicator from '../MapLoadingIndicator';

interface MapOverlaysProps {
  onCenterOnUser: () => void;
  onSearch: () => void;
  validPOICount: number;
}

const MapOverlays: React.FC<MapOverlaysProps> = memo(({ 
  onCenterOnUser, 
  onSearch, 
  validPOICount 
}) => {
  const { 
    showSearchButton, 
    isSearching, 
    controlsVisible,
    loadingStates 
  } = useMapUI();
  const { isLoadingLocation } = useLocation();

  return (
    <>
      {/* Loading Indicator */}
      <MapLoadingIndicator isLoadingPOIs={loadingStates.data} />
      
      {/* Search Controls */}
      <MapSearchControls
        isSearching={isSearching}
        showSearchButton={showSearchButton}
        onSearch={onSearch}
        poiCount={validPOICount}
      />
      
      {/* Map Controls */}
      {controlsVisible && (
        <div className="map-controls-overlay">
          <Suspense fallback={<div className="w-10 h-10 bg-white rounded-lg animate-pulse" />}>
            <MapControls 
              onCenterOnUser={onCenterOnUser}
              isLoadingLocation={isLoadingLocation}
            />
          </Suspense>
        </div>
      )}
    </>
  );
});

MapOverlays.displayName = 'MapOverlays';

export default MapOverlays;