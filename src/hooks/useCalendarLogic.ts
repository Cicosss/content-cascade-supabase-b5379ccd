
import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface UseCalendarLogicProps {
  onDateChange?: (date: Date | undefined) => void;
  initialDate?: Date;
}

export const useCalendarLogic = ({ onDateChange, initialDate }: UseCalendarLogicProps = {}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setIsOpen(false);
    onDateChange?.(date);
    
    if (date) {
      console.log('📅 Data selezionata per filtro POI:', format(date, 'PPP', { locale: it }));
    } else {
      console.log('📅 Filtro data rimosso');
    }
  }, [onDateChange]);

  const formatDisplayDate = useCallback((date: Date | undefined) => {
    if (!date) return null;
    return format(date, 'PPP', { locale: it });
  }, []);

  const clearDate = useCallback(() => {
    handleDateSelect(undefined);
  }, [handleDateSelect]);

  useEffect(() => {
    if (selectedDate) {
      console.log('📅 Hook calendario: data aggiornata ->', formatDisplayDate(selectedDate));
    }
  }, [selectedDate, formatDisplayDate]);

  return {
    selectedDate,
    isOpen,
    setIsOpen,
    handleDateSelect,
    formatDisplayDate,
    clearDate
  };
};
