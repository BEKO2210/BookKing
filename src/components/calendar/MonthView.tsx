import { useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { useCalendarStore } from '@/store/calendar-store';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export function MonthView() {
  const { currentDate, setDate, setView } = useCalendarStore();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const { bookings } = useBookings({
    from: format(monthStart, 'yyyy-MM-dd'),
    to: format(monthEnd, 'yyyy-MM-dd'),
  });
  const { services } = useServices();

  const days = useMemo(() => {
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [monthStart, monthEnd]);

  // Count bookings per day for occupancy coloring
  const bookingCountByDay = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of bookings) {
      if (b.status === 'cancelled' || b.status === 'rescheduled') continue;
      counts.set(b.date, (counts.get(b.date) ?? 0) + 1);
    }
    return counts;
  }, [bookings]);

  const getOccupancyColor = (count: number): string => {
    if (count === 0) return '';
    if (count <= 2) return 'bg-green-50';
    if (count <= 5) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const handleDayClick = (date: Date) => {
    setDate(date);
    setView('day');
  };

  return (
    <div className="card overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center py-3 text-xs font-medium text-gray-400 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const inMonth = isSameMonth(date, currentDate);
          const today = isToday(date);
          const count = bookingCountByDay.get(dateStr) ?? 0;

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(date)}
              className={`
                min-h-[80px] p-2 border-b border-r border-gray-50 text-left transition-colors
                hover:bg-gray-50
                ${!inMonth ? 'opacity-30' : ''}
                ${getOccupancyColor(count)}
              `}
            >
              <span
                className={`
                  inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
                  ${today ? 'bg-primary-600 text-white' : 'text-gray-700'}
                `}
              >
                {format(date, 'd')}
              </span>

              {count > 0 && inMonth && (
                <div className="mt-1">
                  <span className="text-[10px] font-medium text-gray-500">
                    {count} {count === 1 ? 'Termin' : 'Termine'}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
