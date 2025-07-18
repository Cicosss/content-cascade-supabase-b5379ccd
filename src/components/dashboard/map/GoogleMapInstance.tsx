import React, { useRef, useEffect, memo } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useMapContext } from '@/contexts/MapContext';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { Loader2 } from 'lucide-react';

interface GoogleMapInstanceProps {
  className?: string;
}

const GoogleMapInstance: React.FC<GoogleMapInstanceProps> = memo(({ className = "w-full h-full rounded-xl" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { userLocation } = useLocation();
  const { setMapInstance, mapInstance } = useMapContext();
  const { isLoaded, error } = useGoogleMapsLoader();

  // Initialize map when loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstance) return;

    const center = userLocation || { lat: 44.0646, lng: 12.5736 }; // Rimini default

    try {
      const map = new google.maps.Map(mapRef.current, {
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

      setMapInstance(map);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }, [isLoaded, userLocation, mapInstance, setMapInstance]);

  // Error state
  if (error) {
    return (
      <div className={`h-full flex items-center justify-center bg-slate-50 rounded-xl ${className}`}>
        <div className="text-center">
          <p className="text-red-600 mb-2">Errore caricamento mappa</p>
          <p className="text-slate-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className={`h-full flex items-center justify-center bg-slate-50 rounded-xl ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
});

GoogleMapInstance.displayName = 'GoogleMapInstance';

export default GoogleMapInstance;