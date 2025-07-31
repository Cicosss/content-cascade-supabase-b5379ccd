
import React from 'react';
import { Loader2, Navigation, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/contexts/LocationContext';

interface MapControlsProps {
  onCenterOnUser: () => void;
  isLoadingLocation: boolean;
  isUserMarkerVisible?: boolean;
  isMobile?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ onCenterOnUser, isLoadingLocation, isUserMarkerVisible, isMobile = false }) => {
  const { userLocation, locationError } = useLocation();
  
  return (
    <div className={`absolute flex flex-col space-y-2 ${isMobile ? 'bottom-20 right-2' : 'bottom-4 left-4'}`}>
      {/* Bottone principale per centrare sulla posizione utente */}
      <Button
        size={isMobile ? "sm" : "sm"}
        variant="secondary"
        onClick={onCenterOnUser}
        disabled={isLoadingLocation}
        className={`bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white flex items-center gap-2 ${isMobile ? 'h-12 w-12 p-0' : ''}`}
        title="Trova la mia posizione"
      >
        {isLoadingLocation ? (
          <Loader2 className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'} animate-spin`} />
        ) : (
          <Navigation className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
        )}
        {!isMobile && <span className="hidden sm:inline text-xs font-medium">La mia posizione</span>}
      </Button>

      {/* Indicatore stato GPS - Solo desktop */}
      {!isMobile && (userLocation || locationError) && (
        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg px-3 py-2 text-xs">
          {userLocation ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              <span className="font-medium">GPS attivo</span>
              {isUserMarkerVisible && (
                <MapPin className="h-3 w-3" />
              )}
            </div>
          ) : locationError ? (
            <div className="flex items-center gap-2 text-amber-600">
              <Navigation className="h-3 w-3" />
              <span className="font-medium">GPS non disponibile</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MapControls;
