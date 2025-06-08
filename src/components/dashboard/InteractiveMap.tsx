
import React, { useState, useRef, useEffect } from 'react';
import { MapControls } from './map/MapControls';
import { SelectedPOICard } from './map/SelectedPOICard';
import { MapLoadingState } from './map/MapLoadingState';
import { MapContainer } from './map/MapContainer';
import { useMapbox } from '@/hooks/useMapbox';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { useUserLocation } from '@/hooks/useUserLocation';
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
  onLocationChange?: (location: {lat: number; lng: number}) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters, onLocationChange }) => {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  
  // Custom hooks
  const { map, mapLoaded, loading, mapboxError, setMapboxError, setLoading } = useMapbox(mapContainer);
  const { userLocation, getCurrentLocation } = useUserLocation();
  const { pois, fetchPOIs } = usePOIData();
  const { addUserLocationMarker, addPOIMarkers } = useMapMarkers({
    map,
    pois,
    onPOISelect: setSelectedPoi
  });

  // Handle location change
  useEffect(() => {
    if (userLocation) {
      onLocationChange?.(userLocation);
      if (map) {
        addUserLocationMarker(userLocation);
        map.flyTo({
          center: [userLocation.lng, userLocation.lat],
          zoom: 14,
          duration: 2000
        });
      }
    }
  }, [userLocation, map, onLocationChange, addUserLocationMarker]);

  // Fetch POIs when map loads
  useEffect(() => {
    if (mapLoaded) {
      getCurrentLocation();
      fetchPOIs(filters);
    }
  }, [mapLoaded, getCurrentLocation, fetchPOIs, filters]);

  // Add POI markers when data changes
  useEffect(() => {
    if (map && pois.length > 0) {
      addPOIMarkers(pois);
    }
  }, [map, pois, addPOIMarkers]);

  const handleRetry = () => {
    console.log('🔄 Tentativo di ripristino mappa...');
    setMapboxError(null);
    setLoading(true);
    
    if (map) {
      map.remove();
    }
    
    setTimeout(() => {
      setLoading(true);
    }, 1000);
  };

  if (loading) {
    return (
      <MapLoadingState 
        loading={true} 
        mapboxError={null} 
        onRetry={handleRetry} 
      />
    );
  }

  if (mapboxError) {
    return (
      <MapLoadingState 
        loading={false} 
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
