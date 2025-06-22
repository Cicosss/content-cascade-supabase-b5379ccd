
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const useGoogleMapsInit = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true);
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
        setError(null);
      };
      
      script.onerror = () => {
        setError('Failed to load Google Maps');
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  return { isLoaded, error };
};
