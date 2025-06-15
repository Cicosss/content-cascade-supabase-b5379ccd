
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useCalendarLogic } from '@/hooks/useCalendarLogic';
import { DateRange } from 'react-day-picker';

interface ZonePeriodFiltersProps {
  zone: string;
  period: DateRange | undefined;
  onZoneChange: (zone: string) => void;
  onPeriodChange: (period: DateRange | undefined) => void;
}

const ZonePeriodFilters: React.FC<ZonePeriodFiltersProps> = ({ 
  zone, 
  period, 
  onZoneChange, 
  onPeriodChange 
}) => {
  const zoneOptions = [
    'Tutta la Romagna',
    'Centro', 
    'Nord', 
    'Sud', 
    'Ovest', 
    'Est'
  ];

  const {
    selectedDateRange,
    isOpen,
    setIsOpen,
    handleDateRangeSelect,
    formatDisplayDateRange,
    clearDateRange
  } = useCalendarLogic({
    initialDateRange: period,
    onDateRangeChange: onPeriodChange
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Zona */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold text-gray-800">Zona</Label>
        <Select value={zone} onValueChange={onZoneChange}>
          <SelectTrigger className="border-2 h-12 bg-white hover:bg-gray-50 transition-colors">
            <SelectValue placeholder="Seleziona zona" />
          </SelectTrigger>
          <SelectContent>
            {zoneOptions.map((zoneOption) => (
              <SelectItem key={zoneOption} value={zoneOption.toLowerCase().replace(' ', '')}>
                {zoneOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Periodo Vacanza */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold text-gray-800">Periodo Vacanza</Label>
        <div className="flex gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal border-2 h-12 bg-white hover:bg-gray-50 transition-colors",
                  !selectedDateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={1.5} />
                {formatDisplayDateRange(selectedDateRange) || <span>Seleziona periodo</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border shadow-xl rounded-lg" align="start">
              <div className="w-[650px] h-[400px] bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Calendar
                  mode="range"
                  selected={selectedDateRange}
                  onSelect={handleDateRangeSelect}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  locale={it}
                  numberOfMonths={2}
                  className="w-full h-full pointer-events-auto bg-white p-4"
                  classNames={{
                    months: "flex flex-row w-full h-full",
                    month: "flex-1 p-4",
                    caption: "flex justify-center pt-2 pb-4 relative items-center",
                    caption_label: "text-lg font-semibold text-gray-900",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
                    nav_button_previous: "absolute left-4",
                    nav_button_next: "absolute right-4",
                    table: "w-full border-collapse",
                    head_row: "hidden",
                    row: "flex w-full mb-1",
                    cell: "w-8 h-8 text-center text-sm p-0 relative flex items-center justify-center",
                    day: "w-7 h-7 p-0 font-normal hover:bg-blue-50 rounded-md transition-colors cursor-pointer flex items-center justify-center text-gray-700 text-sm",
                    day_range_end: "bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium",
                    day_range_start: "bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium",
                    day_today: "bg-gray-100 text-gray-900 font-semibold rounded-md",
                    day_outside: "text-gray-300 opacity-50",
                    day_disabled: "text-gray-200 opacity-30 cursor-not-allowed hover:bg-transparent",
                    day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900 hover:bg-blue-100 rounded-none",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
          {selectedDateRange?.from && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearDateRange}
              className="h-12 w-12 border-2 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZonePeriodFilters;
