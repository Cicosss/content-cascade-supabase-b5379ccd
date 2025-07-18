
import { useEffect, useState } from 'react';
import { googleMapsApiService } from '@/services/googleMapsApiService';
import { devLog } from '@/utils/devLogger';

export const useGoogleMapsLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        devLog.info('🚀 Starting Google Maps API load through APIClient...');
        
        const google = await googleMapsApiService.loadMapsAPI();
        
        setIsLoaded(true);
        setError(null);
        devLog.info('✅ Google Maps API loaded through APIClient');
      } catch (err: any) {
        const errorMessage = err.message || `Failed to load Google Maps: ${err}`;
        setError(errorMessage);
        console.error('❌ Google Maps loading error:', err);
      }
    };

    loadGoogleMaps();
  }, []);

  return { isLoaded, error };
};
