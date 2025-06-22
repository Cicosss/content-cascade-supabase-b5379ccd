
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TagGroupFilterProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
  color?: 'blue'; // Standardized to only blue
}

const TagGroupFilter: React.FC<TagGroupFilterProps> = ({ 
  title, 
  options, 
  selectedOptions, 
  onOptionsChange 
}) => {
  const toggleOption = (option: string) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(o => o !== option)
      : [...selectedOptions, option];
    
    onOptionsChange(newOptions);
  };

  // Standardized styling following the same pattern as categories
  const getButtonClassName = (isSelected: boolean) => {
    const baseClasses = "text-sm font-medium rounded-lg px-4 py-2 transition-all duration-200 border-2";
    if (isSelected) {
      return `${baseClasses} bg-blue-900 border-blue-900 text-white hover:bg-blue-800 hover:border-blue-800 shadow-md`;
    } else {
      return `${baseClasses} bg-white border-blue-900 text-blue-900 hover:bg-blue-50 hover:border-blue-800`;
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
            onClick={() => toggleOption(option)}
            className={getButtonClassName(selectedOptions.includes(option))}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TagGroupFilter;
