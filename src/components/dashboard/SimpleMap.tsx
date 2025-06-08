
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';

// We'll use a different approach - create a simple custom map without external libraries
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 44.0646, lng: 12.5736 });
  const [zoom, setZoom] = useState(12);

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

  // Funzione per convertire coordinate geografiche in posizione pixel sulla mappa
  const latLngToPixel = (lat: number, lng: number) => {
    if (!mapRef.current) return { x: 0, y: 0 };
    
    const mapRect = mapRef.current.getBoundingClientRect();
    const mapWidth = mapRect.width;
    const mapHeight = mapRect.height;
    
    // Area geografica di riferimento per la Romagna
    const bounds = {
      north: 44.3,
      south: 43.8,
      east: 12.8,
      west: 12.3
    };
    
    // Calcolo delle posizioni relative
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * mapWidth;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * mapHeight;
    
    return { x: Math.max(0, Math.min(mapWidth, x)), y: Math.max(0, Math.min(mapHeight, y)) };
  };

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
        setMapCenter({ lat: latitude, lng: longitude });
        setZoom(14);
      },
      (error) => {
        console.error('❌ Errore geolocalizzazione:', error);
      }
    );
  };

  // Reset mappa
  const resetMap = () => {
    setMapCenter({ lat: 44.0646, lng: 12.5736 });
    setZoom(12);
    setSelectedPoi(null);
  };

  const handlePOIClick = (poi: POI) => {
    console.log('🎯 POI selezionato:', poi.name);
    setSelectedPoi(poi);
    setMapCenter({ lat: poi.latitude, lng: poi.longitude });
    setZoom(16);
  };

  const filteredPOIs = getFilteredPOIs();

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg relative">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h3 className="font-bold text-lg">🗺️ Mappa Interattiva Romagna</h3>
        <p className="text-blue-100 text-sm">
          {userLocation ? '📍 Posizione GPS attiva' : '🔍 Tocca GPS per la posizione'} • {filteredPOIs.length} luoghi
        </p>
      </div>

      {/* Mappa Custom */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-100 to-green-100">
        <div 
          ref={mapRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          {/* Marker POI */}
          {filteredPOIs.map(poi => {
            const { x, y } = latLngToPixel(poi.latitude, poi.longitude);
            return (
              <div
                key={poi.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
                style={{ left: x, top: y }}
                onClick={() => handlePOIClick(poi)}
                title={poi.name}
              >
                <div className="w-8 h-8 bg-white border-2 border-red-500 rounded-full flex items-center justify-center shadow-lg text-lg">
                  {getCategoryEmoji(poi.category)}
                </div>
              </div>
            );
          })}

          {/* Marker Utente */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ 
                left: latLngToPixel(userLocation.lat, userLocation.lng).x, 
                top: latLngToPixel(userLocation.lat, userLocation.lng).y 
              }}
            >
              <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Controlli */}
        <div className="absolute bottom-4 left-4 z-30 space-y-2">
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
          <div className="absolute top-4 left-4 z-30 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="text-xs text-gray-600">📍 La tua posizione</div>
            <div className="text-sm font-medium text-gray-900">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          </div>
        )}

        {/* Griglia di riferimento */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid grid-cols-6 grid-rows-4 h-full w-full opacity-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Etichette geografiche */}
        <div className="absolute top-4 right-4 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
          Rimini • Riccione • Romagna
        </div>
      </div>

      {/* Card POI selezionato */}
      {selectedPoi && (
        <Card className="absolute bottom-4 right-4 z-30 w-80 p-4 bg-white/95 backdrop-blur-sm shadow-xl">
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
