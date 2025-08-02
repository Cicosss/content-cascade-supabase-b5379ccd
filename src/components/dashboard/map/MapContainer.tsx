
import React, { useEffect, useCallback, useMemo, memo, Suspense } from 'react';
import { useMapFilters as useStableMapFilters } from '@/hooks/useStableFilters';
import { useMapContext } from '@/contexts/MapContext';
import { useMapFilters as useMapFiltersContext } from '@/contexts/MapFiltersContext';
import { useMapUI } from '@/contexts/MapUIContext';
import { usePOIFetchManager } from '@/hooks/usePOIFetchManager';
import { POI, POIFilters } from '@/types/poi';
import MapCore from './MapCore';
import OptimizedPOIPreview from '../OptimizedPOIPreview';
import { MapDebugPanel } from '../MapDebugPanel';

interface MapContainerProps {
  filters: {
    activityTypes: string[];
    withChildren: string;
    zone?: string;
    period?: any;
  };
}

const MapContainer: React.FC<MapContainerProps> = memo(({ filters }) => {
  const { 
    selectedPOI, 
    setSelectedPOI, 
    mapBounds, 
    setMapBounds,
    mapInstance 
  } = useMapContext();
  
  const { setActiveFilters } = useMapFiltersContext();
  const { setLoadingState, setError } = useMapUI();

  // Transform and stabilize filters with proper type casting
  const rawPoiFilters = useMemo(() => {
    const shouldShowAll = !filters.activityTypes || 
                         filters.activityTypes.length === 0 || 
                         filters.activityTypes.includes('tutto') ||
                         filters.activityTypes.includes('tutte');
    
    return {
      activityTypes: shouldShowAll ? [] : filters.activityTypes,
      withChildren: (filters.withChildren === 'si' ? 'si' : 'no') as 'si' | 'no',
      bounds: mapBounds
    } as POIFilters;
  }, [filters.activityTypes, filters.withChildren, mapBounds]);

  const stableFilters = useStableMapFilters(rawPoiFilters, mapBounds);

  // Use the new POI fetch manager
  const { pois, fetchPOIs, isLoading, error, isCircuitBreakerOpen } = usePOIFetchManager({
    initialFilters: stableFilters
  });

  // Debug logging for filter changes
  useEffect(() => {
    console.log('🔍 MapContainer: Filters changed', {
      original: filters,
      stable: stableFilters,
      hasBounds: !!stableFilters.bounds,
      boundsArea: stableFilters.bounds ? 
        `${(stableFilters.bounds.north - stableFilters.bounds.south).toFixed(4)} x ${(stableFilters.bounds.east - stableFilters.bounds.west).toFixed(4)}` : 'N/A',
      poiCount: pois.length
    });
  }, [filters, stableFilters, pois.length]);

  // Update loading state
  useEffect(() => {
    setLoadingState('data', isLoading);
  }, [isLoading, setLoadingState]);

  // Update error state
  useEffect(() => {
    setError('data', error);
  }, [error, setError]);

  // Update active filters in context
  useEffect(() => {
    setActiveFilters(stableFilters);
  }, [stableFilters, setActiveFilters]);

  // Fetch POIs only when map is ready and filters are stable
  useEffect(() => {
    if (!mapInstance || isCircuitBreakerOpen) return;
    
    console.log('🗺️ MapContainer: Triggering managed POI fetch');
    fetchPOIs(stableFilters);
  }, [mapInstance, stableFilters, fetchPOIs, isCircuitBreakerOpen]);

  // Handlers
  const handlePOISelect = useCallback((poi: POI) => {
    setSelectedPOI(poi);
  }, [setSelectedPOI]);

  const handleClosePreview = useCallback(() => {
    setSelectedPOI(null);
  }, [setSelectedPOI]);

  const handleGetDirections = useCallback((poi: POI) => {
    const destination = `${poi.latitude},${poi.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  }, []);

  const handleBoundsChange = useCallback((bounds: any) => {
    console.log('🗺️ MapContainer: Bounds change received:', bounds);
    setMapBounds(bounds);
  }, [setMapBounds]);

  // Count valid POIs for display
  const validPOICount = useMemo(() => {
    return pois.filter(poi => 
      poi.latitude && 
      poi.longitude && 
      !isNaN(poi.latitude) && 
      !isNaN(poi.longitude)
    ).length;
  }, [pois]);

  return (
    <>
      <Suspense fallback={
        <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl">
          <div className="text-slate-600">Caricamento mappa...</div>
        </div>
      }>
        <MapCore
          pois={pois}
          onPOISelect={handlePOISelect}
          onBoundsChange={handleBoundsChange}
          validPOICount={validPOICount}
        />
      </Suspense>

      {/* Circuit breaker indicator */}
      {isCircuitBreakerOpen && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-orange-100 border border-orange-300 rounded-lg px-4 py-2 shadow-lg">
            <span className="text-sm font-medium text-orange-800">
              ⏸️ Sistema in pausa per ottimizzazione
            </span>
          </div>
        </div>
      )}

      {/* POI Preview */}
      {selectedPOI && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 map-poi-preview">
          <Suspense fallback={
            <div className="bg-white rounded-lg p-4 shadow-lg animate-pulse">
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          }>
            <OptimizedPOIPreview
              poi={selectedPOI}
              onClose={handleClosePreview}
              onGetDirections={handleGetDirections}
            />
          </Suspense>
        </div>
      )}

      {/* Debug Panel - Development only */}
      <MapDebugPanel
        isVisible={process.env.NODE_ENV === 'development'}
        filters={stableFilters}
        poiCount={validPOICount}
        isCircuitBreakerOpen={isCircuitBreakerOpen}
      />
    </>
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;
