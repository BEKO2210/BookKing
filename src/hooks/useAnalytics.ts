import { useMemo } from 'react';
import { format, subDays, parseISO, isAfter, startOfMonth, endOfMonth } from 'date-fns';
import type { DashboardStats, Booking, Customer, Service, DayOfWeek } from '@/types';
import { useBookings } from './useBookings';
import { useCustomers } from './useCustomers';
import { useServices } from './useServices';

export function useAnalytics(): {
  stats: DashboardStats | null;
  isLoading: boolean;
} {
  const today = format(new Date(), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  const { bookings, isLoading: loadingBookings } = useBookings({
    from: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    to: monthEnd,
  });
  const { customers, isLoading: loadingCustomers } = useCustomers();
  const { services, isLoading: loadingServices } = useServices();

  const isLoading = loadingBookings || loadingCustomers || loadingServices;

  const stats = useMemo((): DashboardStats | null => {
    // Only block on loading if we have NO data at all yet.
    // Once any data arrives, compute stats from what's available.
    if (isLoading && bookings.length === 0 && customers.length === 0 && services.length === 0) {
      return null;
    }

    const confirmed = bookings.filter(
      (b) => b.status === 'confirmed' || b.status === 'completed',
    );
    const todayBookings = confirmed.filter((b) => b.date === today);
    const weekStart = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const weekBookings = confirmed.filter((b) => b.date >= weekStart);

    const monthBookings = confirmed.filter(
      (b) => b.date >= monthStart && b.date <= monthEnd,
    );
    const monthRevenue = monthBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Occupancy rate: booked slots / total available slots (simplified)
    const totalMonthBookings = bookings.filter(
      (b) => b.date >= monthStart && b.date <= monthEnd,
    );
    const occupancyRate =
      totalMonthBookings.length > 0
        ? (confirmed.filter((b) => b.date >= monthStart).length /
            Math.max(totalMonthBookings.length, 1)) *
          100
        : 0;

    // No-show rate
    const noShows = bookings.filter((b) => b.status === 'no-show');
    const noShowRate =
      bookings.length > 0 ? (noShows.length / bookings.length) * 100 : 0;

    // New vs returning customers
    const thirtyDaysAgo = subDays(new Date(), 30);
    const newCustomers = customers.filter((c) =>
      isAfter(parseISO(c.firstBookingAt), thirtyDaysAgo),
    ).length;
    const returningCustomers = customers.filter(
      (c) =>
        !isAfter(parseISO(c.firstBookingAt), thirtyDaysAgo) &&
        isAfter(parseISO(c.lastBookingAt), thirtyDaysAgo),
    ).length;

    // Popular services
    const serviceCounts = new Map<string, number>();
    for (const b of confirmed) {
      serviceCounts.set(b.serviceId, (serviceCounts.get(b.serviceId) ?? 0) + 1);
    }
    const serviceMap = new Map(services.map((s) => [s.id, s]));
    const popularServices = Array.from(serviceCounts.entries())
      .map(([serviceId, count]) => ({
        serviceId,
        name: serviceMap.get(serviceId)?.name ?? 'Unbekannt',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Popular times heatmap
    const timeCounts = new Map<string, number>();
    for (const b of confirmed) {
      const hour = parseInt(b.startTime.split(':')[0] ?? '0', 10);
      const day = new Date(b.date).getDay() as DayOfWeek;
      const key = `${day}-${hour}`;
      timeCounts.set(key, (timeCounts.get(key) ?? 0) + 1);
    }
    const popularTimes = Array.from(timeCounts.entries()).map(([key, count]) => {
      const [day, hour] = key.split('-').map(Number);
      return { hour: hour ?? 0, day: (day ?? 0) as DayOfWeek, count };
    });

    // Revenue by day (last 30 days)
    const revenueByDay: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayRevenue = confirmed
        .filter((b) => b.date === d)
        .reduce((sum, b) => sum + b.totalPrice, 0);
      revenueByDay.push({ date: d, revenue: dayRevenue });
    }

    return {
      todayBookings: todayBookings.length,
      weekBookings: weekBookings.length,
      monthRevenue,
      occupancyRate: Math.round(occupancyRate),
      noShowRate: Math.round(noShowRate * 10) / 10,
      newCustomers,
      returningCustomers,
      popularServices,
      popularTimes,
      revenueByDay,
    };
  }, [bookings, customers, services, isLoading, today, monthStart, monthEnd]);

  return { stats, isLoading };
}
