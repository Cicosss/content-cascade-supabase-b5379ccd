
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
    <div className={cn('border-t-2 border-gray-300 pt-8', className)}>
      <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-gradient-to-r from-white to-gray-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-yellow-50 border border-yellow-200">
            <Star className="h-6 w-6 text-yellow-600" strokeWidth={2} fill="currentColor" />
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-xl font-bold text-slate-900 cursor-pointer" htmlFor="advanced-filters">
              Filtri Avanzati
            </Label>
            {activeCount > 0 && (
              <span className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                {activeCount} attivi
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Label htmlFor="advanced-filters" className="text-sm font-medium text-slate-700 cursor-pointer">
            Mostra filtri avanzati
          </Label>
          <div className="p-1 rounded-lg border-2 border-slate-200 bg-white">
            <Switch
              id="advanced-filters"
              checked={showAdvanced}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

FilterToggle.displayName = 'FilterToggle';

export default FilterToggle;
