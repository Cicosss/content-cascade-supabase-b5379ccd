
import React from 'react';
import { Button } from '@/components/ui/button';

interface MapLoadingStateProps {
  loading: boolean;
  mapboxError: string | null;
  onRetry: () => void;
}

export const MapLoadingState: React.FC<MapLoadingStateProps> = ({ loading, mapboxError, onRetry }) => {
  console.log('🔄 MapLoadingState render:', { loading, mapboxError });

  if (loading && !mapboxError) {
    console.log('⏳ Rendering loading state...');
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Caricamento mappa GPS...</p>
          <p className="text-gray-500 text-sm">Connessione a Mapbox in corso...</p>
          <div className="mt-4 text-xs text-gray-400">
            🔍 Verifica token, connettività e supporto WebGL...
          </div>
        </div>
      </div>
    );
  }

  if (mapboxError) {
    console.log('❌ Rendering error state:', mapboxError);
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl">
        <div className="text-center p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Errore Mappa</h3>
          <p className="text-red-600 mb-4 max-w-md text-sm">{mapboxError}</p>
          <div className="space-y-3">
            <Button 
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              🔄 Riprova
            </Button>
            <div className="text-xs text-red-500 space-y-1">
              <div>• Verifica la connessione internet</div>
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
