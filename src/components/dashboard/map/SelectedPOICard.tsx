
import React from 'react';
import { MapPin, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface POI {
  id: string;
  name: string;
  description: string;
  poi_type: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  target_audience: string;
}

interface SelectedPOICardProps {
  selectedPoi: POI;
  onClose: () => void;
}

export const SelectedPOICard: React.FC<SelectedPOICardProps> = ({ selectedPoi, onClose }) => {
  const getPoiIcon = (category: string) => {
    const icons: Record<string, string> = {
      'cibo': '🍽️',
      'arte e cultura': '🏛️',
      'sport': '⚽',
      'musica': '🎵',
      'parchi e natura': '🌳',
      'vita notturna': '🌙',
      'intrattenimento': '🎭'
    };
    return icons[category] || '📍';
  };

  const getDirections = (poi: POI) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`, '_blank');
  };

  return (
    <div className="p-4 bg-gray-50 border-t">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getPoiIcon(selectedPoi.category)}</span>
          <h3 className="font-bold text-lg text-gray-900">{selectedPoi.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded"
        >
          ✕
        </button>
      </div>
      <p className="text-gray-600 text-sm mb-3">{selectedPoi.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {selectedPoi.address}
        </div>
        <Button
          size="sm"
          onClick={() => getDirections(selectedPoi)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Car className="h-4 w-4 mr-1" />
          Indicazioni
        </Button>
      </div>
    </div>
  );
};
