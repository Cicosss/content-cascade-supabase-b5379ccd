
import React from 'react';
import FilterHeader from './FilterHeader';
import CategoryFilters from './CategoryFilters';
import ZonePeriodFilters from './ZonePeriodFilters';
import { DateRange } from 'react-day-picker';

interface PrimaryFiltersProps {
  filters: {
    categories: string[];
    zone: string;
    period: DateRange | undefined;
  };
  updateFilter: (key: string, value: any) => void;
}

const PrimaryFilters: React.FC<PrimaryFiltersProps> = ({ filters, updateFilter }) => {
  return (
    <div className="space-y-8">
      <FilterHeader />
      <CategoryFilters 
        categories={filters.categories}
        onCategoriesChange={(categories) => updateFilter('categories', categories)}
      />
      <ZonePeriodFilters 
        zone={filters.zone}
        period={filters.period}
        onZoneChange={(zone) => updateFilter('zone', zone)}
        onPeriodChange={(period) => updateFilter('period', period)}
      />
    </div>
  );
};

export default PrimaryFilters;
