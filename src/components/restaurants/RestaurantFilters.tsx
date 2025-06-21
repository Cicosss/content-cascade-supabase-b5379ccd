
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface RestaurantFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const RestaurantFilters: React.FC<RestaurantFiltersProps> = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange
}) => {
  const categories = [
    { value: 'all', label: 'Tutti' },
    { value: 'Ristoranti', label: 'Ristoranti' },
    { value: 'Agriturismi', label: 'Agriturismi' },
    { value: 'Cantine', label: 'Cantine' },
    { value: 'Street Food', label: 'Street Food' },
    { value: 'Mercati', label: 'Mercati' }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cerca ristoranti..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilters;
