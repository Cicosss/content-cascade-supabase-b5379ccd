import React, { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useOptimizedPOIData } from '@/hooks/useOptimizedPOIData';
import { useBoundsStabilizer } from '@/hooks/useBoundsStabilizer';
import { usePOIFetchManager } from '@/hooks/usePOIFetchManager';
import { Loader2 } from 'lucide-react';
import OptimizedPOIPreview from './OptimizedPOIPreview';
import MapControls from './MapControls';
import MapSearchControls from './MapSearchControls';
import MapLoadingIndicator from './MapLoadingIndicator';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useOptimizedMarkerPool } from '@/hooks/useOptimizedMarkerPool';
import { useMapFilters } from '@/hooks/useStableFilters';

interface GoogleMapProps {
  filters: {
    activityTypes: string[];
    withChildren: string;
    period?: any;
  };
}

const GoogleMap: React.FC<GoogleMapProps> = memo(({ filters }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  
  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { isLoaded, error } = useGoogleMapsLoader();
  const mapInstance = useMapInitialization({ isLoaded, mapRef, userLocation });

  // Map bounds e filtri stabilizzati
  const [mapBounds, setMapBounds] = useState<any>(null);
  
  // Stabilizza filtri POI con bounds
  const rawPoiFilters = useMemo(() => {
    const shouldShowAll = !filters.activityTypes || 
                         filters.activityTypes.length === 0 || 
                         filters.activityTypes.includes('tutto') ||
                         filters.activityTypes.includes('tutte');
    
    return {
      activityTypes: shouldShowAll ? [] : filters.activityTypes,
      withChildren: filters.withChildren || 'no',
      bounds: mapBounds
    };
  }, [filters.activityTypes, filters.withChildren, mapBounds]);

  // Use the imported hook directly
  const poiFilters = useMapFilters(rawPoiFilters, mapBounds);

  // Use bounds stabilizer
  const { isUserInteracting, initializeListeners } = useBoundsStabilizer({
    map: mapInstance,
    onStableBoundsChange: setMapBounds,
    stabilizationDelay: 2000
  });

  // Use POI fetch manager with circuit breaker
  const { pois, fetchPOIs: managedFetchPOIs, isLoading: isLoadingPOIs } = usePOIFetchManager({
    initialFilters: poiFilters
  });

  const { clearAllMarkers, validPOICount } = useOptimizedMarkerPool({
    map: mapInstance,
    pois,
    userLocation,
    onPOISelect: setSelectedPOI,
    isGoogleMapsLoaded: isLoaded
  });

  // Memoized callbacks
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

  // Initialize map listeners when map is ready
  useEffect(() => {
    if (mapInstance && isLoaded) {
      const cleanup = initializeListeners();
      return cleanup;
    }
  }, [mapInstance, isLoaded, initializeListeners]);

  // Load POIs when filters change
  useEffect(() => {
    if (!mapInstance || !poiFilters) return;
    managedFetchPOIs(poiFilters);
  }, [mapInstance, poiFilters, managedFetchPOIs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllMarkers();
    };
  }, [clearAllMarkers]);

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
      
      {/* Map Search Controls */}
      <MapSearchControls
        isSearching={isUserInteracting}
        showSearchButton={false}
        onSearch={() => {}}
        poiCount={validPOICount}
      />
      
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
    </div>
  );
});

GoogleMap.displayName = 'GoogleMap';

export default GoogleMap;
