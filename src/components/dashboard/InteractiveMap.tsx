
import React, { useState, useEffect, useRef } from 'react';
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

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters, onLocationChange }) => {
  const [pois, setPois] = useState<POI[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    try {
      console.log('Initializing Mapbox map...');
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [12.5736, 44.0646], // Rimini center
        zoom: 12,
        attributionControl: false
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully');
        setMapLoaded(true);
        setLoading(false);
        getCurrentLocation();
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setLoading(false);
        toast({
          title: "Errore Mappa",
          description: "Impossibile caricare la mappa",
          variant: "destructive"
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
      toast({
        title: "Errore Mappa",
        description: "Impossibile inizializzare la mappa",
        variant: "destructive"
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Solo dipendenza vuota

  // Fetch POIs when filters change
  useEffect(() => {
    if (mapLoaded) {
      fetchPOIs();
    }
  }, [filters, mapLoaded]);

  // Add POI markers when pois change
  useEffect(() => {
    if (mapLoaded && pois.length > 0) {
      addPOIMarkers();
    }
  }, [pois, mapLoaded]);

  // Add user location marker when location changes
  useEffect(() => {
    if (mapLoaded && userLocation) {
      addUserLocationMarker();
      // Notify parent component about location change
      onLocationChange?.(userLocation);
    }
  }, [userLocation, mapLoaded]); // Removed onLocationChange from dependencies

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          console.log('GPS location obtained:', location);
          
          if (map.current && mapLoaded) {
            map.current.flyTo({
              center: [location.lng, location.lat],
              zoom: 14,
              duration: 2000
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          const fallbackLocation = {
            lat: 44.0646,
            lng: 12.5736
          };
          setUserLocation(fallbackLocation);
          
          toast({
            title: "Posizione non disponibile",
            description: "Usando la posizione predefinita di Rimini",
            variant: "default"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      const fallbackLocation = {
        lat: 44.0646,
        lng: 12.5736
      };
      setUserLocation(fallbackLocation);
    }
  };

  const fetchPOIs = async () => {
    try {
      console.log('Fetching POIs from database...');
      let query = supabase.from('points_of_interest').select('*');

      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
        query = query.in('category', filters.activityTypes);
      }

      if (filters.withChildren === 'sì') {
        query = query.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching POIs:', error);
        setFallbackPOIs();
      } else {
        console.log('POIs fetched:', data);
        if (data && data.length > 0) {
          setPois(data);
        } else {
          setFallbackPOIs();
        }
      }
    } catch (error) {
      console.error('Error in fetchPOIs:', error);
      setFallbackPOIs();
    }
  };

  const setFallbackPOIs = () => {
    const fallbackData = [
      {
        id: '1',
        name: 'Osteria del Borgo Antico',
        description: 'Tradizione Culinaria Romagnola Autentica',
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
        description: 'Capolavoro Rinascimentale patrimonio UNESCO',
        poi_type: 'monument',
        category: 'arte e cultura',
        latitude: 44.0587,
        longitude: 12.5684,
        address: 'Via IV Novembre, Rimini',
        target_audience: 'everyone'
      },
      {
        id: '3',
        name: 'Parco Avventura',
        description: 'Percorsi acrobatici per famiglie',
        poi_type: 'experience',
        category: 'parchi e natura',
        latitude: 44.0712,
        longitude: 12.6015,
        address: 'Colline Riminesi',
        target_audience: 'families'
      }
    ];
    setPois(fallbackData);
  };

  const addUserLocationMarker = () => {
    if (!map.current || !userLocation || !mapLoaded) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement('div');
    el.style.cssText = `
      width: 20px;
      height: 20px;
      background-color: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
      animation: pulse 2s infinite;
    `;

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<div style="color: #1f2937; font-weight: bold;">La tua posizione</div>'))
      .addTo(map.current);
  };

  const addPOIMarkers = () => {
    if (!map.current || !mapLoaded) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    pois.forEach(poi => {
      const el = document.createElement('div');
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: white;
        border: 3px solid #ef4444;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      `;
      el.innerHTML = getPoiIcon(poi.poi_type, poi.category);
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([poi.longitude, poi.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="color: #1f2937;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">${poi.name}</h3>
              <p style="margin-bottom: 8px; font-size: 14px;">${poi.description}</p>
              <p style="font-size: 12px; color: #6b7280;">${poi.address}</p>
            </div>
          `)
        )
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedPoi(poi);
      });

      markers.current.push(marker);
    });
  };

  const getDirections = (poi: POI) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`;
    window.open(url, '_blank');
  };

  const getPoiIcon = (type: string, category: string) => {
    if (type === 'restaurant' || category === 'cibo') return '🍽️';
    if (type === 'monument' || category === 'arte e cultura') return '🏛️';
    if (category === 'sport') return '⚽';
    if (category === 'musica') return '🎵';
    if (category === 'parchi e natura') return '🌳';
    if (category === 'vita notturna') return '🌙';
    if (category === 'intrattenimento') return '🎭';
    return '📍';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento mappa GPS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <h3 className="font-bold text-lg">Mappa GPS Romagna</h3>
        <p className="text-blue-100 text-sm">Scopri {pois.length} punti di interesse</p>
      </div>

      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white shadow-lg"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 text-sm shadow-lg border border-gray-200 z-10">
          <div className="font-semibold text-gray-800">{pois.length} POI trovati</div>
          <div className="text-gray-600 text-xs">
            {filters.activityTypes.includes('tutto') ? 'Tutte le categorie' : filters.activityTypes.join(', ')}
          </div>
        </div>
      </div>

      {selectedPoi && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-t border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getPoiIcon(selectedPoi.poi_type, selectedPoi.category)}</span>
              <h3 className="font-bold text-lg text-gray-800">{selectedPoi.name}</h3>
            </div>
            <button
              onClick={() => setSelectedPoi(null)}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none px-2 py-1 hover:bg-gray-200 rounded"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3">{selectedPoi.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {selectedPoi.address || 'Romagna'}
            </div>
            <Button
              size="sm"
              onClick={() => getDirections(selectedPoi)}
              className="bg-blue-500 hover:bg-blue-600 shadow-md"
            >
              <Car className="h-4 w-4 mr-1" />
              Indicazioni
            </Button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default InteractiveMap;
