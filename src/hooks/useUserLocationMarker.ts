
import { useRef, useEffect } from 'react';

interface UseUserLocationMarkerProps {
  map: google.maps.Map | null;
  userLocation: { lat: number; lng: number } | null;
  userIcon: google.maps.Icon | null;
}

export const useUserLocationMarker = ({ map, userLocation, userIcon }: UseUserLocationMarkerProps) => {
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  // Manage user location marker
  useEffect(() => {
    if (!map || !window.google?.maps || !userIcon) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = new google.maps.Marker({
          position: userLocation,
          title: 'La tua posizione',
          icon: userIcon,
          map: map
        });
      } else {
        userMarkerRef.current.setPosition(userLocation);
        userMarkerRef.current.setMap(map);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }
  }, [map, userLocation, userIcon]);

  const clearUserMarker = () => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }
  };

  return { clearUserMarker };
};
