import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import { getStatusLabel, getStatusBadgeClass } from '@/lib/utils';

export function TodaySchedule() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { bookings } = useBookings({ from: today, to: today });
  const { services } = useServices();

  const serviceMap = new Map(services.map((s) => [s.id, s]));
  const todayBookings = bookings
    .filter((b) => b.date === today && b.status !== 'cancelled' && b.status !== 'rescheduled')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Clock size={16} />
        Heutige Termine ({todayBookings.length})
      </h3>

      {todayBookings.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">
          Keine Termine heute.
        </p>
      ) : (
        <div className="space-y-3">
          {todayBookings.map((booking) => {
            const service = serviceMap.get(booking.serviceId);
            return (
              <div
                key={booking.id}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div
                  className="w-1 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: service?.color ?? '#3b82f6' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {service?.name ?? 'Termin'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.startTime} – {booking.endTime}
                  </p>
                </div>
                <span className={getStatusBadgeClass(booking.status)}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
