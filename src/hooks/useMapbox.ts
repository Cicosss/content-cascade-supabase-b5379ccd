
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

export const useMapbox = (mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapboxError, setMapboxError] = useState<string | null>(null);
  const initStarted = useRef(false);
  const retryCount = useRef(0);
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);

  console.log('🔍 useMapbox: Hook stato:', {
    hasContainer: !!mapContainer.current,
    hasMap: !!map.current,
    mapLoaded,
    loading,
    error: mapboxError,
    initStarted: initStarted.current,
    retryCount: retryCount.current
  });

  // Cleanup function - NO dependencies per evitare re-render
  const cleanup = () => {
    console.log('🧹 Cleanup mappa Mapbox');
    
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
      loadingTimeout.current = null;
    }
    
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
    initStarted.current = false;
  };

  // Inizializzazione mappa - SEMPLIFICATA senza dipendenze instabili
  const initializeMap = () => {
    const startTime = Date.now();
    console.log('🚀 INIZIO inizializzazione mappa...', {
      initStarted: initStarted.current,
      hasContainer: !!mapContainer.current,
      hasMap: !!map.current,
      retryCount: retryCount.current
    });

    // Controlla se può inizializzare
    if (initStarted.current || !mapContainer.current || map.current) {
      console.log('⏭️ Inizializzazione saltata - condizioni non soddisfatte');
      return;
    }

    initStarted.current = true;
    setLoading(true);
    setMapboxError(null);

    try {
      // Verifica token di base
      if (!MAPBOX_TOKEN || !MAPBOX_TOKEN.startsWith('pk.')) {
        throw new Error('Token Mapbox non valido');
      }

      // Verifica supporto WebGL
      if (!mapboxgl.supported()) {
        throw new Error('WebGL non supportato dal browser');
      }

      console.log('🗺️ Creazione mappa Mapbox...');
      
      // Imposta token
      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Crea mappa
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646], // Rimini
        zoom: 11,
        attributionControl: true,
        antialias: true,
        maxZoom: 18,
        minZoom: 8
      });

      map.current = mapInstance;
      console.log('✅ Istanza mappa creata');

      // Controlli navigazione
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // TIMEOUT DI SICUREZZA - forza completamento dopo 10 secondi
      loadingTimeout.current = setTimeout(() => {
        console.log('⏰ TIMEOUT SICUREZZA - Forzando completamento caricamento');
        const timeElapsed = Date.now() - startTime;
        console.log(`⏱️ Tempo trascorso: ${timeElapsed}ms`);
        
        if (loading && !mapLoaded) {
          console.log('🔄 Forzando stato loaded via timeout');
          setMapLoaded(true);
          setLoading(false);
          setMapboxError(null);
        }
      }, 10000);

      // Event listener LOAD - con logging dettagliato
      map.current.on('load', () => {
        const timeElapsed = Date.now() - startTime;
        console.log('🎉 EVENTO LOAD - Mappa caricata!', {
          timeElapsed: `${timeElapsed}ms`,
          mapLoaded,
          loading
        });
        
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current);
          loadingTimeout.current = null;
        }
        
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);

        // Resize dopo caricamento
        setTimeout(() => {
          if (map.current) {
            console.log('📏 Resize mappa post-load');
            map.current.resize();
          }
        }, 100);
      });

      // Event listener ERROR
      map.current.on('error', (e) => {
        const timeElapsed = Date.now() - startTime;
        console.error('❌ EVENTO ERROR - Errore Mapbox:', {
          error: e.error,
          message: e.error?.message,
          timeElapsed: `${timeElapsed}ms`
        });
        
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current);
          loadingTimeout.current = null;
        }
        
        setMapboxError(`Errore mappa: ${e.error?.message || 'Errore sconosciuto'}`);
        setLoading(false);
        initStarted.current = false;
      });

      // Logging per altri eventi utili
      map.current.on('styledata', () => {
        console.log('🎨 Stile mappa caricato');
      });

      map.current.on('sourcedata', (e) => {
        if (e.isSourceLoaded) {
          console.log('📊 Source data caricato:', e.sourceId);
        }
      });

      console.log('✅ Event listeners configurati, attendo evento load...');

    } catch (error) {
      const timeElapsed = Date.now() - startTime;
      console.error('❌ ERRORE inizializzazione:', {
        error,
        message: error instanceof Error ? error.message : 'Errore sconosciuto',
        timeElapsed: `${timeElapsed}ms`
      });
      
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
        loadingTimeout.current = null;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      setMapboxError(errorMessage);
      setLoading(false);
      initStarted.current = false;
    }
  };

  // Retry function
  const retry = () => {
    console.log('🔄 RETRY inizializzazione - tentativo:', retryCount.current + 1);
    retryCount.current += 1;
    cleanup();
    
    // Delay progressivo per retry
    const delay = Math.min(2000 * retryCount.current, 10000);
    setTimeout(() => {
      console.log(`⏰ Fine delay retry (${delay}ms), reinizializzazione...`);
      initializeMap();
    }, delay);
  };

  // Effect principale - SEMPLIFICATO
  useEffect(() => {
    console.log('🚀 Effect useMapbox montato');
    
    // Delay minimo per assicurarsi che il DOM sia pronto
    const initTimer = setTimeout(() => {
      if (mapContainer.current && !initStarted.current) {
        console.log('⏰ Timer inizializzazione scaduto, avvio...');
        initializeMap();
      }
    }, 100);
    
    return () => {
      console.log('🚪 Effect useMapbox smontato');
      clearTimeout(initTimer);
      cleanup();
    };
  }, []); // NESSUNA dipendenza - evita loop

  console.log('📤 useMapbox return:', {
    hasMap: !!map.current,
    mapLoaded,
    loading,
    mapboxError,
    retryCount: retryCount.current
  });

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    retry
  };
};
