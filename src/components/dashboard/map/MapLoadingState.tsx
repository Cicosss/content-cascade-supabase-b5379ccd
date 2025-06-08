
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

  console.log('🔄 MapLoadingState render:', { loading, mapboxError, loadingTime });

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
    console.log('⏳ Rendering loading state...', { seconds });
    
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center max-w-md p-6">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium text-lg mb-2">
            Caricamento mappa GPS{dots}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Connessione a Mapbox in corso...
          </p>
          
          {seconds > 0 && (
            <p className="text-gray-400 text-xs mb-4">
              ⏱️ Tempo trascorso: {seconds}s
            </p>
          )}
          
          <div className="text-xs text-gray-400 space-y-1">
            <div>🔍 Verifica token Mapbox...</div>
            <div>🌐 Test connettività di rete...</div>
            <div>🖥️ Controllo supporto WebGL...</div>
            <div>🗺️ Inizializzazione mappa...</div>
          </div>
          
          {seconds > 10 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 text-xs font-medium">
                ⚠️ Caricamento più lento del normale
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                Questo può accadere con connessioni lente o problemi temporanei
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mapboxError) {
    console.log('❌ Rendering error state:', mapboxError);
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
              🔄 Riprova Caricamento
            </Button>
            
            <div className="text-xs text-red-500 space-y-1 bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="font-medium mb-2">🔧 Possibili soluzioni:</div>
              <div>• Verifica la connessione internet</div>
              <div>• Ricarica la pagina (F5)</div>
              <div>• Controlla se WebGL è supportato</div>
              <div>• Il token Mapbox potrebbe essere scaduto</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('🤷 MapLoadingState: nessuna condizione soddisfatta');
  return null;
};
