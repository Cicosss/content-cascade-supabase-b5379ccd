
import { useRef, useEffect } from 'react';

interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  images?: string[];
  price_info?: string;
  avg_rating?: number;
}

interface UseGoogleMapMarkersProps {
  map: any;
  pois: POI[];
  userLocation: { lat: number; lng: number } | null;
  onPOISelect: (poi: POI) => void;
}

export const useGoogleMapMarkers = ({ map, pois, userLocation, onPOISelect }: UseGoogleMapMarkersProps) => {
  const markersRef = useRef<any[]>([]);

  // Update POI markers
  useEffect(() => {
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each POI
    pois.forEach(poi => {
      const marker = new window.google.maps.Marker({
        position: { lat: poi.latitude, lng: poi.longitude },
        map: map,
        title: poi.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#1e3a8a" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      marker.addListener('click', () => {
        onPOISelect(poi);
      });

      markersRef.current.push(marker);
    });

    console.log('🏷️ Marker aggiornati:', pois.length);
  }, [map, pois, onPOISelect]);

  // Add user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    const userMarker = new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'La tua posizione',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="3"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: new window.google.maps.Point(12, 12)
      }
    });

    // Center map on user location
    map.setCenter(userLocation);

    return () => {
      userMarker.setMap(null);
    };
  }, [map, userLocation]);

  return {
    clearMarkers: () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
  };
};
