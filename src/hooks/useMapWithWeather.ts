
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Inizializzazione: ottieni posizione e POI solo una volta
  useEffect(() => {
    if (!isInitialized && !isLoadingLocation && !userLocation) {
      console.log('🚀 Inizializzazione mappa e meteo...');
      setIsInitialized(true);
      getCurrentLocation();
      fetchPOIs(filters);
    }
  }, [isInitialized, isLoadingLocation, userLocation, getCurrentLocation, fetchPOIs, filters]);

  // Aggiorna POI quando cambiano i filtri
  const updatePOIs = useCallback(() => {
    console.log('🔄 Aggiornamento POI per nuovi filtri...');
    fetchPOIs(filters);
  }, [fetchPOIs, filters]);

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
    hasError: locationError || weatherError
  };
};
