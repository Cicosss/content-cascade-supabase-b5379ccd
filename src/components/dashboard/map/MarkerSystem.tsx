import React, { useEffect, memo } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { useOptimizedMarkerPool } from '@/hooks/useOptimizedMarkerPool';
import { useLocation } from '@/contexts/LocationContext';
import { POI } from '@/types/poi';

interface MarkerSystemProps {
  pois: POI[];
  onPOISelect: (poi: POI) => void;
}

const MarkerSystem: React.FC<MarkerSystemProps> = memo(({ pois, onPOISelect }) => {
  const { mapInstance, isMapReady } = useMapContext();
  const { userLocation } = useLocation();

  const { clearAllMarkers, validPOICount } = useOptimizedMarkerPool({
    map: mapInstance,
    pois,
    userLocation,
    onPOISelect,
    isGoogleMapsLoaded: isMapReady
  });

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      clearAllMarkers();
    };
  }, [clearAllMarkers]);

  // This component doesn't render anything visible
  // It just manages markers on the map instance
  return null;
});

MarkerSystem.displayName = 'MarkerSystem';

export default MarkerSystem;