
import { useMemo } from 'react';
import { POI } from '@/types/poi';

export const usePOIValidation = (pois: POI[]) => {
  // Memoized POI coordinates validation and processing
  const validPOIs = useMemo(() => {
    return pois.filter(poi => {
      const lat = Number(poi.latitude);
      const lng = Number(poi.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat >= 35 && lat <= 47 && lng >= 6 && lng <= 19;
    }).map(poi => ({
      ...poi,
      coordinates: { lat: Number(poi.latitude), lng: Number(poi.longitude) }
    }));
  }, [pois]);

  return { validPOIs };
};
