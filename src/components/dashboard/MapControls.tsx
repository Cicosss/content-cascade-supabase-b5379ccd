
import React from 'react';
import { Loader2, Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onCenterOnUser: () => void;
  isLoadingLocation: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ onCenterOnUser, isLoadingLocation }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={onCenterOnUser}
        disabled={isLoadingLocation}
        className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white flex items-center gap-2"
        title="Trova la mia posizione"
      >
        {isLoadingLocation ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Navigation className="h-4 w-4" />
        )}
        <span className="hidden sm:inline text-xs font-medium">La mia posizione</span>
      </Button>
    </div>
  );
};

export default MapControls;
