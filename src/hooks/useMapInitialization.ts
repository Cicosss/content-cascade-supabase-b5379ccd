
import { useRef, useEffect } from 'react';

interface UseMapInitializationProps {
  isLoaded: boolean;
  mapRef: React.RefObject<HTMLDivElement>;
  userLocation: { lat: number; lng: number } | null;
}

export const useMapInitialization = ({ isLoaded, mapRef, userLocation }: UseMapInitializationProps) => {
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const center = userLocation || { lat: 44.0646, lng: 12.5736 }; // Rimini default

    try {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: center,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false, // Disabled on mobile
        zoomControl: false, // Disabled on mobile for touch gestures
        panControl: false, // Disabled pan control
        rotateControl: false, // Disabled rotate control
        scaleControl: false, // Disabled scale control
        gestureHandling: 'greedy', // Enable all touch gestures
        disableDefaultUI: true, // Disable all default UI controls
      });
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }, [isLoaded, userLocation, mapRef]);

  return mapInstanceRef.current;
};
