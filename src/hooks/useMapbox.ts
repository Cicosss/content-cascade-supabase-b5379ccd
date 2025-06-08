
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set token only once at module level
mapboxgl.accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

export const useMapbox = (mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapboxError, setMapboxError] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (!mapContainer.current || map.current || initialized.current) {
      return;
    }
    
    initialized.current = true;
    console.log('🔄 Inizializzazione mappa Mapbox - UNICA...');
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646], // Rimini center
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
        
        // Force resize after load
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      });

      map.current.on('error', (e) => {
        console.error('❌ Errore mappa:', e);
        setMapboxError('Errore di caricamento della mappa. Verifica la connessione internet.');
        setLoading(false);
        initialized.current = false; // Allow retry
      });

    } catch (error) {
      console.error('❌ Errore inizializzazione mappa:', error);
      setMapboxError(`Errore di inizializzazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      setLoading(false);
      initialized.current = false; // Allow retry
    }

    return () => {
      if (map.current) {
        console.log('🧹 Pulizia mappa...');
        map.current.remove();
        map.current = null;
      }
      initialized.current = false;
    };
  }, []); // Empty dependency array to prevent re-initialization

  // Handle resize separately
  useEffect(() => {
    const handleResize = () => {
      if (map.current && mapLoaded) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapLoaded]);

  return {
    map: map.current,
    mapLoaded,
    loading,
    mapboxError,
    setMapboxError: (error: string | null) => {
      setMapboxError(error);
      if (error === null) {
        initialized.current = false; // Allow retry
      }
    },
    setLoading
  };
};
