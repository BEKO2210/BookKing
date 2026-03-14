import { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  Users,
  Percent,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { TodaySchedule } from './TodaySchedule';
import { RevenueChart } from './RevenueChart';
import { OccupancyRate } from './OccupancyRate';
import { PopularTimesHeatmap } from './PopularTimesHeatmap';
import { LicenseStatusWidget, UpgradeBanner } from '@/components/license/UpgradeBanner';

export function BookingDashboard() {
  const { stats, isLoading } = useAnalytics();
  const [showTimeout, setShowTimeout] = useState(false);

  // Safety: if still loading after 5s, show fallback instead of infinite skeleton
  useEffect(() => {
    if (!isLoading && stats) {
      setShowTimeout(false);
      return;
    }
    const timer = setTimeout(() => setShowTimeout(true), 5000);
    return () => clearTimeout(timer);
  }, [isLoading, stats]);

  if ((isLoading || !stats) && !showTimeout) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-24 animate-pulse bg-gray-50" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-500 mb-3">Daten konnten nicht geladen werden.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary text-sm"
        >
          Seite neu laden
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* License status & upgrade banner */}
      <UpgradeBanner />
      <LicenseStatusWidget />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Calendar}
          label="Heute"
          value={String(stats.todayBookings)}
          sub="Termine"
          color="blue"
        />
        <KPICard
          icon={TrendingUp}
          label="Monatsumsatz"
          value={`${stats.monthRevenue.toFixed(0)} €`}
          sub="diesen Monat"
          color="green"
        />
        <KPICard
          icon={Percent}
          label="Auslastung"
          value={`${stats.occupancyRate}%`}
          sub="diesen Monat"
          color="amber"
        />
        <KPICard
          icon={AlertTriangle}
          label="No-Show Rate"
          value={`${stats.noShowRate}%`}
          sub="gesamt"
          color="red"
        />
      </div>

      {/* Customer metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <UserPlus size={16} className="text-blue-500" />
            <span className="text-sm text-gray-500">Neue Kunden</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.newCustomers}</p>
          <p className="text-xs text-gray-400">letzte 30 Tage</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-green-500" />
            <span className="text-sm text-gray-500">Stammkunden</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.returningCustomers}</p>
          <p className="text-xs text-gray-400">letzte 30 Tage</p>
        </div>
      </div>

      {/* Today's schedule */}
      <TodaySchedule />

      {/* Revenue chart */}
      <RevenueChart data={stats.revenueByDay} />

      {/* Popular services */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Beliebteste Services
        </h3>
        <div className="space-y-3">
          {stats.popularServices.map((s, i) => (
            <div key={s.serviceId} className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400 w-6">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{s.name}</span>
                  <span className="text-sm text-gray-500">{s.count}x</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{
                      width: `${(s.count / (stats.popularServices[0]?.count ?? 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          {stats.popularServices.length === 0 && (
            <p className="text-sm text-gray-400">Noch keine Daten.</p>
          )}
        </div>
      </div>

      {/* Popular times heatmap */}
      <PopularTimesHeatmap data={stats.popularTimes} />
    </div>
  );
}

interface KPICardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub: string;
  color: 'blue' | 'green' | 'amber' | 'red';
}

function KPICard({ icon: Icon, label, value, sub, color }: KPICardProps) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
          <Icon size={16} />
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}
