
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  lat: number;
  lng: number;
}

interface LocationContextType {
  userLocation: LocationData | null;
  isLoadingLocation: boolean;
  getCurrentLocation: () => void;
  updateLocation: (location: LocationData) => void;
  locationError: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();
  const isGettingLocation = useRef(false);

  const getCurrentLocation = useCallback(() => {
    if (isGettingLocation.current) {
      console.log('🔄 Richiesta GPS già in corso...');
      return;
    }

    console.log('🔍 Ricerca posizione GPS...');
    setIsLoadingLocation(true);
    setLocationError(null);
    isGettingLocation.current = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('📍 Posizione GPS ottenuta:', location);
          setUserLocation(location);
          setIsLoadingLocation(false);
          isGettingLocation.current = false;
          
          toast({
            title: "📍 Posizione GPS aggiornata!",
            description: "La tua posizione è stata rilevata con successo",
          });
        },
        (error) => {
          console.error('❌ Errore GPS:', error);
          const fallback = { lat: 44.0646, lng: 12.5736 };
          setUserLocation(fallback);
          setLocationError('Impossibile ottenere la posizione GPS');
          setIsLoadingLocation(false);
          isGettingLocation.current = false;
          
          toast({
            title: "❌ Errore GPS",
            description: "Usando Rimini come posizione predefinita",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.log('Geolocation non supportato');
      const fallback = { lat: 44.0646, lng: 12.5736 };
      setUserLocation(fallback);
      setLocationError('GPS non supportato dal browser');
      setIsLoadingLocation(false);
      isGettingLocation.current = false;
    }
  }, [toast]);

  const updateLocation = useCallback((location: LocationData) => {
    console.log('📍 Aggiornamento posizione manuale:', location);
    setUserLocation(location);
    setLocationError(null);
  }, []);

  const value = {
    userLocation,
    isLoadingLocation,
    getCurrentLocation,
    updateLocation,
    locationError
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
