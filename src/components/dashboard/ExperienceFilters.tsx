
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useFiltersState } from '@/hooks/useFiltersState';
import FilterHeader from './filters/FilterHeader';
import CategoryFilters from './filters/CategoryFilters';
import PeriodFilters from './filters/PeriodFilters';

interface ExperienceFiltersProps {
  filters: {
    categories: string[];
    period: any;
  };
  setFilters: (filters: any) => void;
}

const ExperienceFilters = React.memo<ExperienceFiltersProps>(({ filters, setFilters }) => {
  const {
    activeFiltersCount,
    hasActiveFilters,
    updateCategories,
    updatePeriod,
    resetFilters
  } = useFiltersState({
    onFiltersChange: setFilters,
    debounceMs: 300
  });

  const handleReset = React.useCallback(() => {
    resetFilters();
  }, [resetFilters]);

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
          onCategoriesChange={updateCategories}
        />
        
        <PeriodFilters 
          period={filters.period}
          onPeriodChange={updatePeriod}
        />
      </div>
    </Card>
  );
});

ExperienceFilters.displayName = 'ExperienceFilters';

export default ExperienceFilters;
