
import { useState, useEffect } from 'react';

export const useGoogleMapsAPI = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsAPI = async () => {
      if (window.google?.maps?.places) {
        setIsApiLoaded(true);
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsApiLoaded(true);
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('Errore nel caricamento Google Maps API:', error);
      }
    };

    loadGoogleMapsAPI();
  }, []);

  return { isApiLoaded };
};
