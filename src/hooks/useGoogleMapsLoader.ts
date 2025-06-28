
import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

let googleMapsPromise: Promise<typeof google> | null = null;

export const useGoogleMapsLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        if (window.google?.maps) {
          setIsLoaded(true);
          return;
        }

        if (!googleMapsPromise) {
          const loader = new Loader({
            apiKey: 'AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A',
            version: 'weekly',
            libraries: ['places']
          });
          googleMapsPromise = loader.load();
        }

        await googleMapsPromise;
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        setError('Failed to load Google Maps');
        console.error('Google Maps loading error:', err);
      }
    };

    loadGoogleMaps();
  }, []);

  return { isLoaded, error };
};
