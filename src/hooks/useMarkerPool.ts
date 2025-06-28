
import { useRef, useEffect } from 'react';
import { POI } from '@/types/poi';

interface UseMarkerPoolProps {
  map: google.maps.Map | null;
  validPOIs: (POI & { coordinates: { lat: number; lng: number } })[];
  poiIcon: google.maps.Icon | null;
  onMarkerClick: (poi: POI & { coordinates: { lat: number; lng: number } }, marker: google.maps.Marker) => void;
}

export const useMarkerPool = ({ map, validPOIs, poiIcon, onMarkerClick }: UseMarkerPoolProps) => {
  const markerPoolRef = useRef<Map<string, google.maps.Marker>>(new Map());

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

        // Add click listener
        marker.addListener('click', () => {
          onMarkerClick(poi, marker);
        });

        markerPoolRef.current.set(poi.id, marker);
      }

      // Show marker on map
      marker.setMap(map);
      marker.setVisible(true);
    });

  }, [map, validPOIs, poiIcon, onMarkerClick]);

  const clearMarkers = () => {
    markerPoolRef.current.forEach(marker => marker.setMap(null));
  };

  return { clearMarkers, markerCount: markerPoolRef.current.size };
};
