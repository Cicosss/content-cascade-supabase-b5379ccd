
import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

let googleMapsPromise: Promise<typeof google> | null = null;

export const useGoogleMapsLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        console.log('🚀 Starting Google Maps API load...');
        
        if (window.google?.maps?.places) {
          console.log('✅ Google Maps API already loaded');
          setIsLoaded(true);
          return;
        }

        if (!googleMapsPromise) {
          console.log('🔧 Initializing Google Maps Loader...');
          const loader = new Loader({
            apiKey: 'AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A',
            version: 'weekly',
            libraries: ['places'],
            region: 'IT',
            language: 'it'
          });
          googleMapsPromise = loader.load();
        }

        console.log('⏳ Loading Google Maps API...');
        await googleMapsPromise;
        
        // Verify the API loaded correctly
        if (window.google?.maps?.places?.Autocomplete) {
          console.log('✅ Google Maps API loaded successfully with Places library');
          setIsLoaded(true);
          setError(null);
        } else {
          throw new Error('Google Places API not available after load');
        }
      } catch (err) {
        const errorMessage = `Failed to load Google Maps: ${err}`;
        setError(errorMessage);
        console.error('❌ Google Maps loading error:', err);
      }
    };

    loadGoogleMaps();
  }, []);

  return { isLoaded, error };
};
