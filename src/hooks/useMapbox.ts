
import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Token Mapbox - in produzione dovrebbe essere in una variabile d'ambiente
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

export const useMapbox = (mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapboxError, setMapboxError] = useState<string | null>(null);
  const initAttempted = useRef(false);

  const cleanup = useCallback(() => {
    console.log('🧹 Cleanup mappa Mapbox');
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setMapLoaded(false);
    setLoading(true);
    setMapboxError(null);
  }, []);

  const initializeMap = useCallback(() => {
    // Evita inizializzazioni multiple
    if (initAttempted.current || !mapContainer.current || map.current) {
      console.log('🔄 Inizializzazione già tentata o container non disponibile');
      return;
    }

    initAttempted.current = true;
    console.log('🗺️ Inizializzazione Mapbox...');

    try {
      // Verifica token - controllo semplificato
      if (!MAPBOX_TOKEN || MAPBOX_TOKEN.length < 10) {
        throw new Error('Token Mapbox non valido o mancante');
      }

      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646], // Rimini
        zoom: 11,
        attributionControl: true,
        antialias: true,
        maxZoom: 18,
        minZoom: 8
      });

      // Aggiungi controlli di navigazione
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Event listeners
      map.current.on('load', () => {
        console.log('✅ Mappa Mapbox caricata con successo!');
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);

        // Forza resize dopo un breve delay
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      });

      map.current.on('error', (e) => {
        console.error('❌ Errore Mapbox:', e);
        setMapboxError('Errore di caricamento della mappa');
        setLoading(false);
        initAttempted.current = false;
      });

      map.current.on('style.load', () => {
        console.log('🎨 Stile mappa caricato');
      });

    } catch (error) {
      console.error('❌ Errore inizializzazione Mapbox:', error);
      setMapboxError(error instanceof Error ? error.message : 'Errore sconosciuto');
      setLoading(false);
      initAttempted.current = false;
    }
  }, [mapContainer]);

  const retry = useCallback(() => {
    console.log('🔄 Retry inizializzazione mappa...');
    initAttempted.current = false;
    cleanup();
    setTimeout(initializeMap, 1000);
  }, [cleanup, initializeMap]);

  useEffect(() => {
    console.log('🚀 Hook useMapbox montato');
    initializeMap();
    
    return () => {
      console.log('🛑 Hook useMapbox smontato');
      cleanup();
    };
  }, [initializeMap, cleanup]);

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    retry
  };
};
