
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Token Mapbox pubblico - per produzione dovresti usare variabili d'ambiente
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface SimpleMapProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
}

// Dati POI statici
const STATIC_POIS: POI[] = [
  {
    id: '1',
    name: 'Osteria del Borgo Antico',
    description: 'Tradizione Culinaria Romagnola',
    category: 'cibo',
    latitude: 44.0646,
    longitude: 12.5736,
    address: 'Centro Storico di Rimini'
  },
  {
    id: '2',
    name: 'Tempio Malatestiano',
    description: 'Capolavoro Rinascimentale',
    category: 'arte e cultura',
    latitude: 44.0587,
    longitude: 12.5684,
    address: 'Via IV Novembre, Rimini'
  },
  {
    id: '3',
    name: 'Spiaggia di Riccione',
    description: 'Relax sul mare adriatico',
    category: 'parchi e natura',
    latitude: 44.0139,
    longitude: 12.6578,
    address: 'Lungomare di Riccione'
  },
  {
    id: '4',
    name: 'Ponte di Tiberio',
    description: 'Ponte Romano storico',
    category: 'arte e cultura',
    latitude: 44.0632,
    longitude: 12.5645,
    address: 'Corso d\'Augusto, Rimini'
  },
  {
    id: '5',
    name: 'Parco Federico Fellini',
    description: 'Verde pubblico nel centro',
    category: 'parchi e natura',
    latitude: 44.0598,
    longitude: 12.5712,
    address: 'Rimini Centro'
  }
];

const SimpleMap: React.FC<SimpleMapProps> = ({ filters }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('🗺️ SimpleMap render:', { filters, selectedPoi: !!selectedPoi });

  // Funzione per ottenere l'emoji della categoria
  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'cibo': '🍽️',
      'arte e cultura': '🏛️',
      'sport': '⚽',
      'musica': '🎵',
      'parchi e natura': '🌳',
      'vita notturna': '🌙',
      'intrattenimento': '🎭'
    };
    return emojis[category] || '📍';
  };

  // Filtraggio POI
  const getFilteredPOIs = () => {
    if (filters.activityTypes.includes('tutto')) {
      return STATIC_POIS;
    }
    return STATIC_POIS.filter(poi => 
      filters.activityTypes.some(type => 
        poi.category.toLowerCase().includes(type.toLowerCase())
      )
    );
  };

  // Inizializzazione mappa Mapbox
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('🚀 Inizializzazione mappa Mapbox...');
    
    // Imposta il token di accesso
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Crea la mappa
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Stile mappa stradale
      center: [12.5736, 44.0646], // Rimini
      zoom: 11,
      pitch: 0,
      bearing: 0
    });

    // Aggiungi controlli di navigazione
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Event listeners
    map.current.on('load', () => {
      console.log('✅ Mappa Mapbox caricata con successo');
      setMapLoaded(true);
      setLoading(false);
    });

    map.current.on('error', (e) => {
      console.error('❌ Errore mappa Mapbox:', e);
      setLoading(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Aggiornamento marker POI
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    console.log('📍 Aggiornamento marker POI...');

    // Rimuovi marker esistenti
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const filteredPOIs = getFilteredPOIs();
    console.log('📍 POI filtrati:', filteredPOIs.length);

    // Aggiungi nuovi marker
    filteredPOIs.forEach(poi => {
      // Crea elemento custom per il marker
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-white border-2 border-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform';
      el.innerHTML = getCategoryEmoji(poi.category);
      el.title = poi.name;

      // Crea il marker Mapbox
      const marker = new mapboxgl.Marker(el)
        .setLngLat([poi.longitude, poi.latitude])
        .addTo(map.current!);

      // Aggiungi evento click
      el.addEventListener('click', () => {
        console.log('🎯 POI selezionato:', poi.name);
        setSelectedPoi(poi);
        map.current?.flyTo({
          center: [poi.longitude, poi.latitude],
          zoom: 16,
          duration: 1500
        });
      });

      markers.current.push(marker);
    });
  }, [filters.activityTypes, mapLoaded]);

  // Geolocalizzazione
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocalizzazione non supportata');
      return;
    }

    console.log('🌍 Richiesta geolocalizzazione...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('✅ Posizione ottenuta:', { latitude, longitude });
        
        setUserLocation({ lat: latitude, lng: longitude });

        if (map.current) {
          // Rimuovi marker utente precedente
          if (userMarker.current) {
            userMarker.current.remove();
          }

          // Crea elemento per marker utente
          const userEl = document.createElement('div');
          userEl.className = 'w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse';

          // Aggiungi marker utente
          userMarker.current = new mapboxgl.Marker(userEl)
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          // Centra la mappa sulla posizione utente
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            duration: 1500
          });
        }
      },
      (error) => {
        console.error('❌ Errore geolocalizzazione:', error);
      }
    );
  };

  // Reset mappa
  const resetMap = () => {
    if (map.current) {
      map.current.flyTo({
        center: [12.5736, 44.0646],
        zoom: 11,
        duration: 1500
      });
      setSelectedPoi(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Caricamento mappa...</p>
          <p className="text-gray-500 text-sm">Mapbox GL JS</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg relative">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h3 className="font-bold text-lg">🗺️ Mappa Interattiva Romagna</h3>
        <p className="text-blue-100 text-sm">
          {userLocation ? '📍 Posizione GPS attiva' : '🔍 Tocca GPS per la posizione'} • {getFilteredPOIs().length} luoghi
        </p>
      </div>

      {/* Mappa Mapbox */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Controlli */}
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
          <Button
            size="sm"
            variant="outline"
            className="bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
            onClick={resetMap}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Info posizione */}
        {userLocation && (
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="text-xs text-gray-600">📍 La tua posizione</div>
            <div className="text-sm font-medium text-gray-900">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          </div>
        )}

        {/* Etichette geografiche */}
        <div className="absolute top-4 right-4 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
          Rimini • Riccione • Romagna
        </div>
      </div>

      {/* Card POI selezionato */}
      {selectedPoi && (
        <Card className="absolute bottom-4 right-4 z-10 w-80 p-4 bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="text-2xl mr-3">{getCategoryEmoji(selectedPoi.category)}</div>
              <div>
                <h4 className="font-bold text-gray-900">{selectedPoi.name}</h4>
                <p className="text-sm text-gray-600">{selectedPoi.category}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedPoi(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm text-gray-700 mb-2">{selectedPoi.description}</p>
          <p className="text-xs text-gray-500 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {selectedPoi.address}
          </p>
        </Card>
      )}
    </div>
  );
};

export default SimpleMap;
