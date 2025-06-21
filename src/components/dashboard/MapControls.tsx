
import React from 'react';
import { Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  onCenterOnUser: () => void;
  isLoadingLocation: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ onCenterOnUser, isLoadingLocation }) => {
  return (
    <div className="absolute top-4 left-4 space-y-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={onCenterOnUser}
        disabled={isLoadingLocation}
        className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
      >
        {isLoadingLocation ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Navigation className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default MapControls;
