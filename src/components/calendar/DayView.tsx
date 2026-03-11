import { useMemo } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useCalendarStore } from '@/store/calendar-store';
import { useBookings } from '@/hooks/useBookings';
import { useBlockers } from '@/hooks/useAvailability';
import { useServices } from '@/hooks/useServices';
import { AppointmentBlock } from './AppointmentBlock';
import { timeToMinutes } from '@/lib/slot-engine';
import type { CalendarEvent } from '@/types';

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 - 20:00
const HOUR_HEIGHT = 64;
const START_HOUR = 7;

export function DayView() {
  const { currentDate } = useCalendarStore();
  const dateStr = format(currentDate, 'yyyy-MM-dd');

  const { bookings } = useBookings({ from: dateStr, to: dateStr });
  const { blockers } = useBlockers();
  const { services } = useServices();

  const events = useMemo((): CalendarEvent[] => {
    const serviceMap = new Map(services.map((s) => [s.id, s]));
    const evts: CalendarEvent[] = [];

    for (const booking of bookings) {
      if (booking.date !== dateStr) continue;
      if (booking.status === 'cancelled' || booking.status === 'rescheduled') continue;

      const service = serviceMap.get(booking.serviceId);
      evts.push({
        id: booking.id,
        type: 'booking',
        title: service?.name ?? 'Termin',
        startTime: booking.startTime,
        endTime: booking.endTime,
        date: booking.date,
        color: service?.color ?? '#3b82f6',
        staffId: booking.staffId,
        booking,
      });
    }

    for (const blocker of blockers) {
      const bStart = blocker.startDate.split('T')[0];
      if (bStart !== dateStr && !blocker.isAllDay) continue;

      evts.push({
        id: blocker.id,
        type: 'blocker',
        title: blocker.reason ?? 'Gesperrt',
        startTime: blocker.isAllDay ? '07:00' : format(new Date(blocker.startDate), 'HH:mm'),
        endTime: blocker.isAllDay ? '20:00' : format(new Date(blocker.endDate), 'HH:mm'),
        date: dateStr,
        color: '#94a3b8',
        staffId: blocker.staffId,
        blocker,
      });
    }

    return evts;
  }, [bookings, blockers, services, dateStr]);

  const getEventStyle = (event: CalendarEvent): React.CSSProperties => {
    const startMin = timeToMinutes(event.startTime) - START_HOUR * 60;
    const endMin = timeToMinutes(event.endTime) - START_HOUR * 60;
    const top = (startMin / 60) * HOUR_HEIGHT;
    const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;

    return {
      top: `${top}px`,
      height: `${Math.max(height, 24)}px`,
    };
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">
          {format(currentDate, 'EEEE, d. MMMM', { locale: de })}
        </h3>
        <p className="text-sm text-gray-500">
          {events.filter((e) => e.type === 'booking').length} Termine
        </p>
      </div>

      <div className="relative overflow-y-auto" style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}>
        {/* Hour lines */}
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-gray-100 flex"
            style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
          >
            <div className="w-16 shrink-0 px-2 pt-1 text-xs text-gray-400 text-right">
              {String(hour).padStart(2, '0')}:00
            </div>
            <div className="flex-1 relative" />
          </div>
        ))}

        {/* Events */}
        <div className="absolute left-16 right-0 top-0 bottom-0">
          {events.map((event) => (
            <AppointmentBlock
              key={event.id}
              event={event}
              style={getEventStyle(event)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
