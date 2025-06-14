
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ActivityTypesFilterProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

const ActivityTypesFilter: React.FC<ActivityTypesFilterProps> = ({ selectedTypes, onTypesChange }) => {
  const activityTypes = [
    { id: 'tutto', label: 'tutto', icon: '🎯' },
    { id: 'cibo', label: 'cibo', icon: '🍝' },
    { id: 'sport', label: 'sport', icon: '⚽' },
    { id: 'arte e cultura', label: 'arte e cultura', icon: '🎨' },
    { id: 'musica', label: 'musica', icon: '🎵' },
    { id: 'parchi e natura', label: 'parchi e natura', icon: '🌳' },
    { id: 'vita notturna', label: 'vita notturna', icon: '🌙' },
    { id: 'intrattenimento', label: 'intrattenimento', icon: '🎪' },
    { id: 'altro', label: 'altro', icon: '🔮' }
  ];

  const toggleActivityType = (type: string) => {
    if (type === 'tutto') {
      onTypesChange(['tutto']);
    } else {
      let newTypes = selectedTypes.filter(t => t !== 'tutto');
      if (newTypes.includes(type)) {
        newTypes = newTypes.filter(t => t !== type);
      } else {
        newTypes.push(type);
      }
      if (newTypes.length === 0) {
        newTypes = ['tutto'];
      }
      onTypesChange(newTypes);
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3">
        <span className="text-green-500 text-xl">🎯</span>
        <Label className="font-bold text-gray-800 text-lg">Tipi di attività</Label>
      </div>
      <div className="flex flex-wrap gap-3">
        {activityTypes.map((type) => (
          <Button
            key={type.id}
            size="sm"
            variant={selectedTypes.includes(type.id) ? "default" : "outline"}
            onClick={() => toggleActivityType(type.id)}
            className={`text-sm font-medium flex items-center gap-2 ${
              selectedTypes.includes(type.id)
                ? 'bg-green-500 hover:bg-green-600 shadow-lg' 
                : 'hover:bg-green-50 hover:border-green-300 border-2'
            }`}
          >
            <span className="text-base">{type.icon}</span>
            {type.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ActivityTypesFilter;
