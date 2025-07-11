
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Calendar, MapPin, Tag } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface AppliedFiltersProps {
  filters: {
    categories: string[];
    period: DateRange | undefined;
    timeSlots?: string[];
    budgets?: string[];
    specialPreferences?: string[];
  };
  onRemoveFilter: (filterType: string, value?: string) => void;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({ filters, onRemoveFilter }) => {
  const getActiveFilters = () => {
    const activeFilters = [];


    // Categories filter
    if (filters.categories.length > 0 && !filters.categories.includes('tutte')) {
      filters.categories.forEach(category => {
        if (category !== 'tutte') {
          activeFilters.push({
            type: 'category',
            label: category,
            icon: Tag,
            onRemove: () => onRemoveFilter('category', category)
          });
        }
      });
    }

    // Period filter
    if (filters.period?.from) {
      const label = filters.period.to
        ? `${format(filters.period.from, 'dd MMM', { locale: it })} - ${format(filters.period.to, 'dd MMM yyyy', { locale: it })}`
        : format(filters.period.from, 'dd MMM yyyy', { locale: it });
      
      activeFilters.push({
        type: 'period',
        label: label,
        icon: Calendar,
        onRemove: () => onRemoveFilter('period')
      });
    }

    // Time slots filter
    if (filters.timeSlots && filters.timeSlots.length > 0) {
      filters.timeSlots.forEach(slot => {
        activeFilters.push({
          type: 'timeSlot',
          label: slot,
          icon: Tag,
          onRemove: () => onRemoveFilter('timeSlot', slot)
        });
      });
    }

    // Budget filter
    if (filters.budgets && filters.budgets.length > 0) {
      filters.budgets.forEach(budget => {
        activeFilters.push({
          type: 'budget',
          label: budget,
          icon: Tag,
          onRemove: () => onRemoveFilter('budget', budget)
        });
      });
    }

    // Special preferences filter
    if (filters.specialPreferences && filters.specialPreferences.length > 0) {
      filters.specialPreferences.forEach(pref => {
        activeFilters.push({
          type: 'specialPreference',
          label: pref,
          icon: Tag,
          onRemove: () => onRemoveFilter('specialPreference', pref)
        });
      });
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-4 z-sticky bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-8 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Tag className="h-5 w-5 text-blue-900" strokeWidth={1.5} />
          Filtri Applicati
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveFilter('all')}
          className="text-gray-500 hover:text-red-500 text-sm"
        >
          Rimuovi tutti
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => {
          const IconComponent = filter.icon;
          return (
            <div
              key={`${filter.type}-${index}`}
              className="flex items-center gap-2 bg-blue-900 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-md"
            >
              <IconComponent className="h-4 w-4" strokeWidth={1.5} />
              <span>{filter.label}</span>
              <button
                onClick={filter.onRemove}
                className="ml-1 hover:bg-blue-800 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppliedFilters;
