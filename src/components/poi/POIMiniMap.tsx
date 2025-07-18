
import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';

interface POIMiniMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const POIMiniMap: React.FC<POIMiniMapProps> = ({ latitude, longitude, name }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { isLoaded } = useGoogleMapsLoader();

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const position = { lat: latitude, lng: longitude };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: position,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    new window.google.maps.Marker({
      position: position,
      map: mapInstanceRef.current,
      title: name,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30S24 21 24 12C24 5.37 18.63 0 12 0ZM12 16.2C9.51 16.2 7.5 14.19 7.5 11.7C7.5 9.21 9.51 7.2 12 7.2C14.49 7.2 16.5 9.21 16.5 11.7C16.5 14.19 14.49 16.2 12 16.2Z" fill="#3B82F6"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 30),
        anchor: new window.google.maps.Point(12, 30)
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded, latitude, longitude, name]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="border-t pt-4">
      <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-600" />
        Posizione
      </h4>
      <div 
        ref={mapRef} 
        className="w-full h-32 rounded-lg border border-gray-200 mb-3"
        style={{ minHeight: '128px' }}
      />
      <a 
        href={googleMapsUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        title="Apri in Google Maps per le indicazioni"
      >
        <Button variant="outline" className="w-full">
          <Navigation className="h-4 w-4 mr-2" />
          Ottieni Indicazioni
        </Button>
      </a>
    </div>
  );
};

export default POIMiniMap;
