
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
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
      <div className="group relative flex items-center justify-between p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
           onClick={() => onToggle(!showAdvanced)}>
        
        {/* Decorative accent */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <Star className="h-7 w-7 text-white" strokeWidth={2} fill="currentColor" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Label className="text-xl font-bold text-slate-900 cursor-pointer group-hover:text-indigo-900 transition-colors duration-200" htmlFor="advanced-filters">
                Filtri Avanzati
              </Label>
              <span className="text-sm text-slate-600 font-medium">
                Personalizza la tua ricerca
              </span>
            </div>
            {activeCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
                  {activeCount} {activeCount === 1 ? 'filtro attivo' : 'filtri attivi'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-5 relative z-10">
          <div className="flex items-center gap-3">
            <Label htmlFor="advanced-filters" className="text-base font-semibold text-slate-700 cursor-pointer group-hover:text-indigo-700 transition-colors duration-200">
              {showAdvanced ? 'Nascondi' : 'Mostra'} filtri
            </Label>
            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-indigo-100 transition-colors duration-200">
              {showAdvanced ? (
                <ChevronUp className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
              )}
            </div>
          </div>
          
          <div className="p-2 rounded-xl border-2 border-indigo-200 bg-white shadow-sm group-hover:border-indigo-300 group-hover:shadow-md transition-all duration-200">
            <Switch
              id="advanced-filters"
              checked={showAdvanced}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-slate-300 scale-110"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

FilterToggle.displayName = 'FilterToggle';

export default FilterToggle;
