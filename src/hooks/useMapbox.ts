
import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

export const useMapbox = (mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapboxError, setMapboxError] = useState<string | null>(null);
  const initialized = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  const cleanup = useCallback(() => {
    if (map.current) {
      console.log('🧹 Pulizia mappa Mapbox...');
      map.current.remove();
      map.current = null;
    }
    initialized.current = false;
    setMapLoaded(false);
    setLoading(true);
    setMapboxError(null);
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current || initialized.current) {
      return;
    }

    if (retryCount.current >= maxRetries) {
      setMapboxError('Troppi tentativi falliti. Ricarica la pagina.');
      setLoading(false);
      return;
    }

    initialized.current = true;
    console.log(`🔄 Inizializzazione mappa Mapbox (tentativo ${retryCount.current + 1})...`);

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646],
        zoom: 11,
        attributionControl: true,
        antialias: true,
        maxZoom: 18,
        minZoom: 8
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('✅ Mappa caricata con successo!');
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);
        retryCount.current = 0;

        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      });

      map.current.on('error', (e) => {
        console.error('❌ Errore mappa:', e);
        retryCount.current++;
        setMapboxError(`Errore di caricamento mappa (${retryCount.current}/${maxRetries})`);
        setLoading(false);
        initialized.current = false;
      });

    } catch (error) {
      console.error('❌ Errore inizializzazione mappa:', error);
      retryCount.current++;
      setMapboxError(`Errore inizializzazione (${retryCount.current}/${maxRetries})`);
      setLoading(false);
      initialized.current = false;
    }
  }, [mapContainer]);

  useEffect(() => {
    initializeMap();
    return cleanup;
  }, [initializeMap, cleanup]);

  const retry = useCallback(() => {
    console.log('🔄 Retry mappa...');
    cleanup();
    setTimeout(initializeMap, 1000);
  }, [cleanup, initializeMap]);

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    retry
  };
};
