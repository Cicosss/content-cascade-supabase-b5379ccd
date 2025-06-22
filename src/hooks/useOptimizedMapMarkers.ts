
import { useRef, useEffect, useMemo } from 'react';
import { POI } from '@/types/poi';

interface UseOptimizedMapMarkersProps {
  map: any;
  pois: POI[];
  userLocation: { lat: number; lng: number } | null;
  onPOISelect: (poi: POI) => void;
}

export const useOptimizedMapMarkers = ({ map, pois, userLocation, onPOISelect }: UseOptimizedMapMarkersProps) => {
  const markersPoolRef = useRef<Map<string, any>>(new Map());
  const activeMarkersRef = useRef<Set<string>>(new Set());
  const userMarkerRef = useRef<any>(null);

  // Memoize POI marker icon to avoid recreation
  const poiMarkerIcon = useMemo(() => {
    if (!window.google?.maps) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#1e3a8a" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="16" r="4" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    };
  }, []);

  // Memoize user marker icon
  const userMarkerIcon = useMemo(() => {
    if (!window.google?.maps) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="3"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(24, 24),
      anchor: new window.google.maps.Point(12, 12)
    };
  }, []);

  // Optimized POI marker management
  useEffect(() => {
    if (!map || !window.google || !poiMarkerIcon) return;

    const currentPOIIds = new Set(pois.map(poi => poi.id));
    
    // Hide markers that are no longer needed
    activeMarkersRef.current.forEach(markerId => {
      if (!currentPOIIds.has(markerId)) {
        const marker = markersPoolRef.current.get(markerId);
        if (marker) {
          marker.setMap(null);
          activeMarkersRef.current.delete(markerId);
        }
      }
    });

    // Show/create markers for current POIs with coordinate validation
    pois.forEach(poi => {
      // Validate coordinates before creating marker
      if (!poi.latitude || !poi.longitude || 
          typeof poi.latitude !== 'number' || typeof poi.longitude !== 'number' ||
          isNaN(poi.latitude) || isNaN(poi.longitude)) {
        return; // Skip invalid coordinates
      }

      let marker = markersPoolRef.current.get(poi.id);
      
      if (!marker) {
        // Create new marker only if it doesn't exist
        marker = new window.google.maps.Marker({
          position: { lat: Number(poi.latitude), lng: Number(poi.longitude) },
          title: poi.name,
          icon: poiMarkerIcon
        });

        // Add click listener once
        marker.addListener('click', () => {
          onPOISelect(poi);
        });

        markersPoolRef.current.set(poi.id, marker);
      }

      // Show marker on map if not already active
      if (!activeMarkersRef.current.has(poi.id)) {
        marker.setMap(map);
        activeMarkersRef.current.add(poi.id);
      }
    });
  }, [map, pois, onPOISelect, poiMarkerIcon]);

  // Optimized user location marker management
  useEffect(() => {
    if (!map || !window.google || !userMarkerIcon) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = new window.google.maps.Marker({
          position: userLocation,
          title: 'La tua posizione',
          icon: userMarkerIcon
        });
      } else {
        userMarkerRef.current.setPosition(userLocation);
      }
      
      userMarkerRef.current.setMap(map);
      map.setCenter(userLocation);
    } else if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }
  }, [map, userLocation, userMarkerIcon]);

  // Cleanup function
  const clearAllMarkers = () => {
    markersPoolRef.current.forEach(marker => marker.setMap(null));
    activeMarkersRef.current.clear();
    
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }
  };

  return { clearAllMarkers };
};
