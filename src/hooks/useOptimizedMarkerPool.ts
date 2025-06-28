
import { POI } from '@/types/poi';
import { useMarkerIcons } from './useMarkerIcons';
import { usePOIValidation } from './usePOIValidation';
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
  
  // Manage marker pool - directly pass onPOISelect
  const { clearMarkers, markerCount } = useMarkerPool({
    map,
    validPOIs,
    poiIcon,
    onPOISelect: (poi) => onPOISelect(poi)
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
  };

  return { 
    clearAllMarkers,
    markerCount,
    validPOICount: validPOIs.length
  };
};
