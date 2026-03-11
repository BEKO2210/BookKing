// ═══════════════════════════════════════════
// BookKing — Feiertage nach Land/Bundesland
// ═══════════════════════════════════════════

export interface Holiday {
  date: string; // yyyy-MM-dd
  name: string;
  type: 'public' | 'school' | 'optional';
}

type Region = 'DE' | 'AT' | 'CH';
type GermanState =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH'
  | 'HE' | 'MV' | 'NI' | 'NW' | 'RP' | 'SL'
  | 'SN' | 'ST' | 'SH' | 'TH';

/**
 * Get public holidays for a given year and region.
 */
export function getHolidays(year: number, region: Region = 'DE', state?: GermanState): Holiday[] {
  const holidays: Holiday[] = [];

  // Fixed holidays common to DACH
  holidays.push(
    { date: `${year}-01-01`, name: 'Neujahr', type: 'public' },
    { date: `${year}-05-01`, name: 'Tag der Arbeit', type: 'public' },
    { date: `${year}-12-25`, name: '1. Weihnachtstag', type: 'public' },
    { date: `${year}-12-26`, name: '2. Weihnachtstag', type: 'public' },
  );

  // Easter-based moveable holidays
  const easter = calculateEaster(year);
  const easterDate = new Date(year, easter.month, easter.day);

  holidays.push(
    { date: offsetDate(easterDate, -2), name: 'Karfreitag', type: 'public' },
    { date: offsetDate(easterDate, 0), name: 'Ostersonntag', type: 'public' },
    { date: offsetDate(easterDate, 1), name: 'Ostermontag', type: 'public' },
    { date: offsetDate(easterDate, 39), name: 'Christi Himmelfahrt', type: 'public' },
    { date: offsetDate(easterDate, 49), name: 'Pfingstsonntag', type: 'public' },
    { date: offsetDate(easterDate, 50), name: 'Pfingstmontag', type: 'public' },
  );

  if (region === 'DE') {
    holidays.push(
      { date: `${year}-10-03`, name: 'Tag der Deutschen Einheit', type: 'public' },
    );

    // State-specific German holidays
    const corpusChristi = { date: offsetDate(easterDate, 60), name: 'Fronleichnam', type: 'public' as const };
    const assumption = { date: `${year}-08-15`, name: 'Mariä Himmelfahrt', type: 'public' as const };
    const reformationDay = { date: `${year}-10-31`, name: 'Reformationstag', type: 'public' as const };
    const allSaints = { date: `${year}-11-01`, name: 'Allerheiligen', type: 'public' as const };
    const epiphany = { date: `${year}-01-06`, name: 'Heilige Drei Könige', type: 'public' as const };

    if (state) {
      const corpusChristiStates: GermanState[] = ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'];
      const allSaintsStates: GermanState[] = ['BW', 'BY', 'NW', 'RP', 'SL'];
      const epiphanyStates: GermanState[] = ['BW', 'BY', 'ST'];
      const reformationStates: GermanState[] = ['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'];

      if (corpusChristiStates.includes(state)) holidays.push(corpusChristi);
      if (allSaintsStates.includes(state)) holidays.push(allSaints);
      if (epiphanyStates.includes(state)) holidays.push(epiphany);
      if (reformationStates.includes(state)) holidays.push(reformationDay);
      if (state === 'BY') holidays.push(assumption);
    }
  }

  if (region === 'AT') {
    holidays.push(
      { date: `${year}-01-06`, name: 'Heilige Drei Könige', type: 'public' },
      { date: `${year}-08-15`, name: 'Mariä Himmelfahrt', type: 'public' },
      { date: `${year}-10-26`, name: 'Nationalfeiertag', type: 'public' },
      { date: `${year}-11-01`, name: 'Allerheiligen', type: 'public' },
      { date: `${year}-12-08`, name: 'Mariä Empfängnis', type: 'public' },
      { date: offsetDate(easterDate, 60), name: 'Fronleichnam', type: 'public' },
    );
  }

  if (region === 'CH') {
    holidays.push(
      { date: `${year}-08-01`, name: 'Bundesfeiertag', type: 'public' },
    );
  }

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Check if a specific date is a holiday.
 */
export function isHoliday(dateStr: string, region: Region = 'DE', state?: GermanState): Holiday | undefined {
  const year = parseInt(dateStr.split('-')[0] ?? '2026', 10);
  const holidays = getHolidays(year, region, state);
  return holidays.find((h) => h.date === dateStr);
}

// ═══════════════════════════════════════════
// Easter calculation (Anonymous Gregorian algorithm)
// ═══════════════════════════════════════════

function calculateEaster(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return { month, day };
}

function offsetDate(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
