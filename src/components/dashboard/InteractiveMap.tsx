
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A';

interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface InteractiveMapProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
}

// POI di esempio per la Romagna
const SAMPLE_POIS: POI[] = [
  {
    id: '1',
    name: 'Tempio Malatestiano',
    description: 'Capolavoro del Rinascimento italiano',
    category: 'arte e cultura',
    latitude: 44.0587,
    longitude: 12.5684,
    address: 'Via IV Novembre, Rimini'
  },
  {
    id: '2',
    name: 'Ponte di Tiberio',
    description: 'Antico ponte romano del I secolo',
    category: 'arte e cultura',
    latitude: 44.0632,
    longitude: 12.5645,
    address: 'Corso d\'Augusto, Rimini'
  },
  {
    id: '3',
    name: 'Spiaggia di Riccione',
    description: 'Famosa località balneare adriatica',
    category: 'parchi e natura',
    latitude: 44.0139,
    longitude: 12.6578,
    address: 'Lungomare di Riccione'
  },
  {
    id: '4',
    name: 'Casa di Giulietta',
    description: 'Ristorante tipico romagnolo',
    category: 'cibo',
    latitude: 44.0646,
    longitude: 12.5736,
    address: 'Centro Storico, Rimini'
  }
];

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Filtra i POI in base ai filtri attivi
  const getFilteredPOIs = (): POI[] => {
    if (filters.activityTypes.includes('tutto')) {
      return SAMPLE_POIS;
    }
    return SAMPLE_POIS.filter(poi => 
      filters.activityTypes.some(type => 
        poi.category.toLowerCase().includes(type.toLowerCase())
      )
    );
  };

  // Ottieni icona categoria
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'cibo': '🍽️',
      'arte e cultura': '🏛️',
      'sport': '⚽',
      'parchi e natura': '🌳',
      'vita notturna': '🌙',
      'intrattenimento': '🎭'
    };
    return icons[category] || '📍';
  };

  // Inizializza Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Carica l'API di Google Maps
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
          script.async = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Errore caricamento Google Maps'));
            document.head.appendChild(script);
          });
        }

        // Crea la mappa
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: { lat: 44.0646, lng: 12.5736 }, // Centro su Rimini
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        console.log('✅ Google Maps caricata correttamente');
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Errore inizializzazione mappa:', error);
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
    };
  }, []);

  // Aggiorna i marker quando cambiano i filtri
  useEffect(() => {
    if (!mapInstance.current || isLoading) return;

    // Rimuovi marker esistenti
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const filteredPOIs = getFilteredPOIs();

    // Aggiungi nuovi marker
    filteredPOIs.forEach(poi => {
      const marker = new google.maps.Marker({
        position: { lat: poi.latitude, lng: poi.longitude },
        map: mapInstance.current,
        title: poi.name,
        icon: {
          url: `data:image/svg+xml,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="white" stroke="#ef4444" stroke-width="3"/>
              <text x="20" y="26" text-anchor="middle" font-size="16">${getCategoryIcon(poi.category)}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        }
      });

      // Aggiungi listener per il click
      marker.addListener('click', () => {
        setSelectedPoi(poi);
        mapInstance.current?.panTo({ lat: poi.latitude, lng: poi.longitude });
        mapInstance.current?.setZoom(15);
      });

      markersRef.current.push(marker);
    });
  }, [filters.activityTypes, isLoading]);

  // Ottieni posizione utente
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalizzazione non supportata dal browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userPos = { lat: latitude, lng: longitude };
        
        setUserLocation(userPos);

        if (mapInstance.current) {
          // Rimuovi marker utente precedente
          if (userMarkerRef.current) {
            userMarkerRef.current.setMap(null);
          }

          // Aggiungi nuovo marker utente
          userMarkerRef.current = new google.maps.Marker({
            position: userPos,
            map: mapInstance.current,
            title: 'La tua posizione',
            icon: {
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="3"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12)
            }
          });

          // Centra la mappa sulla posizione utente
          mapInstance.current.panTo(userPos);
          mapInstance.current.setZoom(14);
        }
      },
      (error) => {
        console.error('Errore geolocalizzazione:', error);
        alert('Impossibile ottenere la posizione');
      }
    );
  };

  // Reset mappa
  const resetMap = () => {
    if (mapInstance.current) {
      mapInstance.current.panTo({ lat: 44.0646, lng: 12.5736 });
      mapInstance.current.setZoom(11);
      setSelectedPoi(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Caricamento Mappa</h3>
          <p className="text-gray-500 text-sm">Inizializzazione Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h3 className="font-bold text-lg flex items-center gap-2">
          🗺️ Mappa Interattiva Romagna
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          {getFilteredPOIs().length} luoghi disponibili
        </p>
      </div>

      {/* Mappa */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0" />

        {/* Controlli */}
        <div className="absolute bottom-4 left-4 z-10 space-y-2">
          <Button
            size="sm"
            onClick={getUserLocation}
            className="bg-white/95 hover:bg-white text-gray-700 shadow-lg"
          >
            <Navigation className="h-4 w-4 mr-2" />
            GPS
          </Button>
          <Button
            size="sm"
            onClick={resetMap}
            className="bg-white/95 hover:bg-white text-gray-700 shadow-lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Info posizione utente */}
        {userLocation && (
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="text-xs text-gray-600">📍 La tua posizione</div>
            <div className="text-sm font-medium text-gray-900">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          </div>
        )}
      </div>

      {/* Card POI selezionato */}
      {selectedPoi && (
        <Card className="absolute bottom-4 right-4 z-10 w-80 p-4 bg-white/95 backdrop-blur-sm shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getCategoryIcon(selectedPoi.category)}</div>
              <div>
                <h4 className="font-bold text-gray-900">{selectedPoi.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{selectedPoi.category}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedPoi(null)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm text-gray-700 mb-3">{selectedPoi.description}</p>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {selectedPoi.address}
          </div>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;
