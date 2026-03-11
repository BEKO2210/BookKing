import { BookingDashboard } from '@/components/dashboard/BookingDashboard';
import { BookingLink } from '@/components/ui/BookingLink';
import { useSettingsStore } from '@/store/settings-store';

export function Dashboard() {
  const provider = useSettingsStore((s) => s.provider);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Willkommen{provider ? `, ${provider.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">Ihr Dashboard im Überblick.</p>
      </div>

      <div className="mb-6">
        <BookingLink />
      </div>

      <BookingDashboard />
    </div>
  );
}
