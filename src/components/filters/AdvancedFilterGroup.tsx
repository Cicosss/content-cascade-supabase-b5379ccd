
import React from 'react';
import { Label } from '@/components/ui/label';
import UnifiedFilterButton from './UnifiedFilterButton';
import { cn } from '@/lib/utils';

interface AdvancedFilterOption {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface AdvancedFilterGroupProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  options: AdvancedFilterOption[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  className?: string;
}

const AdvancedFilterGroup = React.memo<AdvancedFilterGroupProps>(({
  title,
  description,
  icon: GroupIcon,
  options,
  selectedValues,
  onValuesChange,
  className
}) => {
  const handleToggle = React.useCallback((value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onValuesChange(newValues);
  }, [selectedValues, onValuesChange]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <GroupIcon className="h-5 w-5 text-blue-900" strokeWidth={2} />
          <Label className="text-lg font-bold text-blue-900">
            {title}
          </Label>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => (
          <UnifiedFilterButton
            key={option.value}
            label={option.label}
            icon={option.icon}
            isSelected={selectedValues.includes(option.value)}
            onClick={() => handleToggle(option.value)}
            className="justify-start"
          />
        ))}
      </div>
    </div>
  );
});

AdvancedFilterGroup.displayName = 'AdvancedFilterGroup';

export default AdvancedFilterGroup;
