
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
    
    console.log('🔄 Inizializzazione mappa Mapbox...');
    
    try {
      const accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';
      mapboxgl.accessToken = accessToken;
      
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
      });

      map.current.on('sourcedata', (e) => {
        if (e.sourceId && e.isSourceLoaded) {
          console.log('📍 Fonte dati caricata:', e.sourceId);
        }
      });

      map.current.on('data', (e) => {
        if (e.dataType === 'source') {
          console.log('🗺️ Dati mappa caricati');
        }
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
  }, []);

  // Handle resize
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
    setMapboxError,
    setLoading
  };
};
