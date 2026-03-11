import { useState } from 'react';
import { X, CalendarOff } from 'lucide-react';
import { useBlockers } from '@/hooks/useAvailability';
import { useSettingsStore } from '@/store/settings-store';
import { format } from 'date-fns';

interface BlockerFormProps {
  onClose: () => void;
}

export function BlockerForm({ onClose }: BlockerFormProps) {
  const { createBlocker } = useBlockers();
  const provider = useSettingsStore((s) => s.provider);

  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [isAllDay, setIsAllDay] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = isAllDay
      ? `${startDate}T00:00:00`
      : `${startDate}T${startTime}:00`;
    const end = isAllDay
      ? `${endDate}T23:59:59`
      : `${endDate}T${endTime}:00`;

    createBlocker.mutate({
      providerId: provider?.id ?? '',
      startDate: start,
      endDate: end,
      reason: reason || undefined,
      isAllDay,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarOff size={20} className="text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Zeitraum sperren</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="blocker-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Grund (optional)
            </label>
            <input
              id="blocker-reason"
              type="text"
              className="input-field"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="z.B. Urlaub, Fortbildung..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600"
            />
            <span className="text-sm text-gray-700">Ganzer Tag</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="blocker-start" className="block text-sm font-medium text-gray-700 mb-1">
                Von
              </label>
              <input
                id="blocker-start"
                type="date"
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="blocker-end" className="block text-sm font-medium text-gray-700 mb-1">
                Bis
              </label>
              <input
                id="blocker-end"
                type="date"
                className="input-field"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {!isAllDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="blocker-start-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Von (Uhrzeit)
                </label>
                <input
                  id="blocker-start-time"
                  type="time"
                  className="input-field"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="blocker-end-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Bis (Uhrzeit)
                </label>
                <input
                  id="blocker-end-time"
                  type="time"
                  className="input-field"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Abbrechen
            </button>
            <button type="submit" className="btn-primary flex-1">
              Sperren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
