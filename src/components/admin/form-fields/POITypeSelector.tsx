
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface POITypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const POITypeSelector: React.FC<POITypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label>Tipo di POI *</Label>
      <RadioGroup
        value={value || 'place'}
        onValueChange={onChange}
        className="flex flex-row gap-6 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="place" id="place" />
          <Label htmlFor="place">📍 Luogo Permanente</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="event" id="event" />
          <Label htmlFor="event">🗓️ Evento Temporaneo</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default POITypeSelector;
