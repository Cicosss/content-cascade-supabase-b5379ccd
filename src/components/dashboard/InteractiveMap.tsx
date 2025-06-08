
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Navigation, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [pois, setPois] = useState<POI[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxError, setMapboxError] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = useCallback(() => {
    console.log('Getting current location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('GPS location obtained:', location);
          setUserLocation(location);
          onLocationChange?.(location);
          
          if (map.current && mapLoaded) {
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
          console.error('GPS error:', error);
          const fallback = { lat: 44.0646, lng: 12.5736 };
          setUserLocation(fallback);
          onLocationChange?.(fallback);
          
          if (map.current && mapLoaded) {
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
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.log('Geolocation not supported');
      const fallback = { lat: 44.0646, lng: 12.5736 };
      setUserLocation(fallback);
      onLocationChange?.(fallback);
      
      if (map.current && mapLoaded) {
        addUserLocationMarker(fallback);
      }
    }
  }, [onLocationChange, mapLoaded, toast]);

  const fetchPOIs = useCallback(async () => {
    console.log('Fetching POIs with filters:', filters);
    try {
      let query = supabase.from('points_of_interest').select('*');

      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
        query = query.in('category', filters.activityTypes);
      }

      const { data, error } = await query;
      
      if (error || !data) {
        console.log('Using fallback POIs');
        setFallbackPOIs();
      } else {
        console.log('POIs fetched:', data.length);
        setPois(data);
        if (mapLoaded) {
          addPOIMarkers(data);
        }
      }
    } catch (error) {
      console.error('Error fetching POIs:', error);
      setFallbackPOIs();
    }
  }, [filters.activityTypes, mapLoaded]);

  const setFallbackPOIs = useCallback(() => {
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
      }
    ];
    setPois(fallbackData);
    if (mapLoaded) {
      addPOIMarkers(fallbackData);
    }
  }, [mapLoaded]);

  const addUserLocationMarker = useCallback((location: {lat: number; lng: number}) => {
    if (!map.current) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'w-6 h-6 bg-blue-500 border-3 border-white rounded-full shadow-lg animate-pulse';

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);

    console.log('User marker added at:', location);
  }, []);

  const addPOIMarkers = useCallback((poisData: POI[]) => {
    if (!map.current) return;

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
        setSelectedPoi(poi);
        map.current?.flyTo({
          center: [poi.longitude, poi.latitude],
          zoom: 16,
          duration: 1500
        });
      });
      
      markers.current.push(marker);
    });

    console.log('Added', poisData.length, 'POI markers');
  }, []);

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

  const getDirections = (poi: POI) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`, '_blank');
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    console.log('Initializing map...');
    
    // Prova prima con il token esistente, poi fallback senza token
    const accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';
    
    try {
      // Imposta il token di accesso
      mapboxgl.accessToken = accessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646], // Rimini center
        zoom: 11,
        attributionControl: false
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        setLoading(false);
        setMapboxError(null);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapboxError('Errore di connessione a Mapbox. Verifica il token di accesso.');
        setLoading(false);
      });

      // Timeout per evitare caricamenti infiniti
      setTimeout(() => {
        if (!mapLoaded) {
          console.log('Map loading timeout');
          setMapboxError('Timeout di caricamento mappa. Verifica la connessione internet.');
          setLoading(false);
        }
      }, 15000);

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapboxError('Errore di inizializzazione mappa. Token Mapbox non valido.');
      setLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapLoaded]);

  // Get location when map is loaded
  useEffect(() => {
    if (mapLoaded) {
      getCurrentLocation();
      fetchPOIs();
    }
  }, [mapLoaded, getCurrentLocation, fetchPOIs]);

  // Update POIs when filters change
  useEffect(() => {
    if (mapLoaded) {
      fetchPOIs();
    }
  }, [filters, fetchPOIs]);

  if (loading && !mapboxError) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Caricamento mappa GPS...</p>
          <p className="text-gray-500 text-sm">Connessione a Mapbox in corso...</p>
        </div>
      </div>
    );
  }

  if (mapboxError) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl">
        <div className="text-center p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Errore Mappa</h3>
          <p className="text-red-600 mb-4">{mapboxError}</p>
          <Button 
            onClick={() => {
              setMapboxError(null);
              setLoading(true);
              window.location.reload();
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Riprova
          </Button>
        </div>
      </div>
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

      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
        <div className="absolute bottom-4 left-4 z-10 space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4 mr-1" />
            GPS
          </Button>
        </div>

        {userLocation && (
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="text-xs text-gray-600">📍 La tua posizione</div>
            <div className="text-sm font-medium text-gray-900">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          </div>
        )}
      </div>

      {selectedPoi && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getPoiIcon(selectedPoi.category)}</span>
              <h3 className="font-bold text-lg text-gray-900">{selectedPoi.name}</h3>
            </div>
            <button
              onClick={() => setSelectedPoi(null)}
              className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3">{selectedPoi.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {selectedPoi.address}
            </div>
            <Button
              size="sm"
              onClick={() => getDirections(selectedPoi)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Car className="h-4 w-4 mr-1" />
              Indicazioni
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
