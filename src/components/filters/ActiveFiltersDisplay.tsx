
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ZONES_CONFIG, BUDGET_OPTIONS, TIME_SLOTS, SPECIAL_PREFERENCES } from '@/config/filtersConfig';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface ActiveFiltersDisplayProps {
  filters: {
    categories: string[];
    zone: string;
    period: DateRange | undefined;
    timeSlots?: string[];
    budgets?: string[];
    specialPreferences?: string[];
  };
  onRemoveFilter: (filterKey: string, value?: string) => void;
  className?: string;
}

const ActiveFiltersDisplay = React.memo<ActiveFiltersDisplayProps>(({
  filters,
  onRemoveFilter,
  className = ''
}) => {
  const getFilterLabel = (key: string, value: string) => {
    switch (key) {
      case 'zone':
        return ZONES_CONFIG.find(z => z.value === value)?.label || value;
      case 'budgets':
        return BUDGET_OPTIONS.find(b => b.value === value)?.label || value;
      case 'timeSlots':
        return TIME_SLOTS.find(t => t.value === value)?.label || value;
      case 'specialPreferences':
        return SPECIAL_PREFERENCES.find(p => p.value === value)?.label || value;
      default:
        return value;
    }
  };

  const activeFilters = React.useMemo(() => {
    const active = [];

    // Categories (exclude 'tutte')
    if (filters.categories.length > 0 && !filters.categories.includes('tutte')) {
      filters.categories.forEach(category => {
        active.push({
          key: 'categories',
          value: category,
          label: category,
          display: `Categoria: ${category}`
        });
      });
    }

    // Zone (exclude default)
    if (filters.zone && filters.zone !== 'tuttalromagna') {
      active.push({
        key: 'zone',
        value: filters.zone,
        label: getFilterLabel('zone', filters.zone),
        display: `Zona: ${getFilterLabel('zone', filters.zone)}`
      });
    }

    // Period
    if (filters.period?.from) {
      const periodText = filters.period.to 
        ? `${format(filters.period.from, 'dd/MM')} - ${format(filters.period.to, 'dd/MM')}`
        : format(filters.period.from, 'dd/MM/yyyy');
      active.push({
        key: 'period',
        value: 'period',
        label: periodText,
        display: `Periodo: ${periodText}`
      });
    }

    // Time slots
    filters.timeSlots?.forEach(slot => {
      active.push({
        key: 'timeSlots',
        value: slot,
        label: getFilterLabel('timeSlots', slot),
        display: getFilterLabel('timeSlots', slot)
      });
    });

    // Budgets
    filters.budgets?.forEach(budget => {
      active.push({
        key: 'budgets',
        value: budget,
        label: getFilterLabel('budgets', budget),
        display: `Budget: ${getFilterLabel('budgets', budget)}`
      });
    });

    // Special preferences
    filters.specialPreferences?.forEach(pref => {
      active.push({
        key: 'specialPreferences',
        value: pref,
        label: getFilterLabel('specialPreferences', pref),
        display: getFilterLabel('specialPreferences', pref)
      });
    });

    return active;
  }, [filters]);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700">Filtri Attivi ({activeFilters.length})</h4>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.key}-${filter.value}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 pl-3 pr-1 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
          >
            <span className="text-xs">{filter.display}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveFilter(filter.key, filter.value)}
              className="h-4 w-4 p-0 hover:bg-blue-300 rounded-full ml-1"
              aria-label={`Rimuovi filtro ${filter.display}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
});

ActiveFiltersDisplay.displayName = 'ActiveFiltersDisplay';

export default ActiveFiltersDisplay;
