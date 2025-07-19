
import { useRef, useEffect, useState } from 'react';

interface UseUserLocationMarkerProps {
  map: google.maps.Map | null;
  userLocation: { lat: number; lng: number } | null;
  userIcon: google.maps.Icon | null;
}

export const useUserLocationMarker = ({ map, userLocation, userIcon }: UseUserLocationMarkerProps) => {
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);

  // Manage user location marker
  useEffect(() => {
    if (!map || !window.google?.maps || !userIcon) return;

    if (userLocation) {
      console.log('📍 Aggiornamento marker posizione utente:', userLocation);
      
      if (!userMarkerRef.current) {
        // Crea nuovo marker per l'utente
        userMarkerRef.current = new google.maps.Marker({
          position: userLocation,
          title: 'La tua posizione GPS',
          icon: userIcon,
          map: map,
          zIndex: 1000, // Assicura che sia sopra gli altri marker
          animation: google.maps.Animation.DROP // Animazione di drop
        });

        // Crea InfoWindow per mostrare dettagli
        infoWindowRef.current = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">📍 La tua posizione</h4>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Lat: ${userLocation.lat.toFixed(6)}<br/>
                Lng: ${userLocation.lng.toFixed(6)}
              </p>
              <p style="margin: 8px 0 0 0; color: #059669; font-size: 11px;">
                ✅ GPS attivo
              </p>
            </div>
          `
        });

        // Aggiungi click listener per aprire InfoWindow
        userMarkerRef.current.addListener('click', () => {
          if (infoWindowRef.current && userMarkerRef.current) {
            infoWindowRef.current.open(map, userMarkerRef.current);
          }
        });

        setIsMarkerVisible(true);
        console.log('✅ Marker utente creato alla posizione:', userLocation);
      } else {
        // Aggiorna posizione del marker esistente
        userMarkerRef.current.setPosition(userLocation);
        userMarkerRef.current.setMap(map);
        
        // Aggiorna contenuto InfoWindow
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="padding: 8px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">📍 La tua posizione</h4>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Lat: ${userLocation.lat.toFixed(6)}<br/>
                Lng: ${userLocation.lng.toFixed(6)}
              </p>
              <p style="margin: 8px 0 0 0; color: #059669; font-size: 11px;">
                ✅ GPS attivo
              </p>
            </div>
          `);
        }
        
        console.log('🔄 Marker utente aggiornato alla posizione:', userLocation);
      }
    } else if (userMarkerRef.current) {
      // Nasconde il marker se non c'è posizione
      userMarkerRef.current.setMap(null);
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      setIsMarkerVisible(false);
      console.log('🫥 Marker utente nascosto - nessuna posizione GPS');
    }
  }, [map, userLocation, userIcon]);

  const clearUserMarker = () => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
    setIsMarkerVisible(false);
    console.log('🗑️ Marker utente rimosso');
  };

  return { 
    clearUserMarker, 
    userMarker: userMarkerRef.current,
    isMarkerVisible
  };
};
