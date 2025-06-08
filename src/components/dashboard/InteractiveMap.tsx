
import React, { useState, useRef, useCallback } from 'react';
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

mapboxgl.accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters, onLocationChange }) => {
  const [pois, setPois] = useState<POI[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [loading, setLoading] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const initialized = useRef(false);
  const { toast } = useToast();

  const initializeMap = useCallback(() => {
    if (initialized.current || !mapContainer.current) return;
    
    console.log('Initializing map...');
    initialized.current = true;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646],
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded');
        setLoading(false);
        getCurrentLocation();
        fetchPOIs();
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('GPS location:', location);
          setUserLocation(location);
          onLocationChange?.(location);
          addUserLocationMarker(location);
          
          if (map.current) {
            map.current.flyTo({
              center: [location.lng, location.lat],
              zoom: 14
            });
          }
        },
        (error) => {
          console.error('GPS error:', error);
          const fallback = { lat: 44.0646, lng: 12.5736 };
          setUserLocation(fallback);
          onLocationChange?.(fallback);
          addUserLocationMarker(fallback);
        }
      );
    }
  }, [onLocationChange]);

  const fetchPOIs = useCallback(async () => {
    try {
      let query = supabase.from('points_of_interest').select('*');

      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
        query = query.in('category', filters.activityTypes);
      }

      const { data, error } = await query;
      
      if (error || !data) {
        setFallbackPOIs();
      } else {
        setPois(data);
        addPOIMarkers(data);
      }
    } catch (error) {
      console.error('Error fetching POIs:', error);
      setFallbackPOIs();
    }
  }, [filters.activityTypes]);

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
      }
    ];
    setPois(fallbackData);
    addPOIMarkers(fallbackData);
  }, []);

  const addUserLocationMarker = useCallback((location: {lat: number; lng: number}) => {
    if (!map.current) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg';

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);
  }, []);

  const addPOIMarkers = useCallback((poisData: POI[]) => {
    if (!map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    poisData.forEach(poi => {
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-white border-2 border-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg';
      el.innerHTML = getPoiIcon(poi.category);
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([poi.longitude, poi.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => setSelectedPoi(poi));
      markers.current.push(marker);
    });
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

  // Inizializza la mappa solo una volta
  React.useEffect(() => {
    initializeMap();
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      initialized.current = false;
    };
  }, [initializeMap]);

  // Aggiorna POI quando cambiano i filtri
  React.useEffect(() => {
    if (!loading && map.current) {
      fetchPOIs();
    }
  }, [fetchPOIs, loading]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <h3 className="font-bold text-lg">Mappa GPS Romagna</h3>
        <p className="text-blue-100 text-sm">Scopri {pois.length} punti di interesse</p>
      </div>

      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
        <div className="absolute bottom-4 left-4 z-10">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white shadow-lg"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedPoi && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getPoiIcon(selectedPoi.category)}</span>
              <h3 className="font-bold text-lg">{selectedPoi.name}</h3>
            </div>
            <button
              onClick={() => setSelectedPoi(null)}
              className="text-gray-400 hover:text-gray-600 px-2 py-1"
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
              className="bg-blue-500 hover:bg-blue-600"
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
