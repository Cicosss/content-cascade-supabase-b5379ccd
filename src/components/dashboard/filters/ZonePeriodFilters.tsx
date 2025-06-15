
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useCalendarLogic } from "@/hooks/useCalendarLogic";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import CustomCalendar from "./CustomCalendar";

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
  onPeriodChange,
}) => {
  const zoneOptions = [
    "Tutta la Romagna",
    "Centro",
    "Nord",
    "Sud",
    "Ovest",
    "Est",
  ];

  const {
    selectedDateRange,
    isOpen,
    setIsOpen,
    handleDateRangeSelect,
    formatDisplayDateRange,
    clearDateRange,
  } = useCalendarLogic({
    initialDateRange: period,
    onDateRangeChange: onPeriodChange,
  });

  const today = new Date();
  const [calendarBase, setCalendarBase] = React.useState<{
    leftMonth: number;
    leftYear: number;
  }>(() => {
    let m = selectedDateRange?.from
      ? selectedDateRange.from.getMonth()
      : today.getMonth();
    let y = selectedDateRange?.from
      ? selectedDateRange.from.getFullYear()
      : today.getFullYear();
    return { leftMonth: m, leftYear: y };
  });

  function goToPreviousMonth() {
    setCalendarBase((prev) => {
      let month = prev.leftMonth - 1;
      let year = prev.leftYear;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      return { leftMonth: month, leftYear: year };
    });
  }
  function goToNextMonth() {
    setCalendarBase((prev) => {
      let month = prev.leftMonth + 1;
      let year = prev.leftYear;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      return { leftMonth: month, leftYear: year };
    });
  }

  function onDayClick(date: Date) {
    if (
      !selectedDateRange?.from ||
      (selectedDateRange?.from && selectedDateRange?.to)
    ) {
      handleDateRangeSelect({ from: date, to: undefined });
    } else if (selectedDateRange.from && !selectedDateRange.to) {
      if (date < selectedDateRange.from) {
        handleDateRangeSelect({ from: date, to: selectedDateRange.from });
      } else if (date > selectedDateRange.from) {
        handleDateRangeSelect({ from: selectedDateRange.from, to: date });
      } else {
        handleDateRangeSelect({ from: date, to: undefined });
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Zona */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold text-gray-800">Zona</Label>
        <select
          value={zone}
          onChange={(e) => onZoneChange(e.target.value)}
          className="border-2 rounded-lg h-12 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Seleziona zona
          </option>
          {zoneOptions.map((zoneOption) => (
            <option
              key={zoneOption}
              value={zoneOption.toLowerCase().replace(" ", "")}
              className="font-normal"
            >
              {zoneOption}
            </option>
          ))}
        </select>
      </div>

      {/* Periodo Vacanza */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold text-gray-800">
          Periodo Vacanza
        </Label>
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
                {formatDisplayDateRange(selectedDateRange) || (
                  <span>Seleziona periodo</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-white border rounded-xl overflow-hidden"
              align="start"
              style={{ width: 650, height: 400 }}
            >
              <CustomCalendar
                leftMonth={calendarBase.leftMonth}
                leftYear={calendarBase.leftYear}
                onPrevMonth={goToPreviousMonth}
                onNextMonth={goToNextMonth}
                onDayClick={onDayClick}
                range={selectedDateRange}
              />
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
