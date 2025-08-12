
import { POI } from '@/types/poi';
import { usePOIValidation } from './usePOIValidation';
import { useMarkerPool } from './useMarkerPool';

interface UseOptimizedMarkerPoolProps {
  map: google.maps.Map | null;
  pois: POI[];
  onPOISelect: (poi: POI) => void;
  poiIcon?: google.maps.Icon | null;
}

export const useOptimizedMarkerPool = ({
  map,
  pois,
  onPOISelect,
  poiIcon,
}: UseOptimizedMarkerPoolProps) => {
  // Get validated POIs
  const { validPOIs } = usePOIValidation(pois);

  // Manage POI marker pool only
  const { clearMarkers, markerCount } = useMarkerPool({
    map,
    validPOIs,
    poiIcon: poiIcon ?? undefined,
    onPOISelect,
  });

  const clearAllMarkers = () => {
    clearMarkers();
  };

  return {
    clearAllMarkers,
    markerCount,
    validPOICount: validPOIs.length,
  };
};
