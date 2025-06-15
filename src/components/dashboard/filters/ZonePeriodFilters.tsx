
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { it } from "date-fns/locale";
import { useCalendarLogic } from "@/hooks/useCalendarLogic";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ZonePeriodFiltersProps {
  zone: string;
  period: DateRange | undefined;
  onZoneChange: (zone: string) => void;
  onPeriodChange: (period: DateRange | undefined) => void;
}

const WEEKDAYS = ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"];

function getDaysMatrix(month: number, year: number) {
  // Restituisce una matrice di settimane, ciascuna con 7 giorni (Date | null)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  // Giorno settimana 0: domenica in JS, ma in Italia inizia dal lunedì: calcolo corretto offset
  let dayOfWeek = (firstDay.getDay() + 6) % 7; // 0 (lun) ... 6 (dom)
  for (let i = 0; i < dayOfWeek; ++i) week.push(null);

  for (let d = 1; d <= lastDay.getDate(); ++d) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  while (week.length < 7) week.push(null);
  if (week.some((d) => d !== null)) matrix.push(week);

  return matrix;
}

function isSameDay(a?: Date, b?: Date) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(date: Date, range?: DateRange) {
  if (!range?.from) return false;
  if (range && range.from && !range.to) return isSameDay(date, range.from);
  if (range && range.from && range.to)
    return (
      date >= new Date(range.from.setHours(0, 0, 0, 0)) &&
      date <= new Date(range.to.setHours(23, 59, 59, 999))
    );
  return false;
}

function isRangeStart(date: Date, range?: DateRange) {
  return range?.from && isSameDay(date, range.from);
}
function isRangeEnd(date: Date, range?: DateRange) {
  return range?.to && isSameDay(date, range.to);
}
function isToday(date: Date) {
  const today = new Date();
  return isSameDay(date, today);
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

  // Determina mese/anno corrente: se selezionato dal, altrimenti oggi
  const today = new Date();
  const leftMonth = selectedDateRange?.from
    ? selectedDateRange.from.getMonth()
    : today.getMonth();
  const leftYear = selectedDateRange?.from
    ? selectedDateRange.from.getFullYear()
    : today.getFullYear();

  let rightMonth = leftMonth + 1;
  let rightYear = leftYear;
  if (rightMonth > 11) {
    rightMonth = 0;
    rightYear++;
  }

  function onDayClick(date: Date) {
    // re-implement range logic: click first date, next click = set to
    if (!selectedDateRange?.from || (selectedDateRange?.from && selectedDateRange?.to)) {
      handleDateRangeSelect({ from: date, to: undefined });
    } else if (selectedDateRange.from && !selectedDateRange.to) {
      // Selezione to: se data < from => inverti
      if (date < selectedDateRange.from) {
        handleDateRangeSelect({ from: date, to: selectedDateRange.from });
      } else if (date > selectedDateRange.from) {
        handleDateRangeSelect({ from: selectedDateRange.from, to: date });
      } else {
        handleDateRangeSelect({ from: date, to: undefined });
      }
    }
  }

  function renderMonth(month: number, year: number) {
    const daysMatrix = getDaysMatrix(month, year);

    return (
      <div className="flex-1 min-w-[320px] px-4 py-5">
        <div className="flex items-center justify-center mb-2">
          <span className="text-base font-semibold text-gray-800">
            {format(new Date(year, month), "LLLL yyyy", { locale: it })}
          </span>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="text-xs text-gray-400 font-medium text-center h-5">
              {wd}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 overflow-visible">
          {daysMatrix.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-0">
              {week.map((date, j) => {
                if (!date) {
                  return <div key={j} className="h-9"></div>;
                }

                const isStart = isRangeStart(date, selectedDateRange);
                const isEnd = isRangeEnd(date, selectedDateRange);
                const inRange =
                  !isStart &&
                  !isEnd &&
                  isInRange(date, selectedDateRange);
                const isCurrToday = isToday(date);

                let classNames =
                  "flex items-center justify-center cursor-pointer select-none rounded transition-colors w-9 h-9 text-sm ";

                if (isStart || isEnd) {
                  classNames +=
                    " bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 ";
                } else if (inRange) {
                  classNames +=
                    " bg-blue-100 text-blue-900 border-l border-r border-blue-300 ";
                } else if (isCurrToday) {
                  classNames +=
                    " border border-blue-500 text-blue-600 font-semibold bg-white ";
                } else {
                  classNames +=
                    " text-gray-700 hover:bg-blue-50 ";
                }

                return (
                  <div
                    key={j}
                    className={classNames}
                    onClick={() => onDayClick(date)}
                    data-today={isCurrToday}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
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
              <div className="w-[650px] h-[400px] flex bg-white">
                {renderMonth(leftMonth, leftYear)}
                <div className="w-[2px] bg-gray-100 h-full"></div>
                {renderMonth(rightMonth, rightYear)}
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
