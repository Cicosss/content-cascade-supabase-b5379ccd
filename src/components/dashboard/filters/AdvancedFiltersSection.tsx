
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Star } from 'lucide-react';
import TagGroupFilter from './TagGroupFilter';

interface AdvancedFiltersSectionProps {
  filters: {
    budgets?: string[];
    specialPreferences?: string[];
  };
  updateFilter: (key: string, value: any) => void;
  showAdvanced: boolean;
  onToggleAdvanced: (show: boolean) => void;
}

const AdvancedFiltersSection: React.FC<AdvancedFiltersSectionProps> = ({ 
  filters, 
  updateFilter, 
  showAdvanced, 
  onToggleAdvanced 
}) => {
  const budgetOptions = ['Gratuito', '€', '€€', '€€€'];
  const preferenceOptions = ['Pet-Friendly', 'Accessibile', 'Adatto ai bambini', 'Romantico', 'Opzioni Vegetariane'];

  return (
    <div className="space-y-6">
      {/* Switch per Filtri Avanzati */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-500" strokeWidth={1.5} />
            <Label className="text-xl font-bold text-slate-900">Filtri Avanzati</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Label htmlFor="advanced-filters" className="text-sm font-medium">
              Mostra filtri avanzati
            </Label>
            <Switch
              id="advanced-filters"
              checked={showAdvanced}
              onCheckedChange={onToggleAdvanced}
            />
          </div>
        </div>
      </div>

      {/* Contenuto Filtri Avanzati */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showAdvanced 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Budget */}
          <TagGroupFilter
            title="Budget"
            options={budgetOptions}
            selectedOptions={filters.budgets || []}
            onOptionsChange={(options) => updateFilter('budgets', options)}
          />

          {/* Preferenze */}
          <TagGroupFilter
            title="Preferenze"
            options={preferenceOptions}
            selectedOptions={filters.specialPreferences || []}
            onOptionsChange={(options) => updateFilter('specialPreferences', options)}
          />

        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersSection;
