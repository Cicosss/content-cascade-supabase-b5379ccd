
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar } from 'lucide-react';

interface POITypeSelectorProps {
  selectedType: 'place' | 'event' | '';
  onTypeChange: (type: 'place' | 'event') => void;
}

const POITypeSelector: React.FC<POITypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Cosa stai aggiungendo?</h3>
        <p className="text-gray-600">Seleziona il tipo di proposta che vuoi inserire</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer border-2 transition-all hover:shadow-md ${
            selectedType === 'place' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onTypeChange('place')}
        >
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                selectedType === 'place' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <MapPin className={`h-8 w-8 ${
                  selectedType === 'place' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <Label className="text-lg font-semibold">📍 Un Luogo</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Ristorante, Museo, Negozio, Spiaggia...
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Attività permanenti sempre disponibili
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer border-2 transition-all hover:shadow-md ${
            selectedType === 'event' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onTypeChange('event')}
        >
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                selectedType === 'event' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Calendar className={`h-8 w-8 ${
                  selectedType === 'event' ? 'text-green-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <Label className="text-lg font-semibold">🗓️ Un Evento</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Concerto, Sagra, Mostra...
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Attività temporanee con date specifiche
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POITypeSelector;
