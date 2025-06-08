import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { usePOIData } from '@/hooks/usePOIData';
import { Loader2, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FavoriteButton from '@/components/FavoriteButton';

interface GoogleMapProps {
  filters: {
    activityTypes: string[];
    zone: string;
    withChildren: string;
  };
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ filters }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  
  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { pois, fetchPOIs } = usePOIData();

  // Carica Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Inizializza la mappa
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const center = userLocation || { lat: 44.0646, lng: 12.5736 }; // Rimini default

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: center,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    // Info window per i marker
    infoWindowRef.current = new window.google.maps.InfoWindow();

    console.log('🗺️ Google Maps inizializzata');
  }, [isLoaded, userLocation]);

  // Aggiorna i marker quando cambiano i POI o i filtri
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Rimuovi marker esistenti
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Fetch POI con filtri
    fetchPOIs(filters);

    // Aggiungi marker per ogni POI
    pois.forEach(poi => {
      const marker = new window.google.maps.Marker({
        position: { lat: poi.latitude, lng: poi.longitude },
        map: mapInstanceRef.current,
        title: poi.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      marker.addListener('click', () => {
        setSelectedPOI(poi);
        infoWindowRef.current.setContent(`
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${poi.name}</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${poi.description}</p>
            <p style="margin: 0; color: #999; font-size: 12px;">📍 ${poi.address}</p>
          </div>
        `);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    console.log('🏷️ Marker aggiornati:', pois.length);
  }, [pois, filters, fetchPOIs]);

  // Aggiungi marker per la posizione utente
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    const userMarker = new window.google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      title: 'La tua posizione',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="3"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: new window.google.maps.Point(12, 12)
      }
    });

    // Centra la mappa sulla posizione utente
    mapInstanceRef.current.setCenter(userLocation);

    return () => {
      userMarker.setMap(null);
    };
  }, [userLocation]);

  const handleCenterOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(userLocation);
      mapInstanceRef.current.setZoom(15);
    } else {
      getCurrentLocation();
    }
  };

  const handleGetDirections = (poi: any) => {
    const destination = `${poi.latitude},${poi.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      
      {/* Controlli mappa - spostato in alto a sinistra */}
      <div className="absolute top-4 left-4 space-y-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCenterOnUser}
          disabled={isLoadingLocation}
          className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Card POI selezionato */}
      {selectedPOI && (
        <Card className="absolute bottom-4 left-4 right-4 max-w-sm mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              {selectedPOI.name}
              <div className="ml-auto">
                <FavoriteButton 
                  itemType="experience"
                  itemId={selectedPOI.id}
                  itemData={{
                    name: selectedPOI.name,
                    description: selectedPOI.description,
                    address: selectedPOI.address,
                    category: selectedPOI.category,
                    poi_type: selectedPOI.poi_type
                  }}
                  className="relative top-0 right-0"
                  size="md"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-slate-600 text-sm mb-2">{selectedPOI.description}</p>
            <p className="text-slate-500 text-xs mb-4">📍 {selectedPOI.address}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleGetDirections(selectedPOI)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Raggiungi
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedPOI(null)}
                className="flex-1"
              >
                Chiudi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleMap;
