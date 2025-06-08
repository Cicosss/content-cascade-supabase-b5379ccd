
import React from 'react';
import { Button } from '@/components/ui/button';

interface MapLoadingStateProps {
  loading: boolean;
  mapboxError: string | null;
  onRetry: () => void;
}

export const MapLoadingState: React.FC<MapLoadingStateProps> = ({ loading, mapboxError, onRetry }) => {
  if (loading && !mapboxError) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Caricamento mappa GPS...</p>
          <p className="text-gray-500 text-sm">Connessione a Mapbox in corso...</p>
        </div>
      </div>
    );
  }

  if (mapboxError) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl">
        <div className="text-center p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Errore Mappa</h3>
          <p className="text-red-600 mb-4">{mapboxError}</p>
          <Button 
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
