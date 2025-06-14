
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface ZoneFilterProps {
  selectedZone: string;
  onZoneChange: (zone: string) => void;
}

const ZoneFilter: React.FC<ZoneFilterProps> = ({ selectedZone, onZoneChange }) => {
  const zones = ['tutto', 'centro', 'nord', 'sud', 'ovest', 'est'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MapPin className="h-5 w-5 text-red-500" strokeWidth={1.5} />
        <Label className="font-bold text-gray-800 text-lg">Zone della Romagna</Label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {zones.map((zone) => (
          <Button
            key={zone}
            size="sm"
            variant={selectedZone === zone ? "default" : "outline"}
            onClick={() => onZoneChange(zone)}
            className={`text-sm capitalize font-medium ${
              selectedZone === zone 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg' 
                : 'hover:bg-red-50 hover:border-red-300 border-2'
            }`}
          >
            {zone}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ZoneFilter;
