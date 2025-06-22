
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface POILocationMapProps {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

const POILocationMap: React.FC<POILocationMapProps> = ({
  latitude,
  longitude,
  name,
  address
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const position = { lat: latitude, lng: longitude };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
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

      // Add marker
      const marker = new window.google.maps.Marker({
        position: position,
        map: mapInstanceRef.current,
        title: name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0ZM16 21.6C13.02 21.6 10.6 19.18 10.6 16.2C10.6 13.22 13.02 10.8 16 10.8C18.98 10.8 21.4 13.22 21.4 16.2C21.4 19.18 18.98 21.6 16 21.6Z" fill="#3B82F6"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 40),
          anchor: new window.google.maps.Point(16, 40)
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${name}</h3>
            ${address ? `<p style="margin: 0; color: #666; font-size: 12px;">${address}</p>` : ''}
          </div>
        `
      });

      // Open info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });
    };

    loadGoogleMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, name, address]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Posizione
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-b-xl"
          style={{ minHeight: '256px' }}
        />
      </CardContent>
    </Card>
  );
};

export default POILocationMap;
