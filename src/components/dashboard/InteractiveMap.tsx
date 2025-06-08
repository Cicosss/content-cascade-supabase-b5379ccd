
import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapControls } from './map/MapControls';
import { SelectedPOICard } from './map/SelectedPOICard';
import { MapLoadingState } from './map/MapLoadingState';
import { MapContainer } from './map/MapContainer';
import { useToast } from '@/hooks/use-toast';

interface POI {
  id: string;
  name: string;
  description: string;
  poi_type: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  target_audience: string;
}

interface InteractiveMapProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
  onLocationChange?: (location: {lat: number; lng: number}) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters, onLocationChange }) => {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapboxError, setMapboxError] = useState<string | null>(null);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  
  const { toast } = useToast();

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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    console.log('🔄 Inizializzazione mappa Mapbox...');
    
    // Check WebGL support first
    if (!checkWebGLSupport()) {
      return;
    }
    
    try {
      // Set the access token
      const accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';
      mapboxgl.accessToken = accessToken;
      
      console.log('🔑 Token Mapbox impostato');
      
      // Test token validity by checking if it starts with 'pk.'
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

      console.log('🗺️ Istanza mappa creata');

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Timeout di sicurezza
      const timeout = setTimeout(() => {
        if (loading) {
          console.error('⏰ Timeout caricamento mappa (20s)');
          setMapboxError('Timeout caricamento mappa. Verifica la connessione internet e riprova.');
          setLoading(false);
        }
      }, 20000);

      // Set up event listeners
      map.current.on('load', () => {
        clearTimeout(timeout);
        console.log('✅ Mappa caricata con successo!');
        setLoading(false);
        setMapboxError(null);
        
        // Resize map to ensure proper display
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('📐 Mappa ridimensionata');
          }
        }, 100);
        
        getCurrentLocation();
        fetchPOIs();
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

      map.current.on('styledata', () => {
        console.log('🎨 Stile mappa caricato');
      });

      map.current.on('sourcedata', (e) => {
        if (e.isSourceLoaded) {
          console.log('📊 Dati sorgente caricati');
        }
      });

      map.current.on('idle', () => {
        console.log('⏸️ Mappa in stato idle');
      });

    } catch (error) {
      console.error('❌ Errore inizializzazione mappa:', error);
      setMapboxError(`Errore di inizializzazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      setLoading(false);
    }

    // Cleanup
    return () => {
      console.log('🧹 Pulizia mappa...');
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle container resize
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

  const getCurrentLocation = () => {
    console.log('🔍 Ricerca posizione GPS...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('📍 Posizione GPS ottenuta:', location);
          setUserLocation(location);
          onLocationChange?.(location);
          
          if (map.current) {
            addUserLocationMarker(location);
            map.current.flyTo({
              center: [location.lng, location.lat],
              zoom: 14,
              duration: 2000
            });
          }
          
          toast({
            title: "📍 Posizione GPS aggiornata!",
            description: "La tua posizione è stata rilevata con successo",
          });
        },
        (error) => {
          console.error('❌ Errore GPS:', error);
          const fallback = { lat: 44.0646, lng: 12.5736 };
          setUserLocation(fallback);
          onLocationChange?.(fallback);
          
          if (map.current) {
            addUserLocationMarker(fallback);
          }
          
          toast({
            title: "❌ Errore GPS",
            description: "Impossibile ottenere la posizione GPS, usando Rimini come fallback",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    } else {
      console.log('Geolocation non supportato');
      const fallback = { lat: 44.0646, lng: 12.5736 };
      setUserLocation(fallback);
      onLocationChange?.(fallback);
    }
  };

  const addUserLocationMarker = (location: {lat: number; lng: number}) => {
    if (!map.current) return;

    console.log('📍 Aggiunta marker posizione utente:', location);

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'w-6 h-6 bg-blue-500 border-3 border-white rounded-full shadow-lg animate-pulse';

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);
  };

  const fetchPOIs = () => {
    console.log('🗺️ Caricamento POI...');
    const fallbackData = [
      {
        id: '1',
        name: 'Osteria del Borgo Antico',
        description: 'Tradizione Culinaria Romagnola',
        poi_type: 'restaurant',
        category: 'cibo',
        latitude: 44.0646,
        longitude: 12.5736,
        address: 'Centro Storico di Rimini',
        target_audience: 'everyone'
      },
      {
        id: '2',
        name: 'Tempio Malatestiano',
        description: 'Capolavoro Rinascimentale',
        poi_type: 'monument',
        category: 'arte e cultura',
        latitude: 44.0587,
        longitude: 12.5684,
        address: 'Via IV Novembre, Rimini',
        target_audience: 'everyone'
      },
      {
        id: '3',
        name: 'Spiaggia di Riccione',
        description: 'Relax sul mare adriatico',
        poi_type: 'beach',
        category: 'parchi e natura',
        latitude: 44.0139,
        longitude: 12.6578,
        address: 'Lungomare di Riccione',
        target_audience: 'everyone'
      },
      {
        id: '4',
        name: 'Ponte di Tiberio',
        description: 'Ponte Romano storico',
        poi_type: 'monument',
        category: 'arte e cultura',
        latitude: 44.0632,
        longitude: 12.5645,
        address: 'Corso d\'Augusto, Rimini',
        target_audience: 'everyone'
      },
      {
        id: '5',
        name: 'Parco Federico Fellini',
        description: 'Verde pubblico nel centro',
        poi_type: 'park',
        category: 'parchi e natura',
        latitude: 44.0598,
        longitude: 12.5712,
        address: 'Rimini Centro',
        target_audience: 'everyone'
      }
    ];
    setPois(fallbackData);
    addPOIMarkers(fallbackData);
  };

  const addPOIMarkers = (poisData: POI[]) => {
    if (!map.current) {
      console.log('❌ Impossibile aggiungere marker POI: mappa non pronta');
      return;
    }

    console.log('📍 Aggiunta', poisData.length, 'marker POI');

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    poisData.forEach(poi => {
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-white border-2 border-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform';
      el.innerHTML = getPoiIcon(poi.category);
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([poi.longitude, poi.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        console.log('🎯 POI cliccato:', poi.name);
        setSelectedPoi(poi);
        map.current!.flyTo({
          center: [poi.longitude, poi.latitude],
          zoom: 16,
          duration: 1500
        });
      });
      
      markers.current.push(marker);
    });

    console.log('✅ Tutti i marker POI aggiunti');
  };

  const getPoiIcon = (category: string) => {
    const icons: Record<string, string> = {
      'cibo': '🍽️',
      'arte e cultura': '🏛️',
      'sport': '⚽',
      'musica': '🎵',
      'parchi e natura': '🌳',
      'vita notturna': '🌙',
      'intrattenimento': '🎭'
    };
    return icons[category] || '📍';
  };

  const handleRetry = () => {
    console.log('🔄 Tentativo di ripristino mappa...');
    setMapboxError(null);
    setLoading(true);
    
    // Force cleanup and reinitialize
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    // Trigger re-initialization after a brief delay
    setTimeout(() => {
      // Component will re-initialize due to useEffect dependency
      setLoading(true);
    }, 1000);
  };

  if (loading) {
    return (
      <MapLoadingState 
        loading={true} 
        mapboxError={null} 
        onRetry={handleRetry} 
      />
    );
  }

  if (mapboxError) {
    return (
      <MapLoadingState 
        loading={false} 
        mapboxError={mapboxError} 
        onRetry={handleRetry} 
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h3 className="font-bold text-lg">🗺️ Mappa GPS Romagna</h3>
        <p className="text-blue-100 text-sm">
          {userLocation ? '📍 Posizione GPS attiva' : '🔍 Ricerca posizione...'} • {pois.length} punti di interesse
        </p>
      </div>

      <MapContainer mapContainer={mapContainer}>
        <MapControls 
          userLocation={userLocation}
          onLocationRequest={getCurrentLocation}
        />
      </MapContainer>

      {selectedPoi && (
        <SelectedPOICard 
          selectedPoi={selectedPoi}
          onClose={() => setSelectedPoi(null)}
        />
      )}
    </div>
  );
};

export default InteractiveMap;
