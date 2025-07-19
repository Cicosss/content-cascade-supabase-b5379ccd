
import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { useSimpleMap } from '@/hooks/useSimpleMap';
import MapControls from './MapControls';
import MapSearchControls from './MapSearchControls';
import MapLoadingIndicator from './MapLoadingIndicator';
import OptimizedPOIPreview from './OptimizedPOIPreview';
import CacheStatsOverlay from './map/CacheStatsOverlay';

interface SimpleInteractiveMapProps {
  filters: {
    activityTypes: string[];
    withChildren: string;
    zone?: string;
    period?: any;
  };
}

const SimpleInteractiveMap: React.FC<SimpleInteractiveMapProps> = memo(({ filters }) => {
  const {
    mapRef,
    selectedPOI,
    isLoaded,
    error,
    isLoadingPOIs,
    isLoadingLocation,
    isUserInteracting,
    validPOICount,
    isUserMarkerVisible,
    cacheStats,
    handleCenterOnUser,
    handleClosePreview,
    handleGetDirections
  } = useSimpleMap({ filters });

  // Error state
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

  // Loading state
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
      {/* Google Maps Container */}
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      
      {/* Loading Indicator */}
      <MapLoadingIndicator isLoadingPOIs={isLoadingPOIs} />
      
      {/* Search Controls */}
      <MapSearchControls
        isSearching={isUserInteracting}
        showSearchButton={false}
        onSearch={() => {}}
        poiCount={validPOICount}
      />
      
      {/* Map Controls */}
      <div className="map-controls-overlay">
        <MapControls 
          onCenterOnUser={handleCenterOnUser}
          isLoadingLocation={isLoadingLocation}
          isUserMarkerVisible={isUserMarkerVisible}
        />
      </div>

      {/* Cache Stats Overlay (development only) */}
      <CacheStatsOverlay stats={cacheStats} />

      {/* POI Preview */}
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

SimpleInteractiveMap.displayName = 'SimpleInteractiveMap';

export default SimpleInteractiveMap;
