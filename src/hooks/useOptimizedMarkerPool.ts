
import { POI } from '@/types/poi';
import { useMarkerIcons } from './useMarkerIcons';
import { usePOIValidation } from './usePOIValidation';
import { useInfoWindow } from './useInfoWindow';
import { useMarkerPool } from './useMarkerPool';
import { useUserLocationMarker } from './useUserLocationMarker';

interface UseOptimizedMarkerPoolProps {
  map: google.maps.Map | null;
  pois: POI[];
  userLocation: { lat: number; lng: number } | null;
  onPOISelect: (poi: POI) => void;
}

export const useOptimizedMarkerPool = ({ 
  map, 
  pois, 
  userLocation, 
  onPOISelect 
}: UseOptimizedMarkerPoolProps) => {
  // Get memoized icons
  const { poiIcon, userIcon } = useMarkerIcons();
  
  // Get validated POIs
  const { validPOIs } = usePOIValidation(pois);
  
  // Setup InfoWindow management
  const { showInfoWindow, setupGlobalHandlers, closeInfoWindow } = useInfoWindow({
    map,
    onPOISelect
  });
  
  // Handle marker click
  const handleMarkerClick = (poi: POI & { coordinates: { lat: number; lng: number } }, marker: google.maps.Marker) => {
    showInfoWindow(poi, marker);
  };
  
  // Setup global handlers when validPOIs change
  setupGlobalHandlers(validPOIs);
  
  // Manage marker pool
  const { clearMarkers, markerCount } = useMarkerPool({
    map,
    validPOIs,
    poiIcon,
    onMarkerClick: handleMarkerClick
  });
  
  // Manage user location marker
  const { clearUserMarker } = useUserLocationMarker({
    map,
    userLocation,
    userIcon
  });

  const clearAllMarkers = () => {
    clearMarkers();
    clearUserMarker();
    closeInfoWindow();
  };

  return { 
    clearAllMarkers,
    markerCount,
    validPOICount: validPOIs.length
  };
};
