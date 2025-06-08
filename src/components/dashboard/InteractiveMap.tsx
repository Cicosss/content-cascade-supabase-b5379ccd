import React, { useState, useRef, useEffect } from 'react';
import { MapControls } from './map/MapControls';
import { SelectedPOICard } from './map/SelectedPOICard';
import { MapLoadingState } from './map/MapLoadingState';
import { MapContainer } from './map/MapContainer';
import { MapDebugPanel } from './map/MapDebugPanel';
import { useMapbox } from '@/hooks/useMapbox';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { useLocation } from '@/contexts/LocationContext';
import { usePOIData } from '@/hooks/usePOIData';

interface POI {
  id: string;
  name: string;
  description: string;
  poi_type: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  target_audience: string;
}

interface InteractiveMapProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters }) => {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const loadingStartTime = useRef<number>(Date.now());
  
  console.log('🗺️ InteractiveMap render FINALE:', {
    hasContainer: !!mapContainer.current,
    selectedPoi: !!selectedPoi,
    filters: filters.activityTypes,
    loadingTime: `${Date.now() - loadingStartTime.current}ms`,
    timestamp: new Date().toISOString()
  });

  // Hook principali
  const { userLocation, isLoadingLocation, getCurrentLocation, locationError } = useLocation();
  const { pois, fetchPOIs } = usePOIData();
  const { map, mapLoaded, loading: mapLoading, mapboxError, retry, forceLoad } = useMapbox(mapContainer);
  
  console.log('🔍 Stati hooks FINALI:', {
    userLocation: userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : null,
    isLoadingLocation,
    poisCount: pois.length,
    map: !!map,
    mapLoaded,
    mapLoading,
    mapboxError: mapboxError ? mapboxError.substring(0, 50) + '...' : null,
    locationError: locationError ? locationError.substring(0, 50) + '...' : null,
    timestamp: new Date().toISOString()
  });

  // Hook per i marker
  useMapMarkers({ 
    map, 
    pois, 
    onPOISelect: setSelectedPoi,
    userLocation 
  });

  // Caricamento POI iniziale
  useEffect(() => {
    console.log('🗺️ Effect: Caricamento POI iniziale...');
    fetchPOIs(filters);
    loadingStartTime.current = Date.now();
  }, []); // Dipendenza vuota intenzionale

  // Aggiornamento POI per filtri
  useEffect(() => {
    console.log('🔄 Effect: Aggiornamento POI per filtri:', filters.activityTypes);
    fetchPOIs(filters);
  }, [filters.activityTypes, fetchPOIs]);

  // Centratura mappa su posizione utente
  useEffect(() => {
    if (map && mapLoaded && userLocation) {
      console.log('🎯 Effect: Centratura mappa sulla posizione utente');
      try {
        map.flyTo({
          center: [userLocation.lng, userLocation.lat],
          zoom: 14,
          duration: 2000
        });
        console.log('✅ Centratura mappa eseguita');
      } catch (error) {
        console.error('❌ Errore centratura mappa:', error);
      }
    }
  }, [map, mapLoaded, userLocation]);

  // Stati finali consolidati
  const isLoading = mapLoading || isLoadingLocation;
  const hasErrors = mapboxError || locationError;
  const loadingTime = Date.now() - loadingStartTime.current;

  console.log('📊 Stati finali DEFINITIVI:', {
    isLoading,
    hasErrors,
    mapLoading,
    isLoadingLocation,
    mapLoaded,
    loadingTime: `${loadingTime}ms`,
    shouldShowLoading: isLoading && !hasErrors,
    shouldShowError: hasErrors,
    shouldShowMap: !isLoading && !hasErrors && mapLoaded,
    timestamp: new Date().toISOString()
  });

  // Timeout di emergenza con force load
  useEffect(() => {
    if (isLoading && loadingTime > 4000) {
      console.log('🚨 Loading troppo lungo (4s), attivando force load di emergenza');
      if (forceLoad) {
        forceLoad();
      }
    }
  }, [isLoading, loadingTime, forceLoad]);

  if (isLoading && !hasErrors) {
    console.log('⏳ Rendering stato loading FINALE...', { 
      loadingTime: `${loadingTime}ms`,
      timestamp: new Date().toISOString()
    });
    return (
      <div className="relative">
        <MapLoadingState 
          loading={true} 
          mapboxError={null} 
          onRetry={retry} 
        />
        <MapDebugPanel />
      </div>
    );
  }

  if (hasErrors) {
    console.log('❌ Rendering stato errore FINALE:', { 
      mapboxError, 
      locationError,
      timestamp: new Date().toISOString()
    });
    return (
      <div className="relative">
        <MapLoadingState 
          loading={false} 
          mapboxError={mapboxError || locationError || 'Errore nel caricamento'} 
          onRetry={retry} 
        />
        <MapDebugPanel />
      </div>
    );
  }

  console.log('✅ Rendering mappa principale FINALE...', { 
    mapLoaded, 
    loadingTime: `${loadingTime}ms`,
    poisCount: pois.length,
    timestamp: new Date().toISOString()
  });
  
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg relative">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h3 className="font-bold text-lg">🗺️ Mappa GPS Romagna</h3>
        <p className="text-blue-100 text-sm">
          {userLocation ? '📍 Posizione GPS attiva' : '🔍 Ricerca posizione...'} • {pois.length} punti di interesse
          {loadingTime > 1000 && ` • Caricata in ${Math.round(loadingTime/1000)}s`}
        </p>
      </div>

      <MapContainer mapContainer={mapContainer}>
        <MapControls 
          userLocation={userLocation}
          onLocationRequest={getCurrentLocation}
        />
      </MapContainer>

      {selectedPoi && (
        <SelectedPOICard 
          selectedPoi={selectedPoi}
          onClose={() => setSelectedPoi(null)}
        />
      )}
    </div>
  );
};

export default InteractiveMap;
