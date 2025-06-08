
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
  const initialized = useRef(false);

  // Cleanup stabile - non cambia mai
  const cleanup = useCallback(() => {
    console.log('🧹 Cleanup mappa Mapbox');
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setMapLoaded(false);
    setLoading(true);
    setMapboxError(null);
    initialized.current = false;
  }, []);

  // Test di connettività Mapbox
  const testMapboxConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${MAPBOX_TOKEN}`);
      return response.ok;
    } catch (error) {
      console.error('❌ Test connettività Mapbox fallito:', error);
      return false;
    }
  }, []);

  // Inizializzazione mappa stabile
  const initializeMap = useCallback(async () => {
    if (initialized.current || !mapContainer.current || map.current) {
      return;
    }

    initialized.current = true;
    console.log('🗺️ Inizializzazione Mapbox...');
    setLoading(true);
    setMapboxError(null);

    try {
      // Verifica token
      if (!MAPBOX_TOKEN || MAPBOX_TOKEN.length < 50) {
        throw new Error('Token Mapbox non valido o mancante');
      }

      // Test connettività
      console.log('🔍 Test connettività Mapbox...');
      const isConnected = await testMapboxConnection();
      if (!isConnected) {
        throw new Error('Impossibile connettersi ai server Mapbox');
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
        minZoom: 8,
        preserveDrawingBuffer: true
      });

      // Controlli di navigazione
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Event listeners
      map.current.on('load', () => {
        console.log('✅ Mappa Mapbox caricata con successo!');
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);

        // Resize dopo caricamento
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      });

      map.current.on('error', (e) => {
        console.error('❌ Errore Mapbox:', e.error);
        setMapboxError(`Errore mappa: ${e.error?.message || 'Errore sconosciuto'}`);
        setLoading(false);
        initialized.current = false;
      });

      map.current.on('style.load', () => {
        console.log('🎨 Stile mappa caricato');
      });

    } catch (error) {
      console.error('❌ Errore inizializzazione Mapbox:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      setMapboxError(errorMessage);
      setLoading(false);
      initialized.current = false;
    }
  }, [mapContainer, testMapboxConnection]);

  // Retry con backoff
  const retry = useCallback(() => {
    console.log('🔄 Retry inizializzazione mappa...');
    cleanup();
    setTimeout(() => {
      initializeMap();
    }, 2000);
  }, [cleanup, initializeMap]);

  // Effetto di inizializzazione - una sola volta
  useEffect(() => {
    console.log('🚀 Hook useMapbox montato');
    initializeMap();
    
    return cleanup;
  }, [initializeMap, cleanup]);

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    retry
  };
};
