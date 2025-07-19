import { useMemo } from 'react';
import { useLocation } from '@/contexts/LocationContext';

// Calcola la distanza tra due punti usando la formula di Haversine
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Raggio della Terra in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number) => (value * Math.PI) / 180;

// Calcola il boost di priorità basato sulla distanza
export const calculateDistanceBoost = (distanceKm: number): number => {
  if (distanceKm < 5) return 20;    // Molto vicino
  if (distanceKm < 10) return 10;   // Vicino
  if (distanceKm < 20) return 5;    // Medio vicino
  return 0;                         // Lontano
};

// Hook per il geo-filtering
export const useGeoFiltering = () => {
  const { userLocation } = useLocation();
  
  // Posizione di fallback (Rimini centro)
  const fallbackLocation = { lat: 44.0646, lng: 12.5736 };
  const currentLocation = userLocation || fallbackLocation;
  
  // Funzione per aggiungere dati di distanza e boost ai POI
  const enrichWithGeoData = useMemo(() => {
    return (pois: any[]) => {
      return pois.map(poi => {
        if (!poi.latitude || !poi.longitude) {
          return {
            ...poi,
            distance_km: 999, // POI senza coordinate vengono messi in fondo
            geo_boost: 0,
            enhanced_priority_score: poi.priority_score || 0
          };
        }

        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          poi.latitude,
          poi.longitude
        );

        const geoBoost = calculateDistanceBoost(distance);
        const enhancedPriorityScore = (poi.priority_score || 0) + geoBoost;

        return {
          ...poi,
          distance_km: Math.round(distance * 10) / 10, // Arrotonda a 1 decimale
          geo_boost: geoBoost,
          enhanced_priority_score: enhancedPriorityScore
        };
      });
    };
  }, [currentLocation.lat, currentLocation.lng]);

  // Funzione per ordinare i POI con geo-boost
  const sortByGeoEnhancedPriority = useMemo(() => {
    return (pois: any[]) => {
      return [...pois].sort((a, b) => {
        // Prima ordina per enhanced_priority_score (include geo boost)
        const priorityDiff = (b.enhanced_priority_score || 0) - (a.enhanced_priority_score || 0);
        if (Math.abs(priorityDiff) > 1) return priorityDiff;
        
        // Se i punteggi sono simili, preferisci quelli più vicini
        const distanceDiff = (a.distance_km || 999) - (b.distance_km || 999);
        if (Math.abs(distanceDiff) > 5) return distanceDiff;
        
        // Come ultima risorsa, ordina per rating
        return (b.avg_rating || 0) - (a.avg_rating || 0);
      });
    };
  }, []);

  // Funzione per ordinare principalmente per distanza
  const sortByDistance = useMemo(() => {
    return (pois: any[]) => {
      return [...pois].sort((a, b) => {
        const distanceDiff = (a.distance_km || 999) - (b.distance_km || 999);
        if (Math.abs(distanceDiff) > 1) return distanceDiff;
        
        // Se distanze simili, ordina per priorità
        return (b.priority_score || 0) - (a.priority_score || 0);
      });
    };
  }, []);

  // Funzione per creare la clause SQL per geo-filtering
  const buildGeoQuery = (baseQuery: any, maxDistanceKm?: number) => {
    if (!maxDistanceKm) return baseQuery;

    // Calcola bounding box approssimativo per performance
    const latDelta = maxDistanceKm / 111; // 1 grado ≈ 111 km
    const lngDelta = maxDistanceKm / (111 * Math.cos(currentLocation.lat * Math.PI / 180));

    return baseQuery
      .gte('latitude', currentLocation.lat - latDelta)
      .lte('latitude', currentLocation.lat + latDelta)
      .gte('longitude', currentLocation.lng - lngDelta)
      .lte('longitude', currentLocation.lng + lngDelta);
  };

  return {
    userLocation: currentLocation,
    isUsingFallback: !userLocation,
    enrichWithGeoData,
    sortByGeoEnhancedPriority,
    sortByDistance,
    buildGeoQuery,
    calculateDistance: (lat: number, lng: number) => 
      calculateDistance(currentLocation.lat, currentLocation.lng, lat, lng)
  };
};