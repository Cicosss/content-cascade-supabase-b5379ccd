
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface MapLoadingStateProps {
  loading: boolean;
  mapboxError: string | null;
  onRetry: () => void;
}

export const MapLoadingState: React.FC<MapLoadingStateProps> = ({ loading, mapboxError, onRetry }) => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [dots, setDots] = useState('');

  console.log('🔄 MapLoadingState render FINALE:', { 
    loading, 
    mapboxError, 
    loadingTime,
    timestamp: new Date().toISOString()
  });

  // Timer per il loading time
  useEffect(() => {
    if (loading && !mapboxError) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        setLoadingTime(Date.now() - startTime);
      }, 100);

      return () => clearInterval(timer);
    }
  }, [loading, mapboxError]);

  // Animazione dots
  useEffect(() => {
    if (loading && !mapboxError) {
      const dotsTimer = setInterval(() => {
        setDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);

      return () => clearInterval(dotsTimer);
    } else {
      setDots('');
    }
  }, [loading, mapboxError]);

  if (loading && !mapboxError) {
    const seconds = Math.floor(loadingTime / 1000);
    console.log('⏳ Rendering loading state VELOCE...', { 
      seconds,
      timestamp: new Date().toISOString()
    });
    
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center max-w-md p-6">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium text-lg mb-2">
            Caricamento mappa GPS{dots}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Connessione a Mapbox ultrarapida...
          </p>
          
          {seconds > 0 && (
            <p className="text-gray-400 text-xs mb-4">
              ⏱️ Tempo: {seconds}s {seconds >= 3 && '(forzando caricamento...)'}
            </p>
          )}
          
          <div className="text-xs text-gray-400 space-y-1">
            <div>🚀 Timeout aggressivo: 3s massimo</div>
            <div>💥 Cache busting attivo</div>
            <div>🔥 Fallback di emergenza</div>
            <div>⚡ Force load automatico</div>
          </div>
          
          {seconds >= 2 && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-700 text-xs font-medium">
                🚨 Caricamento in corso con fallback
              </p>
              <p className="text-orange-600 text-xs mt-1">
                Sistema di recovery automatico attivo
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mapboxError) {
    console.log('❌ Rendering error state FINALE:', mapboxError);
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Errore Mappa</h3>
          <p className="text-red-600 mb-4 text-sm leading-relaxed">{mapboxError}</p>
          
          <div className="space-y-3">
            <Button 
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              🔄 Riprova Caricamento Rapido
            </Button>
            
            <div className="text-xs text-red-500 space-y-1 bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="font-medium mb-2">🔧 Sistema ultra-aggressivo:</div>
              <div>• Timeout ridotto a 3 secondi</div>
              <div>• Cache busting automatico</div>
              <div>• Force load di emergenza</div>
              <div>• Recovery istantaneo</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('🤷 MapLoadingState: nessuna condizione soddisfatta');
  return null;
};
