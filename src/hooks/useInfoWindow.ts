
import { useRef, useEffect } from 'react';
import { POI } from '@/types/poi';

interface UseInfoWindowProps {
  map: google.maps.Map | null;
  onPOISelect: (poi: POI) => void;
}

export const useInfoWindow = ({ map, onPOISelect }: UseInfoWindowProps) => {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Initialize singleton InfoWindow
  useEffect(() => {
    if (!map || !window.google?.maps) return;

    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow({
        maxWidth: 300,
        pixelOffset: new google.maps.Size(0, -10)
      });
    }
  }, [map]);

  const showInfoWindow = (poi: POI & { coordinates: { lat: number; lng: number } }, marker: google.maps.Marker) => {
    if (!infoWindowRef.current || !map) return;

    const content = `
      <div style="padding: 12px; max-width: 280px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1e3a8a;">
          ${poi.name}
        </h3>
        ${poi.description ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.4;">${poi.description.substring(0, 120)}${poi.description.length > 120 ? '...' : ''}</p>` : ''}
        <div style="display: flex; justify-content: space-between; margin-top: 12px;">
          <button onclick="window.poiPreviewHandler('${poi.id}')" style="background: #1e3a8a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;">
            Scopri di più
          </button>
          <button onclick="window.poiDirectionsHandler('${poi.latitude}', '${poi.longitude}')" style="background: white; color: #1e3a8a; border: 2px solid #1e3a8a; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;">
            Indicazioni
          </button>
        </div>
      </div>
    `;
    
    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(map, marker);
    onPOISelect(poi);
  };

  const setupGlobalHandlers = (validPOIs: (POI & { coordinates: { lat: number; lng: number } })[]) => {
    // Setup global handlers for InfoWindow buttons
    (window as any).poiPreviewHandler = (poiId: string) => {
      const poi = validPOIs.find(p => p.id === poiId);
      if (poi) onPOISelect(poi);
    };

    (window as any).poiDirectionsHandler = (lat: string, lng: string) => {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(mapsUrl, '_blank');
    };
  };

  const closeInfoWindow = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  return { showInfoWindow, setupGlobalHandlers, closeInfoWindow };
};
