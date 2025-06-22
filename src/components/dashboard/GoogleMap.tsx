
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

  // Transform filters for POI data service
  const poiFilters = useMemo(() => ({
    activityTypes: filters.activityTypes,
    zone: filters.zone,
    withChildren: filters.withChildren,
    period: undefined
  }), [filters.activityTypes.join(','), filters.zone, filters.withChildren]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleCenterOnUser = useCallback(() => {
    if (userLocation && mapInstance) {
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(15);
    } else {
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
    if (!mapInstance) return;
    
    console.log('🗺️ GoogleMap: Loading POIs with filters:', poiFilters);
    fetchPOIs(poiFilters);
  }, [mapInstance, poiFilters, fetchPOIs]);

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
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      
      <MapLoadingIndicator isLoadingPOIs={isLoadingPOIs} />
      
      <MapControls 
        onCenterOnUser={handleCenterOnUser}
        isLoadingLocation={isLoadingLocation}
      />

      {selectedPOI && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <OptimizedPOIPreview
            poi={selectedPOI}
            onClose={handleClosePreview}
            onGetDirections={handleGetDirections}
          />
        </div>
      )}

      {/* Indicatore numero POI caricati */}
      {pois.length > 0 && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="font-medium">{pois.length} POI trovati</span>
          </div>
        </div>
      )}
    </div>
  );
});

GoogleMap.displayName = 'GoogleMap';

export default GoogleMap;
