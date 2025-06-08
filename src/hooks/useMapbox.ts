
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const useMapbox = (mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapboxError, setMapboxError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    console.log('Initializing map...');
    
    const accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';
    
    try {
      mapboxgl.accessToken = accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646], // Rimini center
        zoom: 11,
        attributionControl: false
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapboxError('Errore di connessione a Mapbox. Verifica il token di accesso.');
        setLoading(false);
      });

      // Timeout per evitare caricamenti infiniti
      setTimeout(() => {
        if (!mapLoaded) {
          console.log('Map loading timeout');
          setMapboxError('Timeout di caricamento mappa. Verifica la connessione internet.');
          setLoading(false);
        }
      }, 15000);

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapboxError('Errore di inizializzazione mappa. Token Mapbox non valido.');
      setLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapLoaded]);

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    setMapboxError,
    setLoading
  };
};
