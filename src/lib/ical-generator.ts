import type { Booking, Service, Provider } from '@/types';

/**
 * Generate an iCalendar (.ics) file for a booking.
 */
export function generateICalEvent(
  booking: Booking,
  service: Service,
  provider: Provider,
): string {
  const dtStart = formatICalDate(booking.date, booking.startTime);
  const dtEnd = formatICalDate(booking.date, booking.endTime);
  const now = formatICalDateNow();
  const uid = `${booking.id}@bookking.app`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BookKing//Booking//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICalText(service.name)} bei ${escapeICalText(provider.businessName)}`,
    `DESCRIPTION:${escapeICalText(buildDescription(booking, service, provider))}`,
    `LOCATION:${escapeICalText(provider.businessName)}`,
    'STATUS:CONFIRMED',
    buildAlarm(60),
    buildAlarm(120),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/**
 * Generate an iCal export of all bookings for calendar sync.
 */
export function generateICalFeed(
  bookings: Booking[],
  services: Map<string, Service>,
  provider: Provider,
): string {
  const events = bookings
    .filter((b) => b.status === 'confirmed')
    .map((booking) => {
      const service = services.get(booking.serviceId);
      if (!service) return '';

      const dtStart = formatICalDate(booking.date, booking.startTime);
      const dtEnd = formatICalDate(booking.date, booking.endTime);
      const uid = `${booking.id}@bookking.app`;

      return [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatICalDateNow()}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${escapeICalText(service.name)} — ${escapeICalText(booking.customerId)}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n');
    })
    .filter(Boolean);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//BookKing//${escapeICalText(provider.businessName)}//DE`,
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escapeICalText(provider.businessName)} Termine`,
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Trigger an .ics file download in the browser.
 */
export function downloadICalFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════
// Internal helpers
// ═══════════════════════════════════════════

function formatICalDate(date: string, time: string): string {
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  return `${year}${month}${day}T${hours}${minutes}00`;
}

function formatICalDateNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function buildDescription(
  booking: Booking,
  service: Service,
  provider: Provider,
): string {
  const lines = [
    `Service: ${service.name}`,
    `Dauer: ${service.duration} Minuten`,
    `Preis: ${booking.totalPrice.toFixed(2)} ${provider.currency}`,
  ];

  if (booking.notes) {
    lines.push(`Notizen: ${booking.notes}`);
  }

  lines.push(
    '',
    `Stornierung/Umbuchung: ${window.location.origin}/manage/${booking.confirmationToken}`,
  );

  return lines.join('\\n');
}

function buildAlarm(minutesBefore: number): string {
  return [
    'BEGIN:VALARM',
    'TRIGGER:-PT' + minutesBefore + 'M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Terminerinnerung',
    'END:VALARM',
  ].join('\r\n');
}
