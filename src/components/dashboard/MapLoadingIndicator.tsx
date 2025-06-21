
import React from 'react';
import { Loader2 } from 'lucide-react';

interface MapLoadingIndicatorProps {
  isLoadingPOIs: boolean;
}

const MapLoadingIndicator: React.FC<MapLoadingIndicatorProps> = ({ isLoadingPOIs }) => {
  if (!isLoadingPOIs) return null;

  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Caricamento POI...
      </div>
    </div>
  );
};

export default MapLoadingIndicator;
