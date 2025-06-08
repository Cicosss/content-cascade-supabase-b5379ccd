
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const useMapbox = (mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapboxError, setMapboxError] = useState<string | null>(null);

  // Check WebGL support
  const checkWebGLSupport = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL non supportato');
      }
      console.log('✅ WebGL supportato');
      return true;
    } catch (error) {
      console.error('❌ WebGL non supportato:', error);
      setMapboxError('WebGL non è supportato dal tuo browser. Aggiorna il browser o controlla le impostazioni.');
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    console.log('🔄 Inizializzazione mappa Mapbox...');
    
    if (!checkWebGLSupport()) {
      return;
    }
    
    try {
      const accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';
      mapboxgl.accessToken = accessToken;
      
      if (!accessToken.startsWith('pk.')) {
        throw new Error('Token Mapbox non valido - deve iniziare con "pk."');
      }
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646], // Rimini center
        zoom: 11,
        attributionControl: false,
        antialias: true,
        maxZoom: 18,
        minZoom: 8
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      const timeout = setTimeout(() => {
        if (!mapLoaded) {
          console.error('⏰ Timeout caricamento mappa (20s)');
          setMapboxError('Timeout caricamento mappa. Verifica la connessione internet e riprova.');
          setLoading(false);
        }
      }, 20000);

      map.current.on('load', () => {
        clearTimeout(timeout);
        console.log('✅ Mappa caricata con successo!');
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);
        
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      });

      map.current.on('error', (e) => {
        clearTimeout(timeout);
        console.error('❌ Errore mappa:', e);
        
        let errorMessage = 'Errore di connessione a Mapbox';
        if (e.error) {
          const errorStr = e.error.toString().toLowerCase();
          if (errorStr.includes('401') || errorStr.includes('unauthorized')) {
            errorMessage = 'Token Mapbox non valido o scaduto. Verifica il token di accesso.';
          } else if (errorStr.includes('403') || errorStr.includes('forbidden')) {
            errorMessage = 'Accesso negato. Verifica i permessi del token Mapbox.';
          } else if (errorStr.includes('network') || errorStr.includes('fetch')) {
            errorMessage = 'Errore di rete. Verifica la connessione internet.';
          }
        }
        
        setMapboxError(errorMessage);
        setLoading(false);
      });

    } catch (error) {
      console.error('❌ Errore inizializzazione mappa:', error);
      setMapboxError(`Errore di inizializzazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      setLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapLoaded]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        setTimeout(() => {
          map.current?.resize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    setMapboxError,
    setLoading
  };
};
