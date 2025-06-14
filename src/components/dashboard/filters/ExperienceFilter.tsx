
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface ExperienceFilterProps {
  isFirstVisit: boolean;
  onExperienceChange: (isFirstVisit: boolean) => void;
}

const ExperienceFilter: React.FC<ExperienceFilterProps> = ({ isFirstVisit, onExperienceChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Star className="h-5 w-5 text-purple-500" strokeWidth={1.5} />
        <Label className="font-bold text-gray-800 text-lg">Esperienza</Label>
      </div>
      <div className="space-y-3">
        <Button
          size="sm"
          variant={isFirstVisit ? "default" : "outline"}
          onClick={() => onExperienceChange(true)}
          className={`w-full text-sm font-medium ${
            isFirstVisit 
              ? 'bg-purple-500 hover:bg-purple-600 shadow-lg' 
              : 'hover:bg-purple-50 hover:border-purple-300 border-2'
          }`}
        >
          Prima visita
        </Button>
        <Button
          size="sm"
          variant={!isFirstVisit ? "default" : "outline"}
          onClick={() => onExperienceChange(false)}
          className={`w-full text-sm font-medium ${
            !isFirstVisit 
              ? 'bg-purple-500 hover:bg-purple-600 shadow-lg' 
              : 'hover:bg-purple-50 hover:border-purple-300 border-2'
          }`}
        >
          Locale/Esperto
        </Button>
      </div>
    </div>
  );
};

export default ExperienceFilter;
