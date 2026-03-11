import { useAnalytics } from '@/hooks/useAnalytics';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OccupancyRate } from '@/components/dashboard/OccupancyRate';
import { PopularTimesHeatmap } from '@/components/dashboard/PopularTimesHeatmap';

export function AnalyticsPage() {
  const { stats, isLoading } = useAnalytics();

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-48 animate-pulse bg-gray-50" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Statistiken</h1>
        <p className="text-gray-500 text-sm">Detaillierte Auswertungen Ihrer Buchungen.</p>
      </div>

      <div className="space-y-6">
        {/* Revenue */}
        <RevenueChart data={stats.revenueByDay} />

        {/* Occupancy + Popular services side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OccupancyRate rate={stats.occupancyRate} />

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Revenue pro Service
            </h3>
            <div className="space-y-3">
              {stats.popularServices.map((s) => (
                <div key={s.serviceId} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.name}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {s.count}x gebucht
                  </span>
                </div>
              ))}
              {stats.popularServices.length === 0 && (
                <p className="text-sm text-gray-400">Noch keine Daten.</p>
              )}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <PopularTimesHeatmap data={stats.popularTimes} />

        {/* No-show and customer ratios */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.noShowRate}%</p>
            <p className="text-sm text-gray-500 mt-1">No-Show Rate</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.newCustomers}</p>
            <p className="text-sm text-gray-500 mt-1">Neue Kunden (30 Tage)</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.returningCustomers}</p>
            <p className="text-sm text-gray-500 mt-1">Stammkunden (30 Tage)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
