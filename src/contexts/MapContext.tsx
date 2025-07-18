import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { POI } from '@/types/poi';

// Types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export type MapViewMode = 'explore' | 'search' | 'navigate';

interface MapState {
  mapInstance: google.maps.Map | null;
  selectedPOI: POI | null;
  mapBounds: MapBounds | null;
  viewMode: MapViewMode;
  isMapReady: boolean;
}

type MapAction = 
  | { type: 'SET_MAP_INSTANCE'; payload: google.maps.Map | null }
  | { type: 'SET_SELECTED_POI'; payload: POI | null }
  | { type: 'SET_MAP_BOUNDS'; payload: MapBounds | null }
  | { type: 'SET_VIEW_MODE'; payload: MapViewMode }
  | { type: 'SET_MAP_READY'; payload: boolean }
  | { type: 'RESET_MAP' };

// Initial state
const initialState: MapState = {
  mapInstance: null,
  selectedPOI: null,
  mapBounds: null,
  viewMode: 'explore',
  isMapReady: false,
};

// Reducer
const mapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case 'SET_MAP_INSTANCE':
      return { ...state, mapInstance: action.payload };
    case 'SET_SELECTED_POI':
      return { ...state, selectedPOI: action.payload };
    case 'SET_MAP_BOUNDS':
      return { ...state, mapBounds: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_MAP_READY':
      return { ...state, isMapReady: action.payload };
    case 'RESET_MAP':
      return initialState;
    default:
      return state;
  }
};

// Context
interface MapContextType extends MapState {
  setMapInstance: (map: google.maps.Map | null) => void;
  setSelectedPOI: (poi: POI | null) => void;
  setMapBounds: (bounds: MapBounds | null) => void;
  setViewMode: (mode: MapViewMode) => void;
  setMapReady: (ready: boolean) => void;
  resetMap: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

// Provider
interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  const setMapInstance = (map: google.maps.Map | null) => {
    dispatch({ type: 'SET_MAP_INSTANCE', payload: map });
  };

  const setSelectedPOI = (poi: POI | null) => {
    dispatch({ type: 'SET_SELECTED_POI', payload: poi });
  };

  const setMapBounds = (bounds: MapBounds | null) => {
    dispatch({ type: 'SET_MAP_BOUNDS', payload: bounds });
  };

  const setViewMode = (mode: MapViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const setMapReady = (ready: boolean) => {
    dispatch({ type: 'SET_MAP_READY', payload: ready });
  };

  const resetMap = () => {
    dispatch({ type: 'RESET_MAP' });
  };

  // Auto-set map ready when instance is available
  useEffect(() => {
    if (state.mapInstance && !state.isMapReady) {
      setMapReady(true);
    }
  }, [state.mapInstance, state.isMapReady]);

  const value: MapContextType = {
    ...state,
    setMapInstance,
    setSelectedPOI,
    setMapBounds,
    setViewMode,
    setMapReady,
    resetMap,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

// Hook
export const useMapContext = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};