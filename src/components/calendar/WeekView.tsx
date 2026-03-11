import { useMemo } from 'react';
import { format, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { useCalendarStore, getWeekDates } from '@/store/calendar-store';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { AppointmentBlock } from './AppointmentBlock';
import { timeToMinutes } from '@/lib/slot-engine';
import type { CalendarEvent } from '@/types';

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);
const HOUR_HEIGHT = 56;
const START_HOUR = 7;

export function WeekView() {
  const { currentDate } = useCalendarStore();
  const weekDates = getWeekDates(currentDate);
  const startStr = format(weekDates[0]!, 'yyyy-MM-dd');
  const endStr = format(weekDates[6]!, 'yyyy-MM-dd');

  const { bookings } = useBookings({ from: startStr, to: endStr });
  const { services } = useServices();

  const eventsByDay = useMemo(() => {
    const serviceMap = new Map(services.map((s) => [s.id, s]));
    const byDay = new Map<string, CalendarEvent[]>();

    for (const booking of bookings) {
      if (booking.status === 'cancelled' || booking.status === 'rescheduled') continue;
      const service = serviceMap.get(booking.serviceId);
      const event: CalendarEvent = {
        id: booking.id,
        type: 'booking',
        title: service?.name ?? 'Termin',
        startTime: booking.startTime,
        endTime: booking.endTime,
        date: booking.date,
        color: service?.color ?? '#3b82f6',
        staffId: booking.staffId,
        booking,
      };
      const existing = byDay.get(booking.date) ?? [];
      existing.push(event);
      byDay.set(booking.date, existing);
    }

    return byDay;
  }, [bookings, services]);

  const getEventStyle = (event: CalendarEvent): React.CSSProperties => {
    const startMin = timeToMinutes(event.startTime) - START_HOUR * 60;
    const endMin = timeToMinutes(event.endTime) - START_HOUR * 60;
    const top = (startMin / 60) * HOUR_HEIGHT;
    const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;

    return {
      top: `${top}px`,
      height: `${Math.max(height, 20)}px`,
    };
  };

  return (
    <div className="card overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100">
        <div />
        {weekDates.map((date) => (
          <div
            key={date.toISOString()}
            className={`text-center py-3 ${isToday(date) ? 'bg-primary-50' : ''}`}
          >
            <p className="text-xs text-gray-400 uppercase">
              {format(date, 'EEE', { locale: de })}
            </p>
            <p
              className={`text-lg font-semibold ${
                isToday(date) ? 'text-primary-600' : 'text-gray-900'
              }`}
            >
              {format(date, 'd')}
            </p>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div
        className="relative overflow-y-auto"
        style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
      >
        {/* Hour lines */}
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-gray-50"
            style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
          >
            <div className="w-[60px] px-2 pt-0.5 text-[11px] text-gray-400 text-right">
              {String(hour).padStart(2, '0')}:00
            </div>
          </div>
        ))}

        {/* Day columns */}
        <div className="absolute left-[60px] right-0 top-0 bottom-0 grid grid-cols-7">
          {weekDates.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayEvents = eventsByDay.get(dateStr) ?? [];

            return (
              <div
                key={dateStr}
                className={`relative border-l border-gray-50 ${
                  isToday(date) ? 'bg-primary-50/30' : ''
                }`}
              >
                {dayEvents.map((event) => (
                  <AppointmentBlock
                    key={event.id}
                    event={event}
                    style={getEventStyle(event)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
