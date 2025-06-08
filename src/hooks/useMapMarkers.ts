
import { useRef, useCallback, useEffect } from 'react';
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
  userLocation: {lat: number; lng: number} | null;
}

export const useMapMarkers = ({ map, pois, onPOISelect, userLocation }: UseMapMarkersProps) => {
  const poiMarkers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);

  const clearAllMarkers = useCallback(() => {
    poiMarkers.current.forEach(marker => marker.remove());
    poiMarkers.current = [];
    
    if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }
  }, []);

  const addUserLocationMarker = useCallback(() => {
    if (!map || !userLocation) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'w-6 h-6 bg-blue-500 border-3 border-white rounded-full shadow-lg animate-pulse';

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map);

    console.log('📍 User marker aggiunto:', userLocation);
  }, [map, userLocation]);

  const addPOIMarkers = useCallback(() => {
    if (!map || pois.length === 0) return;

    // Rimuovi marker POI esistenti
    poiMarkers.current.forEach(marker => marker.remove());
    poiMarkers.current = [];

    pois.forEach(poi => {
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
      
      poiMarkers.current.push(marker);
    });

    console.log('📍 Aggiunti', pois.length, 'POI markers');
  }, [map, pois, onPOISelect]);

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

  // Auto-aggiorna user marker quando cambia la posizione
  useEffect(() => {
    addUserLocationMarker();
  }, [addUserLocationMarker]);

  // Auto-aggiorna POI markers quando cambiano i POI
  useEffect(() => {
    addPOIMarkers();
  }, [addPOIMarkers]);

  return {
    clearAllMarkers
  };
};
