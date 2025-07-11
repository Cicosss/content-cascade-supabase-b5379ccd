import React from 'react';
import CustomCalendar from './CustomCalendar';
import { useCalendarLogic } from '@/hooks/useCalendarLogic';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PeriodFiltersProps {
  period: DateRange | undefined;
  onPeriodChange: (period: DateRange | undefined) => void;
}

const PeriodFilters: React.FC<PeriodFiltersProps> = ({ period, onPeriodChange }) => {
  const {
    selectedDateRange,
    formatDisplayDateRange,
    clearDateRange,
    handleDateRangeSelect
  } = useCalendarLogic({
    initialDateRange: period,
    onDateRangeChange: onPeriodChange
  });

  const displayText = selectedDateRange?.from 
    ? formatDisplayDateRange(selectedDateRange)
    : 'Seleziona le date del tuo soggiorno';

  const hasSelection = !!selectedDateRange?.from;

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📅</span>
          <h3 className="font-bold text-gray-800 text-lg">Periodo Vacanza</h3>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal border-2 hover:border-red-300 bg-white h-12"
            >
              <span className="flex-1 text-gray-700">
                {displayText}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CustomCalendar
              leftMonth={selectedDateRange?.from?.getMonth() || new Date().getMonth()}
              leftYear={selectedDateRange?.from?.getFullYear() || new Date().getFullYear()}
              onPrevMonth={() => {}}
              onNextMonth={() => {}}
              onDayClick={(date: Date) => {
                const newRange = { from: date, to: undefined };
                handleDateRangeSelect(newRange);
              }}
              range={selectedDateRange}
            />
          </PopoverContent>
        </Popover>

        {hasSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="text-red-500 hover:text-red-700 text-sm p-0 h-auto hover:bg-transparent"
          >
            <X className="h-4 w-4 mr-1" />
            Rimuovi date
          </Button>
        )}
      </div>
    </div>
  );
};

export default PeriodFilters;