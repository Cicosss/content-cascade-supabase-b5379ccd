
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import FilterHeader from './filters/FilterHeader';
import ZoneFilter from './filters/ZoneFilter';
import ChildrenFilter from './filters/ChildrenFilter';
import PeriodFilter from './filters/PeriodFilter';
import ExperienceFilter from './filters/ExperienceFilter';
import ActivityTypesFilter from './filters/ActivityTypesFilter';
import AdvancedFiltersToggle from './filters/AdvancedFiltersToggle';
import TimeSlotFilter from './filters/TimeSlotFilter';
import BudgetFilter from './filters/BudgetFilter';
import SpecialPreferencesFilter from './filters/SpecialPreferencesFilter';

interface AdvancedFiltersProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
    timeSlots?: string[];
    budgets?: string[];
    specialPreferences?: string[];
  };
  setFilters: (filters: any) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ filters, setFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <FilterHeader />

      {/* Filtri Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <ZoneFilter 
          selectedZone={filters.zone} 
          onZoneChange={(zone) => updateFilter('zone', zone)} 
        />
        
        <ChildrenFilter 
          selectedOption={filters.withChildren} 
          onOptionChange={(option) => updateFilter('withChildren', option)} 
        />
        
        <PeriodFilter 
          selectedPeriod={filters.period} 
          onPeriodChange={(period) => updateFilter('period', period)} 
        />
        
        <ExperienceFilter 
          isFirstVisit={filters.isFirstVisit} 
          onExperienceChange={(isFirstVisit) => updateFilter('isFirstVisit', isFirstVisit)} 
        />
      </div>

      {/* Tipi di attività - Sezione orizzontale */}
      <ActivityTypesFilter 
        selectedTypes={filters.activityTypes} 
        onTypesChange={(types) => updateFilter('activityTypes', types)} 
      />

      {/* Switch per Filtri Avanzati */}
      <AdvancedFiltersToggle 
        showAdvanced={showAdvanced} 
        onToggle={setShowAdvanced} 
      />

      {/* Filtri Avanzati - Condizionali */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TimeSlotFilter 
            selectedSlots={filters.timeSlots || []} 
            onSlotsChange={(slots) => updateFilter('timeSlots', slots)} 
          />
          
          <BudgetFilter 
            selectedBudgets={filters.budgets || []} 
            onBudgetsChange={(budgets) => updateFilter('budgets', budgets)} 
          />
          
          <SpecialPreferencesFilter 
            selectedPreferences={filters.specialPreferences || []} 
            onPreferencesChange={(preferences) => updateFilter('specialPreferences', preferences)} 
          />
        </div>
      )}
    </Card>
  );
};

export default AdvancedFilters;
