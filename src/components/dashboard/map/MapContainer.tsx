import React, { useEffect, useCallback, useMemo, memo, Suspense } from 'react';
import { useOptimizedPOIData } from '@/hooks/useOptimizedPOIData';
import { useMapFilters as useStableMapFilters } from '@/hooks/useStableFilters';
import { useMapContext } from '@/contexts/MapContext';
import { useMapFilters as useMapFiltersContext } from '@/contexts/MapFiltersContext';
import { useMapUI } from '@/contexts/MapUIContext';
import { POI } from '@/types/poi';
import MapCore from './MapCore';
import OptimizedPOIPreview from '../OptimizedPOIPreview';

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
  
  const { pois, fetchPOIs, isLoading, error } = useOptimizedPOIData();

  // Transform and stabilize filters
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

  const poiFilters = useStableMapFilters(rawPoiFilters, mapBounds);

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
    setActiveFilters(poiFilters);
  }, [poiFilters, setActiveFilters]);

  // Fetch POIs when filters change
  useEffect(() => {
    if (!mapInstance) return;
    fetchPOIs(poiFilters);
  }, [mapInstance, poiFilters, fetchPOIs]);

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
    </>
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;