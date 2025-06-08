
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useWeatherAPI } from '@/hooks/useWeatherAPI';
import { usePOIData } from '@/hooks/usePOIData';

interface UseMapWithWeatherProps {
  filters: any;
}

export const useMapWithWeather = ({ filters }: UseMapWithWeatherProps) => {
  const { userLocation, isLoadingLocation, getCurrentLocation, locationError } = useLocation();
  const { weather, loading: weatherLoading, error: weatherError } = useWeatherAPI(userLocation);
  const { pois, fetchPOIs } = usePOIData();
  const [initialized, setInitialized] = useState(false);

  // Inizializzazione una sola volta
  const initialize = useCallback(() => {
    if (!initialized) {
      console.log('🚀 Inizializzazione mappa e meteo...');
      setInitialized(true);
      getCurrentLocation();
      fetchPOIs(filters);
    }
  }, [initialized, getCurrentLocation, fetchPOIs, filters]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Aggiorna POI quando cambiano i filtri (ma non all'inizializzazione)
  const updatePOIs = useCallback(() => {
    if (initialized) {
      console.log('🔄 Aggiornamento POI per nuovi filtri...');
      fetchPOIs(filters);
    }
  }, [initialized, fetchPOIs, filters]);

  return {
    // Location data
    userLocation,
    isLoadingLocation,
    locationError,
    getCurrentLocation,
    
    // Weather data
    weather,
    weatherLoading,
    weatherError,
    
    // POI data
    pois,
    updatePOIs,
    
    // Combined state
    isReady: !isLoadingLocation && userLocation !== null,
    hasError: locationError !== null
  };
};
