
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = useCallback(() => {
    console.log('Getting current location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('GPS location obtained:', location);
          setUserLocation(location);
          
          toast({
            title: "📍 Posizione GPS aggiornata!",
            description: "La tua posizione è stata rilevata con successo",
          });
        },
        (error) => {
          console.error('GPS error:', error);
          const fallback = { lat: 44.0646, lng: 12.5736 };
          setUserLocation(fallback);
          
          toast({
            title: "❌ Errore GPS",
            description: "Impossibile ottenere la posizione GPS, usando Rimini come fallback",
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
      console.log('Geolocation not supported');
      const fallback = { lat: 44.0646, lng: 12.5736 };
      setUserLocation(fallback);
    }
  }, [toast]);

  return {
    userLocation,
    getCurrentLocation
  };
};
