
import { useEffect, useState } from 'react';
import { googleMapsApiService } from '@/services/googleMapsApiService';
import { fallbackMapService } from '@/services/fallbackMapService';
import { devLog } from '@/utils/devLogger';

export const useGoogleMapsLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        devLog.info('🚀 Starting enhanced Google Maps API load...');
        
        const google = await googleMapsApiService.loadMapsAPI();
        
        setIsLoaded(true);
        setError(null);
        setFallbackMode(false);
        setRetryCount(0);
        devLog.info('✅ Google Maps API loaded successfully');
      } catch (err: any) {
        const errorMessage = err.message || `Failed to load Google Maps: ${err}`;
        setError(errorMessage);
        setRetryCount(prev => prev + 1);
        
        console.error('❌ Google Maps loading error:', {
          error: err,
          retryCount: retryCount + 1,
          timestamp: new Date().toISOString()
        });

        // Attiva modalità fallback dopo 2 tentativi falliti
        if (retryCount >= 1) {
          devLog.warn('🗺️ Switching to fallback mode after multiple failures');
          setFallbackMode(true);
          setIsLoaded(true); // Considera "caricato" in modalità fallback
          setError('Modalità offline attivata - funzionalità limitate');
        }
      }
    };

    loadGoogleMaps();
  }, [retryCount]);

  // Auto-retry dopo 30 secondi se non in fallback mode
  useEffect(() => {
    if (error && !fallbackMode && retryCount < 3) {
      const timer = setTimeout(() => {
        devLog.info('🔄 Auto-retrying Google Maps load...');
        setError(null);
        // Il retryCount aumenterà attivando useEffect sopra
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [error, fallbackMode, retryCount]);

  return { 
    isLoaded, 
    error, 
    fallbackMode,
    retryCount,
    healthStatus: googleMapsApiService.getHealthStatus()
  };
};
