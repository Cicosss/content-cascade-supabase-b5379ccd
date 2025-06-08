
import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface POI {
  id: string;
  name: string;
  description: string;
  poi_type: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  target_audience: string;
}

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  pois: POI[];
  onPOISelect: (poi: POI) => void;
}

export const useMapMarkers = ({ map, pois, onPOISelect }: UseMapMarkersProps) => {
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);

  const addUserLocationMarker = useCallback((location: {lat: number; lng: number}) => {
    if (!map) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'w-6 h-6 bg-blue-500 border-3 border-white rounded-full shadow-lg animate-pulse';

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    console.log('📍 User marker added at:', location);
  }, [map]);

  const addPOIMarkers = useCallback((poisData: POI[]) => {
    if (!map) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    poisData.forEach(poi => {
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-white border-2 border-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform';
      el.innerHTML = getPoiIcon(poi.category);
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([poi.longitude, poi.latitude])
        .addTo(map);

      el.addEventListener('click', () => {
        onPOISelect(poi);
        map.flyTo({
          center: [poi.longitude, poi.latitude],
          zoom: 16,
          duration: 1500
        });
      });
      
      markers.current.push(marker);
    });

    console.log('📍 Added', poisData.length, 'POI markers');
  }, [map, onPOISelect]);

  const getPoiIcon = (category: string) => {
    const icons: Record<string, string> = {
      'cibo': '🍽️',
      'arte e cultura': '🏛️',
      'sport': '⚽',
      'musica': '🎵',
      'parchi e natura': '🌳',
      'vita notturna': '🌙',
      'intrattenimento': '🎭'
    };
    return icons[category] || '📍';
  };

  return {
    addUserLocationMarker,
    addPOIMarkers
  };
};
