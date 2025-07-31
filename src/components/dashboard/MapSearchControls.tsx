import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface MapSearchControlsProps {
  isSearching: boolean;
  showSearchButton: boolean;
  onSearch: () => void;
  poiCount: number;
  isMobile?: boolean;
}

const MapSearchControls: React.FC<MapSearchControlsProps> = ({
  isSearching,
  showSearchButton,
  onSearch,
  poiCount,
  isMobile = false
}) => {
  return (
    <>
      {/* Search Button - Center Top */}
      {showSearchButton && !isSearching && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={onSearch}
            className="bg-blue-900 hover:bg-blue-800 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            size="sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Cerca in quest'area
          </Button>
        </div>
      )}

      {/* Searching Indicator - Center Top */}
      {isSearching && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-900" />
            <span className="text-sm font-medium text-gray-700">
              Cercando...
            </span>
          </div>
        </div>
      )}

      {/* POI Counter - Mobile optimized positioning */}
      <div className={`absolute z-10 ${isMobile ? 'top-2 left-2' : 'top-4 left-4'}`}>
        <div className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 ${isMobile ? 'px-2 py-1' : 'px-3 py-2'}`}>
          <span className={`font-medium text-blue-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            🟢 {poiCount} POI
          </span>
        </div>
      </div>
    </>
  );
};

export default MapSearchControls;