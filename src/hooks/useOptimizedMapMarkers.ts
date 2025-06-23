
import { useRef, useEffect, useMemo } from 'react';
import { POI } from '@/types/poi';
import { useMapSync } from '@/contexts/MapSyncContext';

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
  const { hoveredPOIId, selectedPOIId } = useMapSync();

  // Memoize marker icons
  const markerIcons = useMemo(() => {
    if (!window.google?.maps) return null;
    
    return {
      normal: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#1e3a8a" stroke="white" stroke-width="3"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 16)
      },
      highlighted: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="16" fill="#ef4444" stroke="white" stroke-width="4"/>
            <circle cx="20" cy="20" r="6" fill="white"/>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="scale"
              values="1;1.1;1"
              dur="1s"
              repeatCount="indefinite"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
      },
      selected: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="14" fill="#22c55e" stroke="white" stroke-width="3"/>
            <circle cx="18" cy="18" r="5" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(36, 36),
        anchor: new window.google.maps.Point(18, 18)
      },
      user: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="3"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: new window.google.maps.Point(12, 12)
      }
    };
  }, []);

  // Coordinate validation function
  const validateCoordinates = (lat: any, lng: any): { lat: number; lng: number } | null => {
    const numLat = typeof lat === 'string' ? parseFloat(lat) : Number(lat);
    const numLng = typeof lng === 'string' ? parseFloat(lng) : Number(lng);
    
    if (isNaN(numLat) || isNaN(numLng)) {
      return null;
    }
    
    return { lat: numLat, lng: numLng };
  };

  // Update marker icons based on hover/selection state
  useEffect(() => {
    if (!markerIcons) return;

    markersPoolRef.current.forEach((marker, poiId) => {
      let icon = markerIcons.normal;
      
      if (poiId === selectedPOIId) {
        icon = markerIcons.selected;
      } else if (poiId === hoveredPOIId) {
        icon = markerIcons.highlighted;
      }
      
      marker.setIcon(icon);
    });
  }, [hoveredPOIId, selectedPOIId, markerIcons]);

  // POI marker management
  useEffect(() => {
    if (!map || !window.google || !markerIcons) {
      return;
    }

    console.log('🗺️ Aggiornamento markers per', pois.length, 'POI');

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

    let validMarkersCount = 0;

    // Show/create markers for current POIs
    pois.forEach(poi => {
      const coordinates = validateCoordinates(poi.latitude, poi.longitude);
      
      if (!coordinates) {
        console.warn('🗺️ Saltando POI con coordinate non valide:', poi.name);
        return;
      }

      let marker = markersPoolRef.current.get(poi.id);
      
      if (!marker) {
        // Determine initial icon state
        let initialIcon = markerIcons.normal;
        if (poi.id === selectedPOIId) {
          initialIcon = markerIcons.selected;
        } else if (poi.id === hoveredPOIId) {
          initialIcon = markerIcons.highlighted;
        }

        marker = new window.google.maps.Marker({
          position: coordinates,
          title: poi.name,
          icon: initialIcon
        });

        // Add click listener
        marker.addListener('click', () => {
          console.log('🗺️ Click su marker:', poi.name);
          onPOISelect(poi);
        });

        markersPoolRef.current.set(poi.id, marker);
      }

      // Show marker on map
      if (!activeMarkersRef.current.has(poi.id)) {
        marker.setMap(map);
        activeMarkersRef.current.add(poi.id);
        validMarkersCount++;
      }
    });

    console.log('🗺️ Markers attivi:', validMarkersCount);

  }, [map, pois, onPOISelect, markerIcons, selectedPOIId, hoveredPOIId]);

  // User location marker management
  useEffect(() => {
    if (!map || !window.google || !markerIcons) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = new window.google.maps.Marker({
          position: userLocation,
          title: 'La tua posizione',
          icon: markerIcons.user
        });
      } else {
        userMarkerRef.current.setPosition(userLocation);
      }
      
      userMarkerRef.current.setMap(map);
    } else if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }
  }, [map, userLocation, markerIcons]);

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
