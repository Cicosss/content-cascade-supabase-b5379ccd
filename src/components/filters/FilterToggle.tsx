
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterToggleProps {
  showAdvanced: boolean;
  onToggle: (show: boolean) => void;
  activeCount?: number;
  className?: string;
}

const FilterToggle = React.memo<FilterToggleProps>(({ 
  showAdvanced, 
  onToggle, 
  activeCount = 0,
  className 
}) => {
  return (
    <div className={cn('border-t border-gray-200 pt-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-5 w-5 text-blue-900" strokeWidth={2} />
          <Label className="text-lg font-bold text-blue-900">
            Filtri Avanzati
          </Label>
          {activeCount > 0 && (
            <span className="bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        
        <Switch
          checked={showAdvanced}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-blue-900"
        />
      </div>
    </div>
  );
});

FilterToggle.displayName = 'FilterToggle';

export default FilterToggle;
