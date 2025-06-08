
import React from 'react';
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapControlsProps {
  userLocation: {lat: number; lng: number} | null;
  onLocationRequest: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ userLocation, onLocationRequest }) => {
  return (
    <>
      <div className="absolute bottom-4 left-4 z-10 space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
          onClick={onLocationRequest}
        >
          <Navigation className="h-4 w-4 mr-1" />
          GPS
        </Button>
      </div>

      {userLocation && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="text-xs text-gray-600">📍 La tua posizione</div>
          <div className="text-sm font-medium text-gray-900">
            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </div>
        </div>
      )}
    </>
  );
};
