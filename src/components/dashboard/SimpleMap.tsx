
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Dynamic import for Leaflet to avoid SSR issues
let L: any = null;

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
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

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

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        console.log('🚀 Loading Leaflet...');
        const leafletModule = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        
        L = leafletModule.default;
        
        // Fix per le icone di Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        setLeafletLoaded(true);
        console.log('✅ Leaflet caricato con successo');
      } catch (error) {
        console.error('❌ Errore caricamento Leaflet:', error);
        setIsLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  // Inizializzazione mappa
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !leafletLoaded || !L) return;

    console.log('🚀 Inizializzazione mappa Leaflet...');
    setIsLoading(true);

    try {
      // Crea mappa
      const map = L.map(mapRef.current).setView([44.0646, 12.5736], 12);

      // Aggiungi tile layer OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      
      // Simula un breve caricamento per l'esperienza utente
      setTimeout(() => {
        setIsLoading(false);
        console.log('✅ Mappa Leaflet caricata con successo');
      }, 500);

    } catch (error) {
      console.error('❌ Errore inizializzazione mappa:', error);
      setIsLoading(false);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Aggiornamento marker POI
  useEffect(() => {
    if (!mapInstanceRef.current || !L) return;

    console.log('📍 Aggiornamento marker POI...');

    // Rimuovi marker esistenti
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const filteredPOIs = getFilteredPOIs();
    console.log('📍 POI filtrati:', filteredPOIs.length);

    // Aggiungi nuovi marker
    filteredPOIs.forEach(poi => {
      const customIcon = L.divIcon({
        html: `<div style="background: white; border: 2px solid #ef4444; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${getCategoryEmoji(poi.category)}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([poi.latitude, poi.longitude], { icon: customIcon })
        .addTo(mapInstanceRef.current!)
        .on('click', () => {
          console.log('🎯 POI selezionato:', poi.name);
          setSelectedPoi(poi);
          mapInstanceRef.current?.setView([poi.latitude, poi.longitude], 16);
        });

      markersRef.current.push(marker);
    });
  }, [filters.activityTypes, leafletLoaded]);

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
        
        if (mapInstanceRef.current && L) {
          // Rimuovi marker utente precedente
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          // Aggiungi nuovo marker utente
          const userIcon = L.divIcon({
            html: '<div style="background: #3b82f6; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current);

          // Centra la mappa sulla posizione utente
          mapInstanceRef.current.setView([latitude, longitude], 14);
        }
      },
      (error) => {
        console.error('❌ Errore geolocalizzazione:', error);
      }
    );
  };

  // Reset mappa
  const resetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([44.0646, 12.5736], 12);
      setSelectedPoi(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Caricamento mappa...</p>
          <p className="text-gray-500 text-sm">OpenStreetMap + Leaflet</p>
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

      {/* Mappa */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" />
        
        {/* Controlli */}
        <div className="absolute bottom-4 left-4 z-[1000] space-y-2">
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
          <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="text-xs text-gray-600">📍 La tua posizione</div>
            <div className="text-sm font-medium text-gray-900">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          </div>
        )}
      </div>

      {/* Card POI selezionato */}
      {selectedPoi && (
        <Card className="absolute bottom-4 right-4 z-[1000] w-80 p-4 bg-white/95 backdrop-blur-sm shadow-xl">
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
