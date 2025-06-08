
import React, { useState, useRef, useEffect } from 'react';
import { useMapbox } from '@/hooks/useMapbox';
import { useUserLocation } from '@/hooks/useUserLocation';
import { usePOIData } from '@/hooks/usePOIData';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { MapControls } from './map/MapControls';
import { SelectedPOICard } from './map/SelectedPOICard';
import { MapLoadingState } from './map/MapLoadingState';
import { MapContainer } from './map/MapContainer';

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
  onLocationChange?: (location: {lat: number; lng: number}) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters, onLocationChange }) => {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  
  const { map, mapLoaded, loading, mapboxError, setMapboxError, setLoading } = useMapbox(mapContainer);
  const { userLocation, getCurrentLocation } = useUserLocation();
  const { pois, fetchPOIs } = usePOIData();
  
  const { addUserLocationMarker, addPOIMarkers } = useMapMarkers({ 
    map, 
    pois, 
    onPOISelect: setSelectedPoi 
  });

  const handleLocationRequest = () => {
    getCurrentLocation();
    if (map && userLocation) {
      addUserLocationMarker(userLocation);
      map.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14,
        duration: 2000
      });
    }
  };

  const handleRetry = () => {
    setMapboxError(null);
    setLoading(true);
    window.location.reload();
  };

  // Get location when map is loaded
  useEffect(() => {
    if (mapLoaded) {
      getCurrentLocation();
      fetchPOIs(filters);
    }
  }, [mapLoaded, getCurrentLocation, fetchPOIs]);

  // Update user location marker and notify parent
  useEffect(() => {
    if (userLocation && mapLoaded) {
      addUserLocationMarker(userLocation);
      onLocationChange?.(userLocation);
    }
  }, [userLocation, mapLoaded, addUserLocationMarker, onLocationChange]);

  // Update POI markers when POIs change
  useEffect(() => {
    if (mapLoaded && pois.length > 0) {
      addPOIMarkers(pois);
    }
  }, [pois, mapLoaded, addPOIMarkers]);

  // Update POIs when filters change
  useEffect(() => {
    if (mapLoaded) {
      fetchPOIs(filters);
    }
  }, [filters, fetchPOIs, mapLoaded]);

  const loadingOrError = loading || mapboxError;

  if (loadingOrError) {
    return (
      <MapLoadingState 
        loading={loading} 
        mapboxError={mapboxError} 
        onRetry={handleRetry} 
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
          onLocationRequest={handleLocationRequest}
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
