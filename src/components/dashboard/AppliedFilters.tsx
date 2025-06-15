
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Calendar, MapPin, Tag } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface AppliedFiltersProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: DateRange | undefined;
    isFirstVisit: boolean;
  };
  onRemoveFilter: (filterType: string, value?: string) => void;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({ filters, onRemoveFilter }) => {
  const getActiveFilters = () => {
    const activeFilters = [];

    // Zone filter
    if (filters.zone && filters.zone !== 'tuttalromagna') {
      const zoneNames: { [key: string]: string } = {
        centro: 'Centro',
        nord: 'Nord',
        sud: 'Sud',
        ovest: 'Ovest',
        est: 'Est'
      };
      activeFilters.push({
        type: 'zone',
        label: zoneNames[filters.zone] || filters.zone,
        icon: MapPin,
        onRemove: () => onRemoveFilter('zone')
      });
    }

    // Activity types filter
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutte')) {
      filters.activityTypes.forEach(activity => {
        if (activity !== 'tutte') {
          activeFilters.push({
            type: 'activity',
            label: activity,
            icon: Tag,
            onRemove: () => onRemoveFilter('activity', activity)
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

    // Children filter
    if (filters.withChildren === 'sì') {
      activeFilters.push({
        type: 'children',
        label: 'Con bambini',
        icon: Tag,
        onRemove: () => onRemoveFilter('children')
      });
    }

    // First visit filter
    if (!filters.isFirstVisit) {
      activeFilters.push({
        type: 'experience',
        label: 'Locale/Esperto',
        icon: Tag,
        onRemove: () => onRemoveFilter('experience')
      });
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Tag className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
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
              className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-2 rounded-full border border-blue-200 text-sm font-medium"
            >
              <IconComponent className="h-4 w-4" strokeWidth={1.5} />
              <span>{filter.label}</span>
              <button
                onClick={filter.onRemove}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
