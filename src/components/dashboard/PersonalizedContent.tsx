
import React from 'react';
import { Card } from '@/components/ui/card';
import RestaurantsCarousel from './content/RestaurantsCarousel';
import ExperiencesCarousel from './content/ExperiencesCarousel';
import EventsCarousel from './content/EventsCarousel';
import HelpBanner from './content/HelpBanner';
import SortingDropdown, { SortOption } from './SortingDropdown';
import AppliedFilters from './AppliedFilters';
import { useURLFilters } from '@/hooks/useURLFilters';
import { usePersonalizedContent } from '@/hooks/usePersonalizedContentFixed';

const PersonalizedContent: React.FC = () => {
  const { filters, updateFilters, removeFilter, updateSortBy } = useURLFilters();
  const { data: allData, isLoading } = usePersonalizedContent(filters);

  // Transform the data into the expected format for each carousel
  const restaurants = allData.filter(item => item.category === 'restaurant' || item.category === 'ristorante') || [];
  const experiences = allData.filter(item => item.category === 'experience' || item.category === 'esperienza') || [];
  const events = allData.filter(item => item.category === 'event' || item.category === 'evento') || [];

  const handleRemoveFilter = (filterType: string, value?: string) => {
    if (filterType === 'all') {
      // Reset all filters
      updateFilters({
        categories: ['tutte'],
        zone: 'tuttalromagna',
        period: undefined,
        timeSlots: [],
        budgets: [],
        specialPreferences: [],
        sortBy: filters.sortBy
      });
    } else {
      removeFilter(filterType, value);
    }
  };

  const handleSortChange = (sortBy: SortOption) => {
    updateSortBy(sortBy);
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
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
            showDistanceOption={true}
            showPriceOptions={true}
          />
        </div>
        <RestaurantsCarousel 
          restaurants={restaurants}
          filters={{
            isFirstVisit: false,
            withChildren: filters.specialPreferences?.includes('famiglia') ? 'sì' : 'no'
          }}
        />
      </Card>

      {/* Sezione Esperienze */}
      <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Esperienze Uniche</h2>
            <p className="text-gray-600">Vivi momenti indimenticabili nel territorio romagnolo</p>
          </div>
          <SortingDropdown 
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
            showDistanceOption={true}
            showPriceOptions={true}
          />
        </div>
        <ExperiencesCarousel 
          experiences={experiences}
          filters={{
            withChildren: filters.specialPreferences?.includes('famiglia') ? 'sì' : 'no'
          }}
        />
      </Card>

      {/* Sezione Eventi */}
      <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Eventi & Spettacoli</h2>
            <p className="text-gray-600">Non perdere gli eventi più interessanti della zona</p>
          </div>
          <SortingDropdown 
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
            showChronologicalOption={true}
            showPriceOptions={false}
          />
        </div>
        <EventsCarousel events={events} />
      </Card>

      {/* Banner di Aiuto */}
      <HelpBanner />
    </div>
  );
};

export default PersonalizedContent;
