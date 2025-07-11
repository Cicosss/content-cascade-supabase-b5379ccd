import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface MapSearchControlsProps {
  isSearching: boolean;
  showSearchButton: boolean;
  onSearch: () => void;
  poiCount: number;
}

const MapSearchControls: React.FC<MapSearchControlsProps> = ({
  isSearching,
  showSearchButton,
  onSearch,
  poiCount
}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex items-center gap-3">
        {/* Search Button */}
        {showSearchButton && !isSearching && (
          <Button
            onClick={onSearch}
            className="bg-blue-900 hover:bg-blue-800 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            size="sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Cerca in quest'area
          </Button>
        )}

        {/* Searching Indicator */}
        {isSearching && (
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-900" />
            <span className="text-sm font-medium text-gray-700">
              Cercando...
            </span>
          </div>
        )}

        {/* POI Counter */}
        {!showSearchButton && !isSearching && (
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm font-semibold text-gray-700">
              {poiCount} POI trovati
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSearchControls;