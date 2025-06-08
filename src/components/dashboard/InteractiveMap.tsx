
import React, { useState, useRef, useEffect } from 'react';
import { MapControls } from './map/MapControls';
import { SelectedPOICard } from './map/SelectedPOICard';
import { MapLoadingState } from './map/MapLoadingState';
import { MapContainer } from './map/MapContainer';
import { useMapbox } from '@/hooks/useMapbox';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { useMapWithWeather } from '@/hooks/useMapWithWeather';

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
  
  // Usa il nuovo hook combinato
  const { 
    userLocation, 
    isLoadingLocation, 
    getCurrentLocation,
    pois,
    isReady,
    hasError 
  } = useMapWithWeather({ filters });
  
  // Hook per Mapbox
  const { map, mapLoaded, loading: mapLoading, mapboxError, retry } = useMapbox(mapContainer);
  
  // Hook per i marker
  useMapMarkers({ 
    map, 
    pois, 
    onPOISelect: setSelectedPoi,
    userLocation 
  });

  // Centra la mappa sulla posizione dell'utente quando è disponibile
  useEffect(() => {
    if (map && mapLoaded && userLocation && isReady) {
      console.log('🎯 Centratura mappa sulla posizione utente:', userLocation);
      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14,
        duration: 2000
      });
    }
  }, [map, mapLoaded, userLocation, isReady]);

  const isLoading = mapLoading || isLoadingLocation;
  const hasErrors = mapboxError || hasError;

  if (isLoading) {
    return (
      <MapLoadingState 
        loading={true} 
        mapboxError={null} 
        onRetry={retry} 
      />
    );
  }

  if (hasErrors) {
    return (
      <MapLoadingState 
        loading={false} 
        mapboxError={mapboxError || 'Errore nel caricamento dei dati'} 
        onRetry={retry} 
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h3 className="font-bold text-lg">🗺️ Mappa GPS Romagna</h3>
        <p className="text-blue-100 text-sm">
          {userLocation ? '📍 Posizione GPS attiva' : '🔍 Ricerca posizione...'} • {pois.length} punti di interesse
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
