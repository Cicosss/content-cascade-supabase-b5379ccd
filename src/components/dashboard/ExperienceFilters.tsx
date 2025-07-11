
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useFiltersState } from '@/hooks/useFiltersState';
import FilterHeader from './filters/FilterHeader';
import CategoryFilters from './filters/CategoryFilters';
import PeriodFilters from './filters/PeriodFilters';
import AdvancedFilters from './filters/AdvancedFilters';
import FilterToggle from '@/components/filters/FilterToggle';

interface ExperienceFiltersProps {
  filters: {
    categories: string[];
    period: any;
    timeSlots?: string[];
    budgets?: string[];
    specialPreferences?: string[];
  };
  setFilters: (filters: any) => void;
}

const ExperienceFilters = React.memo<ExperienceFiltersProps>(({ filters, setFilters }) => {
  const {
    showAdvanced,
    activeFiltersCount,
    hasActiveFilters,
    resetFilters,
    toggleAdvanced
  } = useFiltersState({
    onFiltersChange: setFilters,
    debounceMs: 300
  });

  const updateFilter = React.useCallback((key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  }, [filters, setFilters]);

  // Calcola i filtri avanzati attivi
  const advancedFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.timeSlots?.length > 0) count++;
    if (filters.budgets?.length > 0) count++;
    if (filters.specialPreferences?.length > 0) count++;
    return count;
  }, [filters.timeSlots, filters.budgets, filters.specialPreferences]);

  const handleReset = React.useCallback(() => {
    resetFilters();
    setFilters({
      categories: ['tutte'],
      period: undefined,
      timeSlots: [],
      budgets: [],
      specialPreferences: []
    });
  }, [resetFilters, setFilters]);

  return (
    <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <div className="space-y-8">
        {/* Header con pulsante reset */}
        <div className="flex items-center justify-between">
          <FilterHeader />
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2 border-2 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filtri
            </Button>
          )}
        </div>

        {/* Filtri principali */}
        <CategoryFilters 
          categories={filters.categories}
          onCategoriesChange={(categories) => updateFilter('categories', categories)}
        />
        
        <PeriodFilters 
          period={filters.period}
          onPeriodChange={(period) => updateFilter('period', period)}
        />

        {/* Toggle filtri avanzati */}
        <FilterToggle 
          showAdvanced={showAdvanced}
          onToggle={toggleAdvanced}
          activeCount={advancedFiltersCount}
        />

        {/* Filtri avanzati con animazione fluida */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showAdvanced 
            ? 'max-h-[600px] opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          {showAdvanced && (
            <AdvancedFilters
              budgets={filters.budgets || []}
              timeSlots={filters.timeSlots || []}
              specialPreferences={filters.specialPreferences || []}
              onBudgetsChange={(budgets) => updateFilter('budgets', budgets)}
              onTimeSlotsChange={(timeSlots) => updateFilter('timeSlots', timeSlots)}
              onSpecialPreferencesChange={(preferences) => updateFilter('specialPreferences', preferences)}
            />
          )}
        </div>
      </div>
    </Card>
  );
});

ExperienceFilters.displayName = 'ExperienceFilters';

export default ExperienceFilters;
