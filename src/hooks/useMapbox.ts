
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

  console.log('🔍 useMapbox: Hook inizializzato', {
    hasContainer: !!mapContainer.current,
    hasMap: !!map.current,
    mapLoaded,
    loading,
    error: mapboxError,
    initialized: initialized.current
  });

  // Cleanup function - stabile
  const cleanup = useCallback(() => {
    console.log('🧹 Cleanup mappa Mapbox');
    if (map.current) {
      try {
        map.current.remove();
        console.log('✅ Mappa rimossa con successo');
      } catch (error) {
        console.error('❌ Errore durante cleanup:', error);
      }
      map.current = null;
    }
    setMapLoaded(false);
    setLoading(true);
    setMapboxError(null);
    initialized.current = false;
  }, []);

  // Test connettività Mapbox - stabile
  const testMapboxConnection = useCallback(async (): Promise<boolean> => {
    console.log('🔍 Test connettività Mapbox...');
    try {
      const testUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${MAPBOX_TOKEN}`;
      console.log('📡 URL test:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('📡 Risposta test connettività:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Risposta negativa da Mapbox:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Test connettività Mapbox riuscito:', data);
      return true;
    } catch (error) {
      console.error('❌ Test connettività Mapbox fallito:', error);
      return false;
    }
  }, []);

  // Inizializzazione mappa - stabile
  const initializeMap = useCallback(async () => {
    console.log('🚀 Tentativo inizializzazione mappa...', {
      initialized: initialized.current,
      hasContainer: !!mapContainer.current,
      hasMap: !!map.current
    });

    if (initialized.current || !mapContainer.current || map.current) {
      console.log('⏭️ Inizializzazione saltata:', {
        initialized: initialized.current,
        hasContainer: !!mapContainer.current,
        hasMap: !!map.current
      });
      return;
    }

    initialized.current = true;
    console.log('🗺️ Inizializzazione Mapbox in corso...');
    setLoading(true);
    setMapboxError(null);

    try {
      // Verifica token
      console.log('🔑 Verifica token Mapbox...');
      if (!MAPBOX_TOKEN) {
        throw new Error('Token Mapbox mancante');
      }
      if (MAPBOX_TOKEN.length < 50) {
        throw new Error('Token Mapbox non valido (troppo corto)');
      }
      if (!MAPBOX_TOKEN.startsWith('pk.')) {
        throw new Error('Token Mapbox non valido (formato errato)');
      }
      console.log('✅ Token Mapbox valido');

      // Test connettività
      console.log('🔍 Test connettività Mapbox...');
      const isConnected = await testMapboxConnection();
      if (!isConnected) {
        throw new Error('Impossibile connettersi ai server Mapbox - verifica la connessione internet');
      }
      console.log('✅ Connettività Mapbox OK');

      // Imposta token globale
      console.log('🔑 Impostazione token globale Mapbox...');
      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Verifica supporto WebGL
      if (!mapboxgl.supported()) {
        throw new Error('Il browser non supporta Mapbox GL JS (WebGL richiesto)');
      }
      console.log('✅ Supporto WebGL verificato');

      // Crea mappa
      console.log('🗺️ Creazione istanza mappa Mapbox...');
      const mapInstance = new mapboxgl.Map({
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

      map.current = mapInstance;
      console.log('✅ Istanza mappa creata');

      // Controlli di navigazione
      console.log('🧭 Aggiunta controlli navigazione...');
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Event listeners
      console.log('👂 Configurazione event listeners...');
      
      map.current.on('load', () => {
        console.log('🎉 Evento "load" - Mappa caricata con successo!');
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);

        // Resize dopo caricamento
        setTimeout(() => {
          if (map.current) {
            console.log('📏 Resize mappa...');
            map.current.resize();
          }
        }, 100);
      });

      map.current.on('error', (e) => {
        console.error('❌ Evento "error" - Errore Mapbox:', e);
        console.error('❌ Dettagli errore:', {
          error: e.error,
          message: e.error?.message,
          stack: e.error?.stack
        });
        setMapboxError(`Errore mappa: ${e.error?.message || 'Errore sconosciuto'}`);
        setLoading(false);
        initialized.current = false;
      });

      map.current.on('style.load', () => {
        console.log('🎨 Evento "style.load" - Stile mappa caricato');
      });

      map.current.on('sourcedata', (e) => {
        console.log('📊 Evento "sourcedata":', e.sourceId, e.dataType);
      });

      map.current.on('data', (e) => {
        console.log('📈 Evento "data":', e.dataType);
      });

      console.log('✅ Tutti gli event listeners configurati');

    } catch (error) {
      console.error('❌ Errore durante inizializzazione Mapbox:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'Nessuno stack trace');
      
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto durante inizializzazione';
      setMapboxError(errorMessage);
      setLoading(false);
      initialized.current = false;
    }
  }, [mapContainer, testMapboxConnection]);

  // Retry con backoff - stabile
  const retry = useCallback(() => {
    console.log('🔄 Retry inizializzazione mappa...');
    cleanup();
    setTimeout(() => {
      console.log('⏰ Timeout retry completato, tentativo inizializzazione...');
      initializeMap();
    }, 2000);
  }, [cleanup, initializeMap]);

  // Effect di inizializzazione
  useEffect(() => {
    console.log('🚀 Effect useMapbox montato');
    initializeMap();
    
    return () => {
      console.log('🚪 Effect useMapbox smontato');
      cleanup();
    };
  }, [initializeMap, cleanup]);

  console.log('📤 useMapbox return:', {
    hasMap: !!map.current,
    mapLoaded,
    loading,
    mapboxError
  });

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    retry
  };
};
