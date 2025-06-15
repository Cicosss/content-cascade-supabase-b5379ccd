
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TagGroupFilterProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
  color: 'emerald' | 'purple' | 'blue';
}

const TagGroupFilter: React.FC<TagGroupFilterProps> = ({ 
  title, 
  options, 
  selectedOptions, 
  onOptionsChange,
  color 
}) => {
  const toggleOption = (option: string) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(o => o !== option)
      : [...selectedOptions, option];
    
    onOptionsChange(newOptions);
  };

  const getColorClasses = (isSelected: boolean) => {
    const baseClasses = 'text-sm font-medium rounded-lg px-4 py-2 transition-all';
    
    if (isSelected) {
      switch (color) {
        case 'emerald':
          return `${baseClasses} bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg`;
        case 'purple':
          return `${baseClasses} bg-purple-500 hover:bg-purple-600 text-white shadow-lg`;
        case 'blue':
          return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white shadow-lg`;
      }
    } else {
      return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-gray-800">{title}</Label>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={selectedOptions.includes(option) ? "default" : "outline"}
            onClick={() => toggleOption(option)}
            className={getColorClasses(selectedOptions.includes(option))}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TagGroupFilter;
