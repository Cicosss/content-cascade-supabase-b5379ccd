
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
    <div className={cn('border-t border-gray-200 pt-8', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-yellow-500" strokeWidth={1.5} />
          <div className="flex items-center gap-2">
            <Label className="text-xl font-bold text-slate-900">
              Filtri Avanzati
            </Label>
            {activeCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeCount} attivi
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Label htmlFor="advanced-filters" className="text-sm font-medium cursor-pointer">
            Mostra filtri avanzati
          </Label>
          <Switch
            id="advanced-filters"
            checked={showAdvanced}
            onCheckedChange={onToggle}
          />
        </div>
      </div>
    </div>
  );
});

FilterToggle.displayName = 'FilterToggle';

export default FilterToggle;
