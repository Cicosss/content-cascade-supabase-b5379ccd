
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
  const forceTimeout = useRef<NodeJS.Timeout | null>(null);

  console.log('🔍 useMapbox: Hook stato:', {
    hasContainer: !!mapContainer.current,
    hasMap: !!map.current,
    mapLoaded,
    loading,
    error: mapboxError,
    initStarted: initStarted.current,
    retryCount: retryCount.current
  });

  // Cleanup function aggressiva
  const cleanup = () => {
    console.log('🧹 CLEANUP AGGRESSIVO mappa Mapbox');
    
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
      loadingTimeout.current = null;
    }
    
    if (forceTimeout.current) {
      clearTimeout(forceTimeout.current);
      forceTimeout.current = null;
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

  // FORCE LOAD - Fallback di emergenza
  const forceMapLoad = () => {
    console.log('🚨 FORCE LOAD ATTIVATO - Bypassando tutti i controlli');
    
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
      loadingTimeout.current = null;
    }
    
    if (forceTimeout.current) {
      clearTimeout(forceTimeout.current);
      forceTimeout.current = null;
    }
    
    setMapLoaded(true);
    setLoading(false);
    setMapboxError(null);
    
    // Resize forzato dopo il force load
    setTimeout(() => {
      if (map.current) {
        console.log('📏 Force resize mappa');
        try {
          map.current.resize();
        } catch (error) {
          console.warn('⚠️ Errore force resize:', error);
        }
      }
    }, 100);
  };

  // Inizializzazione con TIMEOUT ULTRA-AGGRESSIVO
  const initializeMap = () => {
    const startTime = Date.now();
    console.log('🚀 INIZIO inizializzazione ULTRA-AGGRESSIVA...', {
      initStarted: initStarted.current,
      hasContainer: !!mapContainer.current,
      hasMap: !!map.current,
      retryCount: retryCount.current,
      timestamp: new Date().toISOString()
    });

    if (initStarted.current || !mapContainer.current || map.current) {
      console.log('⏭️ Inizializzazione saltata - condizioni non soddisfatte');
      return;
    }

    initStarted.current = true;
    setLoading(true);
    setMapboxError(null);

    // **TIMEOUT DI EMERGENZA ULTRA-AGGRESSIVO - 3 SECONDI**
    forceTimeout.current = setTimeout(() => {
      const timeElapsed = Date.now() - startTime;
      console.log('🚨 TIMEOUT EMERGENZA 3s - FORCE LOADING!', {
        timeElapsed: `${timeElapsed}ms`,
        mapLoaded,
        loading,
        hasMap: !!map.current
      });
      forceMapLoad();
    }, 3000); // 3 SECONDI MASSIMO

    try {
      // Verifica token di base
      if (!MAPBOX_TOKEN || !MAPBOX_TOKEN.startsWith('pk.')) {
        throw new Error('Token Mapbox non valido');
      }

      // Verifica supporto WebGL
      if (!mapboxgl.supported()) {
        throw new Error('WebGL non supportato dal browser');
      }

      console.log('🗺️ Creazione mappa Mapbox con CACHE BUSTING...');
      
      // **CACHE BUSTING ESTREMO**
      const cacheBuster = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      console.log('💥 Cache buster generato:', cacheBuster);
      
      // Imposta token con cache busting
      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Crea mappa con parametri anti-cache
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/streets-v12?v=${cacheBuster}`,
        center: [12.5736, 44.0646], // Rimini
        zoom: 11,
        attributionControl: true,
        antialias: true,
        maxZoom: 18,
        minZoom: 8,
        // Opzioni per forzare il caricamento
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false
      });

      map.current = mapInstance;
      console.log('✅ Istanza mappa creata con cache busting');

      // Controlli navigazione
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // **TIMEOUT SICUREZZA RIDOTTO - 2.5 secondi**
      loadingTimeout.current = setTimeout(() => {
        const timeElapsed = Date.now() - startTime;
        console.log('⏰ TIMEOUT SICUREZZA 2.5s - Forzando completamento', {
          timeElapsed: `${timeElapsed}ms`,
          mapLoaded,
          loading
        });
        
        if (loading && !mapLoaded) {
          console.log('🔄 Forzando stato loaded via timeout sicurezza');
          forceMapLoad();
        }
      }, 2500);

      // Event listener LOAD - con logging ESTREMO
      map.current.on('load', () => {
        const timeElapsed = Date.now() - startTime;
        console.log('🎉 EVENTO LOAD RICEVUTO!', {
          timeElapsed: `${timeElapsed}ms`,
          mapLoaded,
          loading,
          timestamp: new Date().toISOString()
        });
        
        // Pulisci tutti i timeout
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current);
          loadingTimeout.current = null;
        }
        
        if (forceTimeout.current) {
          clearTimeout(forceTimeout.current);
          forceTimeout.current = null;
        }
        
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);

        // Resize immediato dopo load
        setTimeout(() => {
          if (map.current) {
            console.log('📏 Resize mappa post-load');
            map.current.resize();
          }
        }, 50);
      });

      // Event listener ERROR con recovery
      map.current.on('error', (e) => {
        const timeElapsed = Date.now() - startTime;
        console.error('❌ EVENTO ERROR Mapbox:', {
          error: e.error,
          message: e.error?.message,
          timeElapsed: `${timeElapsed}ms`,
          timestamp: new Date().toISOString()
        });
        
        // Pulisci timeout
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current);
          loadingTimeout.current = null;
        }
        
        if (forceTimeout.current) {
          clearTimeout(forceTimeout.current);
          forceTimeout.current = null;
        }
        
        // Anche in caso di errore, proviamo a forzare il caricamento
        console.log('🔄 Errore rilevato, tentativo force load...');
        setTimeout(() => {
          forceMapLoad();
        }, 500);
      });

      // Eventi di debug dettagliati - CORRETTI
      map.current.on('styledata', () => {
        console.log('🎨 Stile caricato:', {
          timestamp: new Date().toISOString()
        });
      });

      map.current.on('sourcedata', (e) => {
        if (e.isSourceLoaded) {
          console.log('📊 Source data caricato:', {
            sourceId: e.sourceId,
            timestamp: new Date().toISOString()
          });
        }
      });

      map.current.on('idle', () => {
        console.log('😴 Mappa in stato idle - potenzialmente pronta');
        // Se non abbiamo ancora flaggato come loaded, proviamo ora
        if (!mapLoaded && loading) {
          console.log('🔄 Stato idle rilevato, forzando load...');
          setTimeout(() => {
            if (!mapLoaded && loading) {
              forceMapLoad();
            }
          }, 200);
        }
      });

      console.log('✅ Event listeners ESTREMI configurati, attendo caricamento...');

    } catch (error) {
      const timeElapsed = Date.now() - startTime;
      console.error('❌ ERRORE CRITICO inizializzazione:', {
        error,
        message: error instanceof Error ? error.message : 'Errore sconosciuto',
        timeElapsed: `${timeElapsed}ms`,
        timestamp: new Date().toISOString()
      });
      
      // Pulisci timeout
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
        loadingTimeout.current = null;
      }
      
      if (forceTimeout.current) {
        clearTimeout(forceTimeout.current);
        forceTimeout.current = null;
      }
      
      // Anche in caso di errore critico, proviamo force load
      console.log('🚨 Errore critico, tentativo force load di emergenza...');
      setTimeout(() => {
        forceMapLoad();
      }, 1000);
    }
  };

  // Retry con delay progressivo
  const retry = () => {
    console.log('🔄 RETRY AGGRESSIVO - tentativo:', retryCount.current + 1);
    retryCount.current += 1;
    cleanup();
    
    // Delay ridotto per retry più veloci
    const delay = Math.min(1000 * retryCount.current, 3000);
    setTimeout(() => {
      console.log(`⏰ Fine delay retry (${delay}ms), reinizializzazione...`);
      initializeMap();
    }, delay);
  };

  // Effect principale
  useEffect(() => {
    console.log('🚀 Effect useMapbox ULTRA-AGGRESSIVO montato');
    
    // Delay minimo ridotto
    const initTimer = setTimeout(() => {
      if (mapContainer.current && !initStarted.current) {
        console.log('⏰ Timer inizializzazione RAPIDO scaduto, avvio...');
        initializeMap();
      }
    }, 50); // Ridotto a 50ms
    
    return () => {
      console.log('🚪 Effect useMapbox smontato');
      clearTimeout(initTimer);
      cleanup();
    };
  }, []);

  console.log('📤 useMapbox return FINALE:', {
    hasMap: !!map.current,
    mapLoaded,
    loading,
    mapboxError,
    retryCount: retryCount.current,
    timestamp: new Date().toISOString()
  });

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    retry,
    forceLoad: forceMapLoad // Esponiamo anche il force load
  };
};
