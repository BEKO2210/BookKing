import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Download,
} from 'lucide-react';
import { useCalendarStore, getViewTitle } from '@/store/calendar-store';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import type { CalendarView } from '@/types';

const views: { key: CalendarView; label: string }[] = [
  { key: 'day', label: 'Tag' },
  { key: 'week', label: 'Woche' },
  { key: 'month', label: 'Monat' },
];

interface CalendarHeaderProps {
  onAddBlocker: () => void;
}

export function CalendarHeader({ onAddBlocker }: CalendarHeaderProps) {
  const { view, setView, currentDate, goBack, goForward, goToToday } =
    useCalendarStore();
  const { exportIcal } = useCalendarSync();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Zurück"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goForward}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Vor"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          {getViewTitle(view, currentDate)}
        </h2>

        <button
          onClick={goToToday}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Heute
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* View switcher */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === v.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button
          onClick={onAddBlocker}
          className="btn-secondary flex items-center gap-1.5 text-sm"
        >
          <Plus size={16} />
          Blocker
        </button>

        <button
          onClick={exportIcal}
          className="btn-secondary flex items-center gap-1.5 text-sm"
          title="iCal Export"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
