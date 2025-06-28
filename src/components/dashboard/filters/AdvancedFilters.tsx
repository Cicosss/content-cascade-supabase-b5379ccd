
import React from 'react';
import FilterSection from '@/components/filters/FilterSection';
import FilterChip from '@/components/filters/FilterChip';
import { BUDGET_OPTIONS, TIME_SLOTS, SPECIAL_PREFERENCES } from '@/config/filtersConfig';

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
  const handleToggle = React.useCallback((
    currentValues: string[],
    value: string,
    onChange: (values: string[]) => void
  ) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onChange(newValues);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
      {/* Budget */}
      <FilterSection title="Budget" icon="💰" description="Fascia di prezzo per persona">
        <div className="flex flex-col gap-2">
          {BUDGET_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              icon={option.icon}
              isSelected={budgets.includes(option.value)}
              onClick={() => handleToggle(budgets, option.value, onBudgetsChange)}
              variant="budget"
              size="sm"
              className="justify-start"
            />
          ))}
        </div>
      </FilterSection>

      {/* Fasce Orarie */}
      <FilterSection title="Fasce Orarie" icon="🕐" description="Quando preferisci le attività">
        <div className="flex flex-col gap-2">
          {TIME_SLOTS.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              icon={option.icon}
              isSelected={timeSlots.includes(option.value)}
              onClick={() => handleToggle(timeSlots, option.value, onTimeSlotsChange)}
              variant="default"
              size="sm"
              className="justify-start"
            />
          ))}
        </div>
      </FilterSection>

      {/* Preferenze Speciali */}
      <FilterSection title="Preferenze Speciali" icon="✨" description="Caratteristiche specifiche">
        <div className="flex flex-wrap gap-2">
          {SPECIAL_PREFERENCES.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              icon={option.icon}
              isSelected={specialPreferences.includes(option.value)}
              onClick={() => handleToggle(specialPreferences, option.value, onSpecialPreferencesChange)}
              variant="preference"
              size="sm"
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
});

AdvancedFilters.displayName = 'AdvancedFilters';

export default AdvancedFilters;
