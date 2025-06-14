
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';

interface ChildrenFilterProps {
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

const ChildrenFilter: React.FC<ChildrenFilterProps> = ({ selectedOption, onOptionChange }) => {
  const childrenOptions = ['no', 'sì'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-blue-500" strokeWidth={1.5} />
        <Label className="font-bold text-gray-800 text-lg">Con bambini</Label>
      </div>
      <div className="flex gap-3">
        {childrenOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={selectedOption === option ? "default" : "outline"}
            onClick={() => onOptionChange(option)}
            className={`text-sm font-medium flex-1 ${
              selectedOption === option 
                ? 'bg-blue-500 hover:bg-blue-600 shadow-lg' 
                : 'hover:bg-blue-50 hover:border-blue-300 border-2'
            }`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChildrenFilter;
