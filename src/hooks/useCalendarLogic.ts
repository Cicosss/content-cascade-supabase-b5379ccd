
import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface UseCalendarLogicProps {
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
  initialDateRange?: DateRange;
}

export const useCalendarLogic = ({ onDateRangeChange, initialDateRange }: UseCalendarLogicProps = {}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(initialDateRange);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateRangeSelect = useCallback((range: DateRange | undefined) => {
    setSelectedDateRange(range);
    onDateRangeChange?.(range);
    
    if (range?.from && range?.to) {
      setIsOpen(false);
      console.log('📅 Periodo selezionato per filtro POI:', 
        `Dal ${format(range.from, 'PPP', { locale: it })} al ${format(range.to, 'PPP', { locale: it })}`);
    } else if (range?.from) {
      console.log('📅 Data di inizio selezionata:', format(range.from, 'PPP', { locale: it }));
    } else {
      console.log('📅 Filtro periodo rimosso');
    }
  }, [onDateRangeChange]);

  const formatDisplayDateRange = useCallback((range: DateRange | undefined) => {
    if (!range?.from) return null;
    if (!range.to) return format(range.from, 'PPP', { locale: it });
    return `${format(range.from, 'dd MMM', { locale: it })} - ${format(range.to, 'dd MMM yyyy', { locale: it })}`;
  }, []);

  const clearDateRange = useCallback(() => {
    handleDateRangeSelect(undefined);
  }, [handleDateRangeSelect]);

  useEffect(() => {
    if (selectedDateRange?.from) {
      console.log('📅 Hook calendario: periodo aggiornato ->', formatDisplayDateRange(selectedDateRange));
    }
  }, [selectedDateRange, formatDisplayDateRange]);

  return {
    selectedDateRange,
    isOpen,
    setIsOpen,
    handleDateRangeSelect,
    formatDisplayDateRange,
    clearDateRange
  };
};
