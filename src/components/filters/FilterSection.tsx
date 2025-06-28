
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FilterSectionProps {
  title: string;
  icon?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const FilterSection = React.memo<FilterSectionProps>(({ 
  title, 
  icon, 
  description, 
  children, 
  className,
  titleClassName 
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <Label className={cn('text-lg font-semibold text-gray-800', titleClassName)}>
            {title}
          </Label>
        </div>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
});

FilterSection.displayName = 'FilterSection';

export default FilterSection;
