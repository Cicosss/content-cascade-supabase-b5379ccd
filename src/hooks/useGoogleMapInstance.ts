
import { useRef, useEffect } from 'react';

interface UseGoogleMapInstanceProps {
  isLoaded: boolean;
  mapRef: React.RefObject<HTMLDivElement>;
  userLocation: { lat: number; lng: number } | null;
}

export const useGoogleMapInstance = ({ isLoaded, mapRef, userLocation }: UseGoogleMapInstanceProps) => {
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const center = userLocation || { lat: 44.0646, lng: 12.5736 }; // Rimini default

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
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
      fullscreenControl: true,
      zoomControl: true,
    });

    console.log('🗺️ Google Maps inizializzata');
  }, [isLoaded, userLocation, mapRef]);

  return mapInstanceRef.current;
};
