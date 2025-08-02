import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface MapUIState {
  showSearchButton: boolean;
  isSearching: boolean;
  controlsVisible: boolean;
  loadingStates: {
    map: boolean;
    markers: boolean;
    data: boolean;
  };
  errors: {
    map: string | null;
    data: string | null;
    location: string | null;
  };
}

interface MapUIContextType extends MapUIState {
  setShowSearchButton: (show: boolean) => void;
  setIsSearching: (searching: boolean) => void;
  setControlsVisible: (visible: boolean) => void;
  setLoadingState: (key: keyof MapUIState['loadingStates'], loading: boolean) => void;
  setError: (key: keyof MapUIState['errors'], error: string | null) => void;
  clearAllErrors: () => void;
  isAnyLoading: () => boolean;
  hasAnyError: () => boolean;
}

const initialState: MapUIState = {
  showSearchButton: false,
  isSearching: false,
  controlsVisible: true,
  loadingStates: {
    map: false,
    markers: false,
    data: false,
  },
  errors: {
    map: null,
    data: null,
    location: null,
  },
};

const MapUIContext = createContext<MapUIContextType | undefined>(undefined);

interface MapUIProviderProps {
  children: ReactNode;
}

export const MapUIProvider: React.FC<MapUIProviderProps> = ({ children }) => {
  const [uiState, setUIState] = useState<MapUIState>(initialState);

  const setShowSearchButton = useCallback((show: boolean) => {
    setUIState(prev => ({ ...prev, showSearchButton: show }));
  }, []);

  const setIsSearching = useCallback((searching: boolean) => {
    setUIState(prev => ({ ...prev, isSearching: searching }));
  }, []);

  const setControlsVisible = useCallback((visible: boolean) => {
    setUIState(prev => ({ ...prev, controlsVisible: visible }));
  }, []);

  const setLoadingState = useCallback((key: keyof MapUIState['loadingStates'], loading: boolean) => {
    console.log(`🔄 MapUI: Setting ${key} loading to ${loading}`);
    setUIState(prev => ({
      ...prev,
      loadingStates: { ...prev.loadingStates, [key]: loading }
    }));
  }, []);

  const setError = useCallback((key: keyof MapUIState['errors'], error: string | null) => {
    setUIState(prev => ({
      ...prev,
      errors: { ...prev.errors, [key]: error }
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      errors: { map: null, data: null, location: null }
    }));
  }, []);

  const isAnyLoading = useCallback(() => {
    return Object.values(uiState.loadingStates).some(loading => loading);
  }, [uiState.loadingStates]);

  const hasAnyError = useCallback(() => {
    return Object.values(uiState.errors).some(error => error !== null);
  }, [uiState.errors]);

  const value: MapUIContextType = {
    ...uiState,
    setShowSearchButton,
    setIsSearching,
    setControlsVisible,
    setLoadingState,
    setError,
    clearAllErrors,
    isAnyLoading,
    hasAnyError,
  };

  return <MapUIContext.Provider value={value}>{children}</MapUIContext.Provider>;
};

export const useMapUI = (): MapUIContextType => {
  const context = useContext(MapUIContext);
  if (context === undefined) {
    throw new Error('useMapUI must be used within a MapUIProvider');
  }
  return context;
};