
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface TimeSlotFilterProps {
  selectedSlots: string[];
  onSlotsChange: (slots: string[]) => void;
}

const TimeSlotFilter: React.FC<TimeSlotFilterProps> = ({ selectedSlots, onSlotsChange }) => {
  const timeSlots = ['Mattina (6-12)', 'Pomeriggio (12-18)', 'Sera (18-24)', 'Notte (24-6)'];

  const toggleTimeSlot = (slot: string) => {
    let newSlots;
    if (selectedSlots.includes(slot)) {
      newSlots = selectedSlots.filter(s => s !== slot);
    } else {
      newSlots = [...selectedSlots, slot];
    }
    onSlotsChange(newSlots);
  };

  return (
    <div className="space-y-3">
      <Label className="font-semibold text-gray-700 flex items-center gap-2">
        <Clock className="h-4 w-4 text-indigo-500" strokeWidth={1.5} />
        Fascia oraria preferita
      </Label>
      <div className="grid grid-cols-1 gap-2">
        {timeSlots.map((time) => (
          <Button
            key={time}
            size="sm"
            variant={selectedSlots.includes(time) ? "default" : "outline"}
            onClick={() => toggleTimeSlot(time)}
            className={`justify-start text-sm ${
              selectedSlots.includes(time)
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg'
                : 'hover:bg-indigo-50 hover:border-indigo-300 border-2'
            }`}
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotFilter;
