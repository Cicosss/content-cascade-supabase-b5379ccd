
import React from 'react';
import { Card } from '@/components/ui/card';
import RestaurantsCarousel from './content/RestaurantsCarousel';
import ExperiencesCarousel from './content/ExperiencesCarousel';
import EventsCarousel from './content/EventsCarousel';
import HelpBanner from './content/HelpBanner';
import SortingDropdown, { SortOption } from './SortingDropdown';
import AppliedFilters from './AppliedFilters';
import { useURLFilters } from '@/hooks/useURLFilters';

const PersonalizedContent: React.FC = () => {
  const { filters, updateFilters, removeFilter } = useURLFilters();
  const [sortBy, setSortBy] = React.useState<SortOption>('recommended');

  const handleRemoveFilter = (filterType: string, value?: string) => {
    if (filterType === 'all') {
      // Reset all filters
      updateFilters({
        categories: ['tutte'],
        zone: 'tuttalromagna',
        period: undefined,
        timeSlots: [],
        budgets: [],
        specialPreferences: []
      });
    } else {
      removeFilter(filterType, value);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filtri Applicati */}
      <AppliedFilters 
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
      />

      {/* Sezione Ristoranti e Gastronomia */}
      <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gusto & Sapori</h2>
            <p className="text-gray-600">Scopri i migliori ristoranti e sapori della Romagna</p>
          </div>
          <SortingDropdown 
            sortBy={sortBy}
            onSortChange={setSortBy}
            showDistanceOption={true}
            showPriceOptions={true}
          />
        </div>
        <RestaurantsCarousel />
      </Card>

      {/* Sezione Esperienze */}
      <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Esperienze Uniche</h2>
            <p className="text-gray-600">Vivi momenti indimenticabili nel territorio romagnolo</p>
          </div>
          <SortingDropdown 
            sortBy={sortBy}
            onSortChange={setSortBy}
            showDistanceOption={true}
            showPriceOptions={true}
          />
        </div>
        <ExperiencesCarousel />
      </Card>

      {/* Sezione Eventi */}
      <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Eventi & Spettacoli</h2>
            <p className="text-gray-600">Non perdere gli eventi più interessanti della zona</p>
          </div>
          <SortingDropdown 
            sortBy={sortBy}
            onSortChange={setSortBy}
            showChronologicalOption={true}
            showPriceOptions={false}
          />
        </div>
        <EventsCarousel />
      </Card>

      {/* Banner di Aiuto */}
      <HelpBanner />
    </div>
  );
};

export default PersonalizedContent;
