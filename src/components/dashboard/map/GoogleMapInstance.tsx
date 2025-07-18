import React, { useRef, useEffect, memo } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useMapContext } from '@/contexts/MapContext';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { fallbackMapService } from '@/services/fallbackMapService';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

interface GoogleMapInstanceProps {
  className?: string;
}

const GoogleMapInstance: React.FC<GoogleMapInstanceProps> = memo(({ className = "w-full h-full rounded-xl" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { userLocation } = useLocation();
  const { setMapInstance, mapInstance } = useMapContext();
  const { isLoaded, error, fallbackMode, retryCount } = useGoogleMapsLoader();

  // Initialize map when loaded or fallback
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstance) return;

    const center = userLocation || { lat: 44.0646, lng: 12.5736 }; // Rimini default

    try {
      if (fallbackMode) {
        // Crea mappa fallback
        const fallbackMap = fallbackMapService.createSimpleMap(mapRef.current, {
          center,
          zoom: 12
        });
        setMapInstance(fallbackMap as any);
      } else {
        // Crea mappa Google standard
        const map = new google.maps.Map(mapRef.current, {
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
        setMapInstance(map);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      // Crea fallback anche in caso di errore
      const fallbackMap = fallbackMapService.createSimpleMap(mapRef.current, {
        center,
        zoom: 12
      });
      setMapInstance(fallbackMap as any);
    }
  }, [isLoaded, userLocation, mapInstance, setMapInstance, fallbackMode]);

  // Error state con retry e fallback
  if (error && !fallbackMode) {
    return (
      <div className={`h-full flex items-center justify-center bg-slate-50 rounded-xl ${className}`}>
        <div className="text-center max-w-sm p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mappa non disponibile</h3>
          <p className="text-slate-600 text-sm mb-4">{error}</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Riprova ({retryCount}/3)
            </button>
            
            <div className="text-xs text-gray-500 mt-2">
              Tentativo automatico in corso...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state migliorato
  if (!isLoaded && !fallbackMode) {
    return (
      <div className={`h-full flex items-center justify-center bg-slate-50 rounded-xl ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Caricamento mappa...</p>
          {retryCount > 0 && (
            <p className="text-xs text-gray-500 mt-2">Tentativo {retryCount}/3</p>
          )}
        </div>
      </div>
    );
  }

  // Fallback mode indicator
  if (fallbackMode) {
    return (
      <div className="relative h-full">
        <div ref={mapRef} className={className} />
        <div className="absolute top-4 right-4 bg-amber-100 border border-amber-200 rounded-lg p-3 shadow-lg max-w-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-800">Modalità Offline</span>
          </div>
          <p className="text-xs text-amber-700 mt-1">
            Funzionalità limitate. Ricarica per riprovare.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
});

GoogleMapInstance.displayName = 'GoogleMapInstance';

export default GoogleMapInstance;