
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getAllCategories } from '@/config/categoryMapping';

interface PrimaryFiltersProps {
  filters: {
    categories: string[];
    zone: string;
    period: any;
  };
  updateFilter: (key: string, value: any) => void;
}

const PrimaryFilters: React.FC<PrimaryFiltersProps> = ({ filters, updateFilter }) => {
  const allCategories = getAllCategories();
  const zoneOptions = [
    'Tutta la Romagna',
    'Centro', 
    'Nord', 
    'Sud', 
    'Ovest', 
    'Est'
  ];

  const toggleCategory = (category: string) => {
    if (category === 'Tutte') {
      updateFilter('categories', ['tutte']);
      return;
    }

    const categoriesWithoutAll = filters.categories.filter(c => c !== 'tutte');
    const newCategories = categoriesWithoutAll.includes(category)
      ? categoriesWithoutAll.filter(c => c !== category)
      : [...categoriesWithoutAll, category];

    updateFilter('categories', newCategories.length === 0 ? ['tutte'] : newCategories);
  };

  const isAllSelected = filters.categories.includes('tutte');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Filter className="h-8 w-8 text-blue-600 mr-4" strokeWidth={1.5} />
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Filtra le Esperienze
          </h2>
          <p className="text-slate-600 mt-1">
            Scopri la Romagna su misura per te
          </p>
        </div>
      </div>

      {/* Filtro Categorie */}
      <div className="space-y-4">
        <Label className="text-xl font-bold text-slate-900">Categorie</Label>
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant={isAllSelected ? "default" : "outline"}
            onClick={() => toggleCategory('Tutte')}
            className={`rounded-full px-6 py-2 font-medium transition-all ${
              isAllSelected
                ? 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg'
                : 'border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            Tutte
          </Button>
          {allCategories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={filters.categories.includes(category) ? "default" : "outline"}
              onClick={() => toggleCategory(category)}
              className={`rounded-full px-6 py-2 font-medium transition-all ${
                filters.categories.includes(category)
                  ? 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg'
                  : 'border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Zona e Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Zona */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-gray-800">Zona</Label>
          <Select value={filters.zone} onValueChange={(value) => updateFilter('zone', value)}>
            <SelectTrigger className="border-2 h-12">
              <SelectValue placeholder="Seleziona zona" />
            </SelectTrigger>
            <SelectContent>
              {zoneOptions.map((zone) => (
                <SelectItem key={zone} value={zone.toLowerCase().replace(' ', '')}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Data */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold text-gray-800">Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-2 h-12",
                  !filters.period && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={1.5} />
                {filters.period ? format(filters.period, "PPP") : <span>Seleziona data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.period}
                onSelect={(date) => updateFilter('period', date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default PrimaryFilters;
