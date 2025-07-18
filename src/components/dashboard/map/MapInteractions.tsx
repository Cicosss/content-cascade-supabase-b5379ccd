
import React, { useEffect, memo } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { useLocation } from '@/contexts/LocationContext';
import { useBoundsStabilizer } from '@/hooks/useBoundsStabilizer';

interface MapInteractionsProps {
  onBoundsChange: (bounds: any) => void;
}

const MapInteractions: React.FC<MapInteractionsProps> = memo(({ onBoundsChange }) => {
  const { mapInstance, isMapReady } = useMapContext();
  const { getCurrentLocation } = useLocation();

  // Use the new bounds stabilizer
  const { isUserInteracting, initializeListeners } = useBoundsStabilizer({
    map: mapInstance,
    onStableBoundsChange: onBoundsChange,
    stabilizationDelay: 2000 // 2 seconds for stability
  });

  // Initialize listeners when map is ready
  useEffect(() => {
    if (mapInstance && isMapReady) {
      console.log('🎯 Initializing stable map listeners');
      const cleanup = initializeListeners();
      return cleanup;
    }
  }, [mapInstance, isMapReady, initializeListeners]);

  // Center on user location
  const handleCenterOnUser = () => {
    if (mapInstance) {
      getCurrentLocation();
    }
  };

  // Log interaction state for debugging
  useEffect(() => {
    if (isUserInteracting) {
      console.log('👆 User is interacting with map');
    }
  }, [isUserInteracting]);

  // This component manages interactions but doesn't render anything
  return null;
});

MapInteractions.displayName = 'MapInteractions';

export default MapInteractions;
