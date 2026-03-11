import {
  addMinutes,
  format,
  isBefore,
  isAfter,
  parse,
  getDay,
  startOfDay,
  isEqual,
  differenceInMinutes,
} from 'date-fns';
import type {
  Availability,
  AvailableSlot,
  Blocker,
  Booking,
  Service,
  TimeRange,
} from '@/types';

// ═══════════════════════════════════════════
// BookKing — Zeitslot-Engine (Kern-Algorithmus)
// ═══════════════════════════════════════════

interface SlotEngineInput {
  date: Date;
  service: Service;
  availability: Availability[];
  bookings: Booking[];
  blockers: Blocker[];
  staffId?: string;
  minLeadTime: number;
  slotInterval: number;
  timezone: string;
}

/**
 * Core slot calculation algorithm:
 * Available = (Working hours) - (Breaks) - (Blockers) - (Existing bookings + buffers)
 * Filtered by: lead time, capacity
 */
export function getAvailableSlots(input: SlotEngineInput): AvailableSlot[] {
  const {
    date,
    service,
    availability,
    bookings,
    blockers,
    staffId,
    minLeadTime,
    slotInterval,
  } = input;

  const dayOfWeek = getDay(date) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const now = new Date();
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayStart = startOfDay(date);

  // 1. Find applicable availability rules for this day of week
  const dayAvailability = availability.filter(
    (a) =>
      a.dayOfWeek === dayOfWeek &&
      a.isActive &&
      (!staffId || !a.staffId || a.staffId === staffId),
  );

  if (dayAvailability.length === 0) return [];

  // 2. Get all day blockers that affect this date
  const dayBlockers = blockers.filter((b) => {
    const bStart = new Date(b.startDate);
    const bEnd = new Date(b.endDate);
    return (
      (!staffId || !b.staffId || b.staffId === staffId) &&
      (isBefore(bStart, addMinutes(dayStart, 24 * 60)) &&
        isAfter(bEnd, dayStart))
    );
  });

  // 3. Get existing bookings for this date
  const dayBookings = bookings.filter(
    (b) =>
      b.date === dateStr &&
      b.status !== 'cancelled' &&
      b.status !== 'rescheduled' &&
      (!staffId || !b.staffId || b.staffId === staffId),
  );

  // Total slot duration including buffers
  const totalDuration =
    service.bufferBefore + service.duration + service.bufferAfter;

  const slots: AvailableSlot[] = [];

  for (const avail of dayAvailability) {
    const windowStart = parseTime(dateStr, avail.startTime);
    const windowEnd = parseTime(dateStr, avail.endTime);

    // Generate candidate slot start times
    let cursor = windowStart;

    while (isBefore(cursor, windowEnd) || isEqual(cursor, windowEnd)) {
      const slotServiceStart = addMinutes(cursor, service.bufferBefore);
      const slotServiceEnd = addMinutes(slotServiceStart, service.duration);
      const slotTotalEnd = addMinutes(slotServiceEnd, service.bufferAfter);

      // Check slot fits within working hours
      if (isAfter(slotTotalEnd, windowEnd)) break;

      const slotTimeStr = format(slotServiceStart, 'HH:mm');

      // Check minimum lead time
      const minLeadDate = addMinutes(now, minLeadTime * 60);
      if (isBefore(slotServiceStart, minLeadDate)) {
        cursor = addMinutes(cursor, slotInterval);
        continue;
      }

      // Check if slot falls in a break
      if (isInBreak(slotServiceStart, slotTotalEnd, avail.breaks, dateStr)) {
        cursor = addMinutes(cursor, slotInterval);
        continue;
      }

      // Check if slot overlaps with a blocker
      if (isBlockedByBlocker(cursor, slotTotalEnd, dayBlockers, dateStr)) {
        cursor = addMinutes(cursor, slotInterval);
        continue;
      }

      // Check overlap with existing bookings (including their buffers)
      const overlappingBookings = countOverlappingBookings(
        cursor,
        slotTotalEnd,
        dayBookings,
        service,
        dateStr,
      );

      if (overlappingBookings < service.capacity) {
        const slot: AvailableSlot = {
          time: slotTimeStr,
          staffId: staffId ?? avail.staffId,
        };

        if (service.capacity > 1) {
          slot.spotsLeft = service.capacity - overlappingBookings;
        }

        slots.push(slot);
      }

      cursor = addMinutes(cursor, slotInterval);
    }
  }

  // Deduplicate slots by time (in case multiple availability rules overlap)
  const seen = new Set<string>();
  return slots.filter((s) => {
    const key = `${s.time}-${s.staffId ?? 'any'}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get available slots across all staff members.
 * Returns the earliest available staff for each time slot.
 */
export function getAvailableSlotsAllStaff(
  input: Omit<SlotEngineInput, 'staffId'>,
  staffIds: string[],
): AvailableSlot[] {
  const allSlots = new Map<string, AvailableSlot>();

  for (const sid of staffIds) {
    const staffSlots = getAvailableSlots({ ...input, staffId: sid });
    for (const slot of staffSlots) {
      if (!allSlots.has(slot.time)) {
        allSlots.set(slot.time, slot);
      }
    }
  }

  return Array.from(allSlots.values()).sort((a, b) =>
    a.time.localeCompare(b.time),
  );
}

/**
 * Check if a date has any available slots (for calendar day highlighting).
 */
export function hasAvailableSlots(input: SlotEngineInput): boolean {
  const slots = getAvailableSlots(input);
  return slots.length > 0;
}

/**
 * Get dates with availability for a given month.
 */
export function getAvailableDatesInRange(
  startDate: Date,
  endDate: Date,
  input: Omit<SlotEngineInput, 'date'>,
): string[] {
  const dates: string[] = [];
  let current = startOfDay(startDate);
  const end = startOfDay(endDate);

  while (isBefore(current, end) || isEqual(current, end)) {
    const slots = getAvailableSlots({ ...input, date: current });
    if (slots.length > 0) {
      dates.push(format(current, 'yyyy-MM-dd'));
    }
    current = addMinutes(current, 24 * 60);
  }

  return dates;
}

// ═══════════════════════════════════════════
// Internal helpers
// ═══════════════════════════════════════════

function parseTime(dateStr: string, timeStr: string): Date {
  return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
}

function isInBreak(
  slotStart: Date,
  slotEnd: Date,
  breaks: TimeRange[],
  dateStr: string,
): boolean {
  return breaks.some((b) => {
    const breakStart = parseTime(dateStr, b.start);
    const breakEnd = parseTime(dateStr, b.end);
    return isBefore(slotStart, breakEnd) && isAfter(slotEnd, breakStart);
  });
}

function isBlockedByBlocker(
  slotStart: Date,
  slotEnd: Date,
  blockers: Blocker[],
  _dateStr: string,
): boolean {
  return blockers.some((b) => {
    const bStart = new Date(b.startDate);
    const bEnd = new Date(b.endDate);
    return isBefore(slotStart, bEnd) && isAfter(slotEnd, bStart);
  });
}

function countOverlappingBookings(
  slotStart: Date,
  slotEnd: Date,
  bookings: Booking[],
  _service: Service,
  dateStr: string,
): number {
  return bookings.filter((booking) => {
    const bookingStart = parseTime(dateStr, booking.startTime);
    const bookingEnd = parseTime(dateStr, booking.endTime);

    return isBefore(slotStart, bookingEnd) && isAfter(slotEnd, bookingStart);
  }).length;
}

/**
 * Calculate end time from start time and duration.
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = (hours ?? 0) * 60 + (minutes ?? 0) + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

/**
 * Parse a time string "HH:mm" into total minutes from midnight.
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/**
 * Convert minutes from midnight to "HH:mm" string.
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
