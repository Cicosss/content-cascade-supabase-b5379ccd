
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

  // Memoize POI marker icon to avoid recreation - MIGLIORATO per visibilità
  const poiMarkerIcon = useMemo(() => {
    if (!window.google?.maps) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="16" fill="#1e3a8a" stroke="white" stroke-width="4"/>
          <circle cx="20" cy="20" r="6" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20),
      zIndex: 1000 // Z-index esplicito per garantire visibilità
    };
  }, []);

  // Memoize user marker icon
  const userMarkerIcon = useMemo(() => {
    if (!window.google?.maps) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="10" fill="#EF4444" stroke="white" stroke-width="4"/>
          <circle cx="14" cy="14" r="4" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(28, 28),
      anchor: new window.google.maps.Point(14, 14),
      zIndex: 999 // Z-index per utente
    };
  }, []);

  // Funzione di validazione coordinate migliorata
  const validateCoordinates = (lat: any, lng: any): { lat: number; lng: number } | null => {
    console.log('🗺️ Validazione coordinate:', { lat, lng, latType: typeof lat, lngType: typeof lng });
    
    // Converti esplicitamente in numeri
    const numLat = typeof lat === 'string' ? parseFloat(lat) : Number(lat);
    const numLng = typeof lng === 'string' ? parseFloat(lng) : Number(lng);
    
    console.log('🗺️ Coordinate convertite:', { numLat, numLng });
    
    // Validazione più permissiva - controlla solo che siano numeri validi
    if (isNaN(numLat) || isNaN(numLng)) {
      console.warn('⚠️ Coordinate non valide (NaN):', { lat, lng, numLat, numLng });
      return null;
    }
    
    // Controllo range geografico ragionevole per l'Italia
    if (numLat < 35 || numLat > 47 || numLng < 6 || numLng > 19) {
      console.warn('⚠️ Coordinate fuori dal range Italia:', { numLat, numLng });
      // Non ritorniamo null, ma le coordinate originali se sono numeri validi
      // Potrebbe essere un POI in altra zona geografica
    }
    
    return { lat: numLat, lng: numLng };
  };

  // Optimized POI marker management - MIGLIORATO per debug
  useEffect(() => {
    if (!map || !window.google || !poiMarkerIcon) {
      console.log('🗺️ Markers: Condizioni non soddisfatte:', { 
        map: !!map, 
        google: !!window.google, 
        icon: !!poiMarkerIcon 
      });
      return;
    }

    console.log('🗺️ Aggiornamento markers per', pois.length, 'POI');
    console.log('🗺️ Marker Debug: Mappa bounds:', map.getBounds()?.toString());
    console.log('🗺️ Marker Debug: Centro mappa:', map.getCenter()?.toString());

    const currentPOIIds = new Set(pois.map(poi => poi.id));
    
    // Hide markers that are no longer needed
    activeMarkersRef.current.forEach(markerId => {
      if (!currentPOIIds.has(markerId)) {
        const marker = markersPoolRef.current.get(markerId);
        if (marker) {
          console.log('🗺️ Nascondendo marker:', markerId);
          marker.setMap(null);
          activeMarkersRef.current.delete(markerId);
        }
      }
    });

    let validMarkersCount = 0;
    let invalidMarkersCount = 0;
    let newMarkersCreated = 0;

    // Show/create markers for current POIs with coordinate validation
    pois.forEach(poi => {
      const coordinates = validateCoordinates(poi.latitude, poi.longitude);
      
      if (!coordinates) {
        console.warn('🗺️ Saltando POI con coordinate non valide:', {
          id: poi.id,
          name: poi.name,
          lat: poi.latitude,
          lng: poi.longitude
        });
        invalidMarkersCount++;
        return;
      }

      let marker = markersPoolRef.current.get(poi.id);
      
      if (!marker) {
        console.log('🗺️ Creando nuovo marker per:', poi.name, coordinates);
        
        // Create new marker only if it doesn't exist
        marker = new window.google.maps.Marker({
          position: coordinates,
          title: poi.name,
          icon: poiMarkerIcon,
          zIndex: 1000, // Z-index esplicito
          clickable: true,
          visible: true
        });

        // Add click listener once
        marker.addListener('click', () => {
          console.log('🗺️ Click su marker:', poi.name);
          onPOISelect(poi);
        });

        markersPoolRef.current.set(poi.id, marker);
        newMarkersCreated++;
      }

      // Show marker on map if not already active
      if (!activeMarkersRef.current.has(poi.id)) {
        console.log('🗺️ Mostrando marker sulla mappa:', poi.name);
        marker.setMap(map);
        marker.setVisible(true); // Forza visibilità
        activeMarkersRef.current.add(poi.id);
        validMarkersCount++;
      }
    });

    console.log('🗺️ RIEPILOGO MARKER COMPLETO:', {
      totaliPOI: pois.length,
      markersValidi: validMarkersCount,
      markersNonValidi: invalidMarkersCount,
      markersAttivi: activeMarkersRef.current.size,
      nuoviMarkerCreati: newMarkersCreated,
      mappaPresente: !!map,
      googleAPIPresente: !!window.google.maps,
      iconPresente: !!poiMarkerIcon
    });

    // TEST: Forza un refresh della mappa dopo aver aggiunto i marker
    if (validMarkersCount > 0) {
      setTimeout(() => {
        console.log('🗺️ Forzando refresh mappa per visibilità marker');
        // Trigger a small map refresh
        const currentZoom = map.getZoom();
        map.setZoom(currentZoom);
      }, 100);
    }

  }, [map, pois, onPOISelect, poiMarkerIcon]);

  // Optimized user location marker management
  useEffect(() => {
    if (!map || !window.google || !userMarkerIcon) return;

    if (userLocation) {
      console.log('🗺️ Aggiornando posizione utente:', userLocation);
      
      if (!userMarkerRef.current) {
        userMarkerRef.current = new window.google.maps.Marker({
          position: userLocation,
          title: 'La tua posizione',
          icon: userMarkerIcon,
          zIndex: 999
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
    console.log('🗺️ Pulizia di tutti i markers');
    markersPoolRef.current.forEach(marker => marker.setMap(null));
    activeMarkersRef.current.clear();
    
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }
  };

  return { clearAllMarkers };
};
