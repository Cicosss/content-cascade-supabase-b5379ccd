
import React from 'react';
import AdvancedFilterGroup from '@/components/filters/AdvancedFilterGroup';
import { ADVANCED_FILTERS_CONFIG } from '@/config/advancedFiltersConfig';

interface AdvancedFiltersProps {
  budgets: string[];
  timeSlots: string[];
  specialPreferences: string[];
  onBudgetsChange: (budgets: string[]) => void;
  onTimeSlotsChange: (timeSlots: string[]) => void;
  onSpecialPreferencesChange: (preferences: string[]) => void;
}

const AdvancedFilters = React.memo<AdvancedFiltersProps>(({
  budgets,
  timeSlots,
  specialPreferences,
  onBudgetsChange,
  onTimeSlotsChange,
  onSpecialPreferencesChange
}) => {
  const filterGroups = React.useMemo(() => [
    {
      ...ADVANCED_FILTERS_CONFIG[0], // budgets
      selectedValues: budgets,
      onValuesChange: onBudgetsChange
    },
    {
      ...ADVANCED_FILTERS_CONFIG[1], // timeSlots
      selectedValues: timeSlots,
      onValuesChange: onTimeSlotsChange
    },
    {
      ...ADVANCED_FILTERS_CONFIG[2], // specialPreferences
      selectedValues: specialPreferences,
      onValuesChange: onSpecialPreferencesChange
    }
  ], [budgets, timeSlots, specialPreferences, onBudgetsChange, onTimeSlotsChange, onSpecialPreferencesChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
      {filterGroups.map((group) => (
        <AdvancedFilterGroup
          key={group.id}
          title={group.title}
          description={group.description}
          icon={group.icon}
          options={group.options}
          selectedValues={group.selectedValues}
          onValuesChange={group.onValuesChange}
        />
      ))}
    </div>
  );
});

AdvancedFilters.displayName = 'AdvancedFilters';

export default AdvancedFilters;
