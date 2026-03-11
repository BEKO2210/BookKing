import { create } from 'zustand';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfWeek } from 'date-fns';
import type { CalendarView, CalendarEvent } from '@/types';

interface CalendarState {
  view: CalendarView;
  currentDate: Date;
  selectedStaffId: string | null;
  draggedEvent: CalendarEvent | null;

  // Actions
  setView: (view: CalendarView) => void;
  goToToday: () => void;
  goForward: () => void;
  goBack: () => void;
  setDate: (date: Date) => void;
  setSelectedStaff: (staffId: string | null) => void;
  setDraggedEvent: (event: CalendarEvent | null) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  view: 'week',
  currentDate: new Date(),
  selectedStaffId: null,
  draggedEvent: null,

  setView: (view) => set({ view }),

  goToToday: () => set({ currentDate: new Date() }),

  goForward: () => {
    const { view, currentDate } = get();
    switch (view) {
      case 'day':
        set({ currentDate: addDays(currentDate, 1) });
        break;
      case 'week':
        set({ currentDate: addWeeks(currentDate, 1) });
        break;
      case 'month':
        set({ currentDate: addMonths(currentDate, 1) });
        break;
    }
  },

  goBack: () => {
    const { view, currentDate } = get();
    switch (view) {
      case 'day':
        set({ currentDate: subDays(currentDate, 1) });
        break;
      case 'week':
        set({ currentDate: subWeeks(currentDate, 1) });
        break;
      case 'month':
        set({ currentDate: subMonths(currentDate, 1) });
        break;
    }
  },

  setDate: (date) => set({ currentDate: date }),
  setSelectedStaff: (staffId) => set({ selectedStaffId: staffId }),
  setDraggedEvent: (event) => set({ draggedEvent: event }),
}));

/**
 * Get the week date range for the current calendar view.
 */
export function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Get formatted header string for the current view.
 */
export function getViewTitle(view: CalendarView, date: Date): string {
  switch (view) {
    case 'day':
      return format(date, 'EEEE, d. MMMM yyyy');
    case 'week': {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);
      return `${format(weekStart, 'd. MMM')} – ${format(weekEnd, 'd. MMM yyyy')}`;
    }
    case 'month':
      return format(date, 'MMMM yyyy');
  }
}
