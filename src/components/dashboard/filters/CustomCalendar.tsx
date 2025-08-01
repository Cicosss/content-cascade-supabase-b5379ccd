
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { it } from "date-fns/locale";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface CustomCalendarProps {
  leftMonth: number;
  leftYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (date: Date) => void;
  range: DateRange | undefined;
}

function getDaysMatrix(month: number, year: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  let dayOfWeek = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < dayOfWeek; ++i) week.push(null);

  for (let d = 1; d <= lastDay.getDate(); ++d) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  while (week.length && week.length < 7) week.push(null);
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

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  leftMonth: initialLeftMonth,
  leftYear: initialLeftYear,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  range,
}) => {
  const [leftMonth, setLeftMonth] = React.useState(initialLeftMonth);
  const [leftYear, setLeftYear] = React.useState(initialLeftYear);
  
  let rightMonth = leftMonth + 1;
  let rightYear = leftYear;
  if (rightMonth > 11) { rightMonth = 0; rightYear++; }

  const handlePrevMonth = () => {
    if (leftMonth === 0) {
      setLeftMonth(11);
      setLeftYear(leftYear - 1);
    } else {
      setLeftMonth(leftMonth - 1);
    }
    onPrevMonth();
  };

  const handleNextMonth = () => {
    if (leftMonth === 11) {
      setLeftMonth(0);
      setLeftYear(leftYear + 1);
    } else {
      setLeftMonth(leftMonth + 1);
    }
    onNextMonth();
  };

  function renderMonth(month: number, year: number, isLeft: boolean, isMobileView = false) {
    const daysMatrix = getDaysMatrix(month, year);
    const shortWeekdays = ["L", "M", "M", "G", "V", "S", "D"];

    return (
      <div className="flex-1 min-w-[280px] md:min-w-[310px] px-3 md:px-5 py-3 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          {/* Mobile: show both arrows, Desktop: show left arrow only on left month */}
          {(isMobileView || isLeft) ? (
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center"
              aria-label="Mese precedente"
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
          ) : <span className="w-7" />}
          
          <span className="text-base font-semibold text-gray-800 select-none">
            {format(new Date(year, month), "LLLL yyyy", { locale: it })}
          </span>
          
          {/* Mobile: show both arrows, Desktop: show right arrow only on right month */}
          {(isMobileView || !isLeft) ? (
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center"
              aria-label="Mese successivo"
              type="button"
            >
              <ArrowRight size={20} />
            </button>
          ) : <span className="w-7"></span>}
        </div>
        <div className="grid grid-cols-7 mb-2 gap-y-1">
          {shortWeekdays.map((wd, idx) => (
            <div key={idx} className="text-xs text-gray-400 font-medium text-center h-5 select-none">
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
                const isStart = isRangeStart(date, range);
                const isEnd = isRangeEnd(date, range);
                const inRange = !isStart && !isEnd && isInRange(date, range);
                const isCurrToday = isToday(date);

                let classNames =
                  "flex items-center justify-center cursor-pointer select-none rounded-full w-9 h-9 text-sm transition-all duration-150 ";

                if (isStart || isEnd) {
                  classNames +=
                    " bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 ";
                } else if (inRange) {
                  classNames +=
                    " bg-blue-100 text-blue-900 rounded-full ";
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
    <div
      className="w-full max-w-[650px] min-h-[350px] flex flex-col md:flex-row bg-white rounded-xl shadow-xl border-[.5px] border-gray-200 overflow-hidden"
      style={{
        maxWidth: "min(650px, 100vw - 2rem)",
      }}
    >
      <div className="md:hidden">
        {/* Mobile: Only show one month at a time with both navigation arrows */}
        {renderMonth(leftMonth, leftYear, true, true)}
      </div>
      <div className="hidden md:flex w-full">
        {/* Desktop: Show two months side by side */}
        {renderMonth(leftMonth, leftYear, true, false)}
        <div className="w-[2px] bg-gray-100 h-full"></div>
        {renderMonth(rightMonth, rightYear, false, false)}
      </div>
    </div>
  );
};

export default CustomCalendar;
