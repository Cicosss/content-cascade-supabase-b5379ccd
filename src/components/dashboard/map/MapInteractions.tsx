import React, { useEffect, memo } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { useMapUI } from '@/contexts/MapUIContext';
import { useLocation } from '@/contexts/LocationContext';
import { useMapBoundsSearch } from '@/hooks/useMapBoundsSearch';

interface MapInteractionsProps {
  onBoundsChange: (bounds: any) => void;
}

const MapInteractions: React.FC<MapInteractionsProps> = memo(({ onBoundsChange }) => {
  const { mapInstance, isMapReady } = useMapContext();
  const { setShowSearchButton, setIsSearching } = useMapUI();
  const { getCurrentLocation } = useLocation();

  // Map bounds search functionality
  const {
    isSearching,
    showSearchButton,
    triggerBoundsSearch,
    initializeMapListeners
  } = useMapBoundsSearch({
    map: mapInstance,
    onBoundsChange,
    debounceMs: 500
  });

  // Sync UI state with bounds search state
  useEffect(() => {
    setShowSearchButton(showSearchButton);
  }, [showSearchButton, setShowSearchButton]);

  useEffect(() => {
    setIsSearching(isSearching);
  }, [isSearching, setIsSearching]);

  // Initialize map listeners when map is ready
  useEffect(() => {
    if (mapInstance && isMapReady) {
      const cleanup = initializeMapListeners();
      return cleanup;
    }
  }, [mapInstance, isMapReady, initializeMapListeners]);

  // Center on user location
  const handleCenterOnUser = () => {
    if (mapInstance) {
      getCurrentLocation();
      // Get current location from context instead
    }
  };

  // Expose methods for parent components
  React.useImperativeHandle(React.createRef(), () => ({
    centerOnUser: handleCenterOnUser,
    triggerSearch: triggerBoundsSearch,
  }));

  // This component manages interactions but doesn't render anything
  return null;
});

MapInteractions.displayName = 'MapInteractions';

export default MapInteractions;