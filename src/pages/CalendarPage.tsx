import { useState } from 'react';
import { useCalendarStore } from '@/store/calendar-store';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { DayView } from '@/components/calendar/DayView';
import { WeekView } from '@/components/calendar/WeekView';
import { MonthView } from '@/components/calendar/MonthView';
import { BlockerForm } from '@/components/calendar/BlockerForm';

export function CalendarPage() {
  const { view } = useCalendarStore();
  const [showBlockerForm, setShowBlockerForm] = useState(false);

  return (
    <div>
      <CalendarHeader onAddBlocker={() => setShowBlockerForm(true)} />

      {view === 'day' && <DayView />}
      {view === 'week' && <WeekView />}
      {view === 'month' && <MonthView />}

      {showBlockerForm && (
        <BlockerForm onClose={() => setShowBlockerForm(false)} />
      )}
    </div>
  );
}
