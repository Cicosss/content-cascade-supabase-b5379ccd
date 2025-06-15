
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
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

  const handleDateSelect = (date: Date | undefined) => {
    updateFilter('period', date);
    console.log('📅 Data selezionata:', date ? format(date, 'PPP', { locale: it }) : 'Nessuna data');
  };

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
            <SelectTrigger className="border-2 h-12 bg-white hover:bg-gray-50 transition-colors">
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
                  "w-full justify-start text-left font-normal border-2 h-12 bg-white hover:bg-gray-50 transition-colors",
                  !filters.period && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={1.5} />
                {filters.period ? format(filters.period, "PPP", { locale: it }) : <span>Seleziona data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-2 shadow-lg" align="start">
              <Calendar
                mode="single"
                selected={filters.period}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                locale={it}
                className="p-4 pointer-events-auto bg-white"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-gray-600 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-blue-50 rounded-md transition-colors",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 rounded-md transition-colors",
                  day_range_end: "day-range-end",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white rounded-md",
                  day_today: "bg-blue-100 text-blue-900 font-semibold rounded-md",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-300 opacity-30 cursor-not-allowed",
                  day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900",
                  day_hidden: "invisible",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default PrimaryFilters;
