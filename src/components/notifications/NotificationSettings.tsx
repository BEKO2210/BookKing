import { useState } from 'react';
import { Bell, Mail, Smartphone, Clock } from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';
import { requestPushPermission } from '@/lib/notifications';

export function NotificationSettings() {
  const { provider, updateSettings } = useSettingsStore();
  const [pushEnabled, setPushEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted',
  );

  const settings = provider?.settings;
  if (!settings) return null;

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    setPushEnabled(granted);
  };

  const handleReminderChange = (index: number, value: number) => {
    const times = [...settings.reminderTimes];
    times[index] = value;
    updateSettings({ reminderTimes: times });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={20} />
          Benachrichtigungen
        </h3>

        {/* Push notifications */}
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Push-Benachrichtigungen
                </p>
                <p className="text-xs text-gray-500">
                  Neue Buchungen, Stornierungen
                </p>
              </div>
            </div>
            {pushEnabled ? (
              <span className="badge bg-green-50 text-green-700">Aktiv</span>
            ) : (
              <button onClick={handleEnablePush} className="btn-primary text-sm py-1.5 px-3">
                Aktivieren
              </button>
            )}
          </div>
        </div>

        {/* Email notifications */}
        <div className="card p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Mail size={18} className="text-gray-400" />
            <p className="text-sm font-medium text-gray-900">
              E-Mail-Benachrichtigungen
            </p>
          </div>

          <div className="space-y-2 ml-8">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
              Buchungsbestätigung an Kunden
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
              Stornierungsbenachrichtigung
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600" />
              Warteliste-Benachrichtigung
            </label>
          </div>
        </div>

        {/* Reminder times */}
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={18} className="text-gray-400" />
            <p className="text-sm font-medium text-gray-900">
              Erinnerungen an Kunden
            </p>
          </div>

          <div className="space-y-3 ml-8">
            {settings.reminderTimes.map((time, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  className="input-field text-sm w-auto"
                  value={time}
                  onChange={(e) => handleReminderChange(i, Number(e.target.value))}
                >
                  <option value={60}>1 Stunde vorher</option>
                  <option value={120}>2 Stunden vorher</option>
                  <option value={360}>6 Stunden vorher</option>
                  <option value={720}>12 Stunden vorher</option>
                  <option value={1440}>24 Stunden vorher</option>
                  <option value={2880}>48 Stunden vorher</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
