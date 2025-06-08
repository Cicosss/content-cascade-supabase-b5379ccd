
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

  // Funzione per ottenere l'icona del POI
  const getPoiIcon = useCallback((category: string) => {
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
  }, []);

  // Pulizia marker - funzione stabile
  const clearAllMarkers = useCallback(() => {
    console.log('🧹 Pulizia marker');
    poiMarkers.current.forEach(marker => marker.remove());
    poiMarkers.current = [];
    
    if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }
  }, []);

  // Aggiunta marker utente - stabile
  const addUserLocationMarker = useCallback(() => {
    if (!map || !userLocation) return;

    console.log('📍 Aggiunta marker utente:', userLocation);

    // Rimuovi marker precedente
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Crea nuovo marker utente
    const el = document.createElement('div');
    el.className = 'w-6 h-6 bg-blue-500 border-3 border-white rounded-full shadow-lg animate-pulse';

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map);

  }, [map, userLocation]);

  // Aggiunta marker POI - stabile
  const addPOIMarkers = useCallback(() => {
    if (!map || pois.length === 0) return;

    console.log('📍 Aggiunta', pois.length, 'POI markers');

    // Rimuovi marker POI esistenti
    poiMarkers.current.forEach(marker => marker.remove());
    poiMarkers.current = [];

    // Aggiungi nuovi marker POI
    pois.forEach(poi => {
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-white border-2 border-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform';
      el.innerHTML = getPoiIcon(poi.category);
      el.title = poi.name;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([poi.longitude, poi.latitude])
        .addTo(map);

      // Event listener per il click
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('🎯 POI selezionato:', poi.name);
        onPOISelect(poi);
        map.flyTo({
          center: [poi.longitude, poi.latitude],
          zoom: 16,
          duration: 1500
        });
      });
      
      poiMarkers.current.push(marker);
    });
  }, [map, pois, onPOISelect, getPoiIcon]);

  // Effetti per aggiornare i marker
  useEffect(() => {
    addUserLocationMarker();
  }, [addUserLocationMarker]);

  useEffect(() => {
    addPOIMarkers();
  }, [addPOIMarkers]);

  return {
    clearAllMarkers
  };
};
