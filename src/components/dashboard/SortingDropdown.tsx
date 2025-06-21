
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'recommended' | 'popularity' | 'distance' | 'price_low' | 'price_high' | 'chronological';

interface SortingDropdownProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  showDistanceOption?: boolean;
  showPriceOptions?: boolean;
  showChronologicalOption?: boolean;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({
  sortBy,
  onSortChange,
  showDistanceOption = false,
  showPriceOptions = true,
  showChronologicalOption = false
}) => {
  const sortOptions = [
    { value: 'recommended', label: 'Consigliati da Noi' },
    { value: 'popularity', label: 'Popolarità' },
    ...(showDistanceOption ? [{ value: 'distance', label: 'Distanza' }] : []),
    ...(showPriceOptions ? [
      { value: 'price_low', label: 'Prezzo (dal più basso)' },
      { value: 'price_high', label: 'Prezzo (dal più alto)' }
    ] : []),
    ...(showChronologicalOption ? [{ value: 'chronological', label: 'Cronologico' }] : [])
  ];

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-2 text-slate-600">
        <ArrowUpDown className="h-4 w-4" />
        <span className="text-sm font-medium">Ordina per:</span>
      </div>
      <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
        <SelectTrigger className="w-[200px] bg-white border-slate-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200 shadow-lg z-50">
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="hover:bg-slate-50 cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingDropdown;
