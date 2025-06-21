
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { usePOIData } from '@/hooks/usePOIData';
import { Loader2, MapPin, Navigation, ExternalLink, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  
  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { pois, fetchPOIs, isLoading: isLoadingPOIs } = usePOIData();

  // Carica Google Maps API con gestione errori migliorata
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        console.log('✅ Google Maps già caricato');
        setIsLoaded(true);
        return;
      }

      console.log('🚀 Caricamento Google Maps API...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Google Maps API caricata con successo');
        setIsLoaded(true);
        setMapError(null);
      };
      
      script.onerror = (error) => {
        console.error('❌ Errore caricamento Google Maps API:', error);
        setMapError('Errore nel caricamento della mappa. Verifica la connessione internet.');
        setIsLoaded(false);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Inizializza la mappa con gestione errori
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      const center = userLocation || { lat: 44.0646, lng: 12.5736 }; // Rimini default
      console.log('🗺️ Inizializzazione mappa con centro:', center);

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

      console.log('✅ Google Maps inizializzata con successo');
      setMapError(null);
    } catch (error) {
      console.error('❌ Errore inizializzazione mappa:', error);
      setMapError('Errore nell\'inizializzazione della mappa');
    }
  }, [isLoaded, userLocation]);

  // Carica POI quando la mappa è pronta o cambiano i filtri
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    console.log('🔍 Caricamento POI con filtri:', filters);
    fetchPOIs(filters).catch((error) => {
      console.error('❌ Errore nel caricamento POI:', error);
    });
  }, [mapInstanceRef.current, filters, fetchPOIs]);

  // Aggiorna i marker quando cambiano i POI
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    try {
      console.log('🏷️ Aggiornamento marker, POI trovati:', pois.length);

      // Rimuovi marker esistenti
      markersRef.current.forEach(marker => {
        try {
          marker.setMap(null);
        } catch (error) {
          console.warn('⚠️ Errore rimozione marker:', error);
        }
      });
      markersRef.current = [];

      // Aggiungi marker per ogni POI valido
      pois.forEach((poi, index) => {
        try {
          // Verifica che le coordinate siano valide
          if (!poi.latitude || !poi.longitude || 
              isNaN(Number(poi.latitude)) || isNaN(Number(poi.longitude))) {
            console.warn('⚠️ POI con coordinate non valide:', poi.name, poi.latitude, poi.longitude);
            return;
          }

          const marker = new window.google.maps.Marker({
            position: { lat: Number(poi.latitude), lng: Number(poi.longitude) },
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
            try {
              setSelectedPOI(poi);
              infoWindowRef.current.setContent(`
                <div style="padding: 10px; max-width: 250px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${poi.name}</h3>
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${poi.description || ''}</p>
                  <p style="margin: 0; color: #999; font-size: 12px;">📍 ${poi.address || ''}</p>
                </div>
              `);
              infoWindowRef.current.open(mapInstanceRef.current, marker);
            } catch (error) {
              console.error('❌ Errore click marker:', error);
            }
          });

          markersRef.current.push(marker);
        } catch (error) {
          console.error('❌ Errore creazione marker per POI:', poi.name, error);
        }
      });

      console.log('✅ Marker aggiornati con successo:', markersRef.current.length);
    } catch (error) {
      console.error('❌ Errore generale aggiornamento marker:', error);
    }
  }, [pois]);

  // Aggiungi marker per la posizione utente
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    try {
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
        try {
          userMarker.setMap(null);
        } catch (error) {
          console.warn('⚠️ Errore rimozione marker utente:', error);
        }
      };
    } catch (error) {
      console.error('❌ Errore marker posizione utente:', error);
    }
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

  const handleRetryLoadPOIs = () => {
    console.log('🔄 Tentativo di ricaricamento POI...');
    fetchPOIs(filters).catch((error) => {
      console.error('❌ Errore nel tentativo di ricaricamento POI:', error);
    });
  };

  // Stato di errore per il caricamento della mappa
  if (mapError) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            {mapError}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Ricarica pagina
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Stato di caricamento iniziale della mappa
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
      
      {/* Indicatore di caricamento POI migliorato */}
      {isLoadingPOIs && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Caricamento attrazioni...
          </div>
        </div>
      )}

      {/* Stato di errore per POI */}
      {!isLoadingPOIs && pois.length === 0 && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Nessuna attrazione trovata per i filtri selezionati.
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={handleRetryLoadPOIs}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Riprova
              </Button>
            </AlertDescription>
          </Alert>
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
