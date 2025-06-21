
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { usePOIData } from '@/hooks/usePOIData';
import { Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import POIPreviewCard from './POIPreviewCard';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  
  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { pois, fetchPOIs, isLoading: isLoadingPOIs } = usePOIData();

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

    console.log('🗺️ Google Maps inizializzata');
  }, [isLoaded, userLocation]);

  // Carica POI quando la mappa è pronta o cambiano i filtri
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    fetchPOIs(filters);
  }, [mapInstanceRef.current, filters, fetchPOIs]);

  // Aggiorna i marker quando cambiano i POI
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Rimuovi marker esistenti
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Aggiungi marker per ogni POI
    pois.forEach(poi => {
      const marker = new window.google.maps.Marker({
        position: { lat: poi.latitude, lng: poi.longitude },
        map: mapInstanceRef.current,
        title: poi.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#1e3a8a" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      marker.addListener('click', () => {
        setSelectedPOI(poi);
      });

      markersRef.current.push(marker);
    });

    console.log('🏷️ Marker aggiornati:', pois.length);
  }, [pois]);

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

  const handleClosePreview = () => {
    setSelectedPOI(null);
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
      
      {/* Indicatore di caricamento POI */}
      {isLoadingPOIs && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Caricamento POI...
          </div>
        </div>
      )}
      
      {/* Controlli mappa */}
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

      {/* POI Preview Card */}
      {selectedPOI && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <POIPreviewCard
            poi={selectedPOI}
            onClose={handleClosePreview}
            onGetDirections={handleGetDirections}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
