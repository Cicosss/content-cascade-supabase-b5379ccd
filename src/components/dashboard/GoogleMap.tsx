
import React, { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { usePOIData } from '@/hooks/usePOIData';
import { Loader2 } from 'lucide-react';
import OptimizedPOIPreview from './OptimizedPOIPreview';
import MapControls from './MapControls';
import MapLoadingIndicator from './MapLoadingIndicator';
import { useGoogleMapsInit } from '@/hooks/useGoogleMapsInit';
import { useOptimizedMapInstance } from '@/hooks/useOptimizedMapInstance';
import { useOptimizedMapMarkers } from '@/hooks/useOptimizedMapMarkers';

interface GoogleMapProps {
  filters: {
    activityTypes: string[];
    zone: string;
    withChildren: string;
  };
}

const GoogleMap: React.FC<GoogleMapProps> = memo(({ filters }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  
  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { pois, fetchPOIs, isLoading: isLoadingPOIs } = usePOIData();
  const { isLoaded, error } = useGoogleMapsInit();
  const mapInstance = useOptimizedMapInstance({ isLoaded, mapRef, userLocation });

  // Use the optimized markers hook with proper POI data
  useOptimizedMapMarkers({
    map: mapInstance,
    pois,
    userLocation,
    onPOISelect: setSelectedPOI
  });

  // Transform filters for POI data service - SEMPLIFICATO per mostrare tutti i POI
  const poiFilters = useMemo(() => {
    console.log('🗺️ GoogleMap: Filters ricevuti:', filters);
    
    // Se non ci sono filtri specifici, mostra TUTTI i POI
    const shouldShowAll = !filters.activityTypes || 
                         filters.activityTypes.length === 0 || 
                         filters.activityTypes.includes('tutto') ||
                         filters.activityTypes.includes('tutte');
    
    const transformedFilters = {
      activityTypes: shouldShowAll ? [] : filters.activityTypes, // Array vuoto = tutti i POI
      zone: filters.zone === 'tuttalromagna' ? '' : filters.zone, // Stringa vuota = tutte le zone
      withChildren: filters.withChildren || 'no',
      period: undefined
    };
    
    console.log('🗺️ GoogleMap: Filtri trasformati (semplificati):', transformedFilters);
    console.log('🗺️ GoogleMap: shouldShowAll:', shouldShowAll);
    
    return transformedFilters;
  }, [filters.activityTypes, filters.zone, filters.withChildren]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleCenterOnUser = useCallback(() => {
    if (userLocation && mapInstance) {
      console.log('🗺️ GoogleMap: Centrando mappa su utente:', userLocation);
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(15);
    } else {
      console.log('🗺️ GoogleMap: Richiedendo posizione utente');
      getCurrentLocation();
    }
  }, [userLocation, mapInstance, getCurrentLocation]);

  const handleGetDirections = useCallback((poi: any) => {
    const destination = `${poi.latitude},${poi.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedPOI(null);
  }, []);

  // Load POIs when map is ready or filters change
  useEffect(() => {
    if (!mapInstance) {
      console.log('🗺️ GoogleMap: Mappa non ancora pronta');
      return;
    }
    
    console.log('🗺️ GoogleMap: Caricamento POI con filtri:', poiFilters);
    console.log('🗺️ GoogleMap: Stato mappa:', { 
      mapReady: !!mapInstance,
      isLoaded,
      filtersReady: !!poiFilters 
    });
    
    fetchPOIs(poiFilters);
  }, [mapInstance, poiFilters, fetchPOIs, isLoaded]);

  // Log dei POI ricevuti - MIGLIORATO per debug marker
  useEffect(() => {
    console.log('🗺️ GoogleMap: POI ricevuti dal database:', pois.length);
    if (pois.length > 0) {
      console.log('🗺️ GoogleMap: Primi 3 POI:', pois.slice(0, 3).map(poi => ({
        id: poi.id,
        name: poi.name,
        latitude: poi.latitude,
        longitude: poi.longitude,
        category: poi.category
      })));
      
      // Debug specifico per i marker
      console.log('🗺️ GoogleMap: Marker Debug - Mappa pronta:', !!mapInstance);
      console.log('🗺️ GoogleMap: Marker Debug - Google Maps API:', !!window.google?.maps);
    } else {
      console.log('🗺️ GoogleMap: Nessun POI ricevuto - verificare database e filtri');
    }
  }, [pois, mapInstance]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl">
        <div className="text-center">
          <p className="text-red-600 mb-2">Errore caricamento mappa</p>
          <p className="text-slate-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
    <div className="relative h-full z-map-container-custom google-maps-container">
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      
      <MapLoadingIndicator isLoadingPOIs={isLoadingPOIs} />
      
      <div className="map-controls-overlay">
        <MapControls 
          onCenterOnUser={handleCenterOnUser}
          isLoadingLocation={isLoadingLocation}
        />
      </div>

      {selectedPOI && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 map-poi-preview">
          <OptimizedPOIPreview
            poi={selectedPOI}
            onClose={handleClosePreview}
            onGetDirections={handleGetDirections}
          />
        </div>
      )}

      {/* Indicatore migliorato con debug dettagliato */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-slate-200">
        <div className="flex items-center gap-2 text-sm">
          <div 
            className={`w-2 h-2 rounded-full ${
              pois.length > 0 ? 'bg-green-600' : isLoadingPOIs ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          ></div>
          <span className="font-medium text-slate-700">
            {isLoadingPOIs ? 'Caricamento...' : `${pois.length} POI${pois.length === 0 ? ' (verifica filtri)' : ''}`}
          </span>
        </div>
        {/* Debug info migliorato */}
        <div className="text-xs text-slate-600 mt-1 space-y-1">
          <div>Mappa: {mapInstance ? '✅ Pronta' : '❌ Non pronta'}</div>
          <div>Google API: {window.google?.maps ? '✅ Caricata' : '❌ Non caricata'}</div>
          <div>Filtri: {poiFilters.activityTypes.length === 0 ? 'Tutti' : poiFilters.activityTypes.join(',')}</div>
          {pois.length > 0 && (
            <div className="text-green-700 font-medium">🎯 Marker dovrebbero essere visibili</div>
          )}
        </div>
      </div>
    </div>
  );
});

GoogleMap.displayName = 'GoogleMap';

export default GoogleMap;
