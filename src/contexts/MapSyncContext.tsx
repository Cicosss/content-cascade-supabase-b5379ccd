
import React, { createContext, useContext, useState, useCallback } from 'react';
import { POI } from '@/types/poi';

interface MapSyncContextType {
  hoveredPOIId: string | null;
  selectedPOIId: string | null;
  mapInstance: any;
  setMapInstance: (map: any) => void;
  highlightPOI: (poiId: string | null) => void;
  selectPOI: (poi: POI) => void;
  centerOnPOI: (poi: POI) => void;
}

const MapSyncContext = createContext<MapSyncContextType | undefined>(undefined);

export const useMapSync = () => {
  const context = useContext(MapSyncContext);
  if (!context) {
    throw new Error('useMapSync must be used within a MapSyncProvider');
  }
  return context;
};

interface MapSyncProviderProps {
  children: React.ReactNode;
}

export const MapSyncProvider: React.FC<MapSyncProviderProps> = ({ children }) => {
  const [hoveredPOIId, setHoveredPOIId] = useState<string | null>(null);
  const [selectedPOIId, setSelectedPOIId] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  const highlightPOI = useCallback((poiId: string | null) => {
    setHoveredPOIId(poiId);
  }, []);

  const selectPOI = useCallback((poi: POI) => {
    setSelectedPOIId(poi.id);
  }, []);

  const centerOnPOI = useCallback((poi: POI) => {
    if (!mapInstance) return;
    
    const coordinates = { lat: Number(poi.latitude), lng: Number(poi.longitude) };
    
    // Smooth transition to POI location
    mapInstance.panTo(coordinates);
    mapInstance.setZoom(16);
    
    // Set as selected POI
    setSelectedPOIId(poi.id);
  }, [mapInstance]);

  const value = {
    hoveredPOIId,
    selectedPOIId,
    mapInstance,
    setMapInstance,
    highlightPOI,
    selectPOI,
    centerOnPOI
  };

  return (
    <MapSyncContext.Provider value={value}>
      {children}
    </MapSyncContext.Provider>
  );
};
