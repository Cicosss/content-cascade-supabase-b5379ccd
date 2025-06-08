
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
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
  const autoLocationRequested = useRef(false);

  console.log('📍 LocationProvider render:', {
    userLocation,
    isLoadingLocation,
    locationError,
    isGettingLocation: isGettingLocation.current,
    autoLocationRequested: autoLocationRequested.current
  });

  // Funzione per ottenere la posizione GPS - stabile
  const getCurrentLocation = useCallback(() => {
    if (isGettingLocation.current) {
      console.log('🔄 Richiesta GPS già in corso, saltata...');
      return;
    }

    console.log('🔍 Inizio richiesta posizione GPS...');
    setIsLoadingLocation(true);
    setLocationError(null);
    isGettingLocation.current = true;

    if (!navigator.geolocation) {
      console.log('❌ Geolocation non supportato dal browser');
      const fallback = { lat: 44.0646, lng: 12.5736 }; // Rimini
      setUserLocation(fallback);
      setLocationError('GPS non supportato dal browser');
      setIsLoadingLocation(false);
      isGettingLocation.current = false;
      
      if (!autoLocationRequested.current) {
        toast({
          title: "❌ GPS non supportato",
          description: "Usando Rimini come posizione predefinita",
          variant: "destructive",
        });
      }
      return;
    }

    console.log('🛰️ Richiesta posizione GPS al browser...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('✅ Posizione GPS ricevuta:', {
          location,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        
        setUserLocation(location);
        setLocationError(null);
        setIsLoadingLocation(false);
        isGettingLocation.current = false;
        
        if (!autoLocationRequested.current) {
          toast({
            title: "📍 Posizione GPS aggiornata!",
            description: "La tua posizione è stata rilevata con successo",
          });
        }
      },
      (error) => {
        console.error('❌ Errore GPS:', {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });
        
        const fallback = { lat: 44.0646, lng: 12.5736 }; // Rimini
        setUserLocation(fallback);
        
        let errorMessage = 'Errore GPS sconosciuto';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permesso GPS negato dall\'utente';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Posizione GPS non disponibile';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout richiesta GPS';
            break;
        }
        
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
        isGettingLocation.current = false;
        
        if (!autoLocationRequested.current) {
          toast({
            title: "❌ Errore GPS",
            description: `${errorMessage}. Usando Rimini come fallback.`,
            variant: "destructive",
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minuti
      }
    );
  }, [toast]);

  // Aggiornamento manuale della posizione - stabile
  const updateLocation = useCallback((location: LocationData) => {
    console.log('📍 Aggiornamento posizione manuale:', location);
    setUserLocation(location);
    setLocationError(null);
  }, []);

  // Richiesta automatica della posizione all'avvio - solo una volta
  useEffect(() => {
    if (!autoLocationRequested.current) {
      autoLocationRequested.current = true;
      console.log('🚀 Richiesta automatica posizione GPS all\'avvio');
      // Piccolo delay per evitare conflitti con l'inizializzazione
      setTimeout(() => {
        getCurrentLocation();
      }, 500);
    }
  }, [getCurrentLocation]);

  const value = {
    userLocation,
    isLoadingLocation,
    getCurrentLocation,
    updateLocation,
    locationError
  };

  console.log('📤 LocationProvider value:', value);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
