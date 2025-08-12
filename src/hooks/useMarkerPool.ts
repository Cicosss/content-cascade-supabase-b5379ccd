
import { useRef, useEffect } from 'react';
import { POI } from '@/types/poi';

interface UseMarkerPoolProps {
  map: google.maps.Map | null;
  validPOIs: (POI & { coordinates: { lat: number; lng: number } })[];
  poiIcon?: google.maps.Icon;
  onPOISelect: (poi: POI & { coordinates: { lat: number; lng: number } }) => void;
}

export const useMarkerPool = ({ map, validPOIs, poiIcon, onPOISelect }: UseMarkerPoolProps) => {
  const markerPoolRef = useRef<Map<string, google.maps.Marker>>(new Map());

  // Manage POI markers with efficient pooling
  useEffect(() => {
    if (!map || !window.google?.maps) {
      console.log('⚠️ Marker pool skipped - missing requirements:', { 
        hasMap: !!map, 
        hasGoogleMaps: !!window.google?.maps,
        mapType: map ? map.constructor.name : 'null'
      });
      return;
    }

    // Validate map via feature detection to avoid instanceof issues (iframes/versions)
    const hasMapShape = !!map &&
      typeof (map as any).getBounds === 'function' &&
      typeof (map as any).addListener === 'function';
    if (!hasMapShape) {
      console.error('❌ Invalid map-like instance provided to marker pool:', {
        mapType: map ? (map as any).constructor?.name : 'null',
      });
      return;
    }

    // Ensure markers exist for current POIs and keep icon in sync
    validPOIs.forEach(poi => {
      let marker = markerPoolRef.current.get(poi.id);

      if (!marker) {
        // Create new marker only if it doesn't exist
        const options: google.maps.MarkerOptions = {
          position: poi.coordinates,
          title: poi.name,
          map: null // Don't add to map yet
        };
        if (poiIcon) options.icon = poiIcon; // Use custom icon if available

        marker = new google.maps.Marker(options);

        // Add click listener - directly call onPOISelect
        marker.addListener('click', () => {
          onPOISelect(poi);
        });

        markerPoolRef.current.set(poi.id, marker);
      } else if (poiIcon) {
        // Keep marker icon in sync when icon becomes available/changes
        try {
          marker.setIcon(poiIcon);
        } catch (e) {
          console.warn('⚠️ Failed to set custom icon, using default marker for POI:', poi.name);
        }
      }

      // Attach marker to map (visibility handled below)
      try {
        marker.setMap(map);
      } catch (error) {
        console.error('❌ Failed to set marker on map for POI:', poi.name, error);
      }
    });

    // Keep marker visibility in sync with current map bounds and movements
    try {
      const updateVisibility = () => {
        try {
          const bounds = map.getBounds();
          markerPoolRef.current.forEach((marker) => {
            const pos = marker.getPosition();
            const isVisible = !!(pos && bounds?.contains(pos));
            marker.setVisible(isVisible);
          });
        } catch (e) {
          console.error('❌ Failed to update marker visibility based on bounds:', e);
        }
      };

      // Initial visibility update
      updateVisibility();

      // Listen for bounds changes to update visibility during pan/zoom
      const boundsListener = map.addListener('bounds_changed', updateVisibility);

      // Cleanup listener on deps change/unmount
      return () => {
        boundsListener?.remove();
      };
    } catch (error) {
      console.error('❌ Failed to attach bounds_changed listener:', error);
    }

  }, [map, validPOIs, poiIcon, onPOISelect]);

  const clearMarkers = () => {
    markerPoolRef.current.forEach(marker => marker.setMap(null));
  };

  return { clearMarkers, markerCount: markerPoolRef.current.size };
};
