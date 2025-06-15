
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PrimaryFilters from './filters/PrimaryFilters';
import AdvancedFiltersSection from './filters/AdvancedFiltersSection';

interface ExperienceFiltersProps {
  filters: {
    categories: string[];
    zone: string;
    period: any;
    timeSlots?: string[];
    budgets?: string[];
    specialPreferences?: string[];
  };
  setFilters: (filters: any) => void;
}

const ExperienceFilters: React.FC<ExperienceFiltersProps> = ({ filters, setFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <PrimaryFilters 
        filters={filters}
        updateFilter={updateFilter}
      />
      
      <AdvancedFiltersSection 
        filters={filters}
        updateFilter={updateFilter}
        showAdvanced={showAdvanced}
        onToggleAdvanced={setShowAdvanced}
      />
    </Card>
  );
};

export default ExperienceFilters;
