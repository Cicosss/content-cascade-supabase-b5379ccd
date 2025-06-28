
import { useRef, useEffect, useMemo } from 'react';
import { POI } from '@/types/poi';

interface UseOptimizedMarkerPoolProps {
  map: google.maps.Map | null;
  pois: POI[];
  userLocation: { lat: number; lng: number } | null;
  onPOISelect: (poi: POI) => void;
}

export const useOptimizedMarkerPool = ({ 
  map, 
  pois, 
  userLocation, 
  onPOISelect 
}: UseOptimizedMarkerPoolProps) => {
  const markerPoolRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  // Memoized icon configurations
  const poiIcon = useMemo(() => {
    if (!window.google?.maps) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#1e3a8a" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="16" r="5" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16),
    };
  }, []);

  const userIcon = useMemo(() => {
    if (!window.google?.maps) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="3"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(24, 24),
      anchor: new window.google.maps.Point(12, 12),
    };
  }, []);

  // Memoized POI coordinates for validation
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

  // Manage POI markers with efficient pooling
  useEffect(() => {
    if (!map || !window.google?.maps || !poiIcon) return;

    const currentPOIIds = new Set(validPOIs.map(poi => poi.id));
    
    // Hide markers no longer needed
    markerPoolRef.current.forEach((marker, poiId) => {
      if (!currentPOIIds.has(poiId)) {
        marker.setVisible(false);
      }
    });

    // Show/create markers for current POIs
    validPOIs.forEach(poi => {
      let marker = markerPoolRef.current.get(poi.id);
      
      if (!marker) {
        // Create new marker only if doesn't exist
        marker = new google.maps.Marker({
          position: poi.coordinates,
          title: poi.name,
          icon: poiIcon,
          map: null // Don't add to map yet
        });

        // Add click listener with InfoWindow
        marker.addListener('click', () => {
          if (infoWindowRef.current) {
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
          }
          onPOISelect(poi);
        });

        markerPoolRef.current.set(poi.id, marker);
      }

      // Show marker on map
      marker.setMap(map);
      marker.setVisible(true);
    });

    // Setup global handlers for InfoWindow buttons
    (window as any).poiPreviewHandler = (poiId: string) => {
      const poi = validPOIs.find(p => p.id === poiId);
      if (poi) onPOISelect(poi);
    };

    (window as any).poiDirectionsHandler = (lat: string, lng: string) => {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(mapsUrl, '_blank');
    };

  }, [map, validPOIs, onPOISelect, poiIcon]);

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

  const clearAllMarkers = () => {
    markerPoolRef.current.forEach(marker => marker.setMap(null));
    if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    if (infoWindowRef.current) infoWindowRef.current.close();
  };

  return { 
    clearAllMarkers,
    markerCount: markerPoolRef.current.size,
    validPOICount: validPOIs.length
  };
};
