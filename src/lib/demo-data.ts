import { format, subDays, addDays } from 'date-fns';
import type {
  Service,
  StaffMember,
  Availability,
  Booking,
  Customer,
  Blocker,
  DayOfWeek,
} from '@/types';

// ═══════════════════════════════════════════
// BookKing Demo Data — Friseur-Salon Beispiel
// ═══════════════════════════════════════════

const today = format(new Date(), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
const dayAfter = format(addDays(new Date(), 2), 'yyyy-MM-dd');

// ── Services ──────────────────────────────

export const DEMO_SERVICES: Service[] = [
  {
    id: 'svc-1',
    providerId: 'demo-provider-001',
    name: 'Haarschnitt Damen',
    description: 'Waschen, Schneiden, Föhnen — für alle Haarlängen.',
    duration: 45,
    bufferBefore: 0,
    bufferAfter: 15,
    price: 42,
    priceType: 'fixed',
    capacity: 1,
    category: 'Haarschnitte',
    addons: [
      { id: 'addon-1', name: 'Kopfmassage', duration: 10, price: 8 },
      { id: 'addon-2', name: 'Pflegekur', duration: 15, price: 12 },
    ],
    isActive: true,
    sortOrder: 0,
    color: '#3b82f6',
  },
  {
    id: 'svc-2',
    providerId: 'demo-provider-001',
    name: 'Haarschnitt Herren',
    description: 'Klassischer Herrenschnitt mit Styling.',
    duration: 30,
    bufferBefore: 0,
    bufferAfter: 10,
    price: 28,
    priceType: 'fixed',
    capacity: 1,
    category: 'Haarschnitte',
    addons: [
      { id: 'addon-3', name: 'Bartpflege', duration: 15, price: 12 },
    ],
    isActive: true,
    sortOrder: 1,
    color: '#6366f1',
  },
  {
    id: 'svc-3',
    providerId: 'demo-provider-001',
    name: 'Färben & Strähnchen',
    description: 'Professionelle Coloration oder Balayage-Highlights.',
    duration: 120,
    bufferBefore: 0,
    bufferAfter: 15,
    price: 89,
    priceType: 'from',
    capacity: 1,
    category: 'Färben',
    addons: [
      { id: 'addon-4', name: 'Olaplex Treatment', duration: 20, price: 25 },
    ],
    isActive: true,
    sortOrder: 2,
    color: '#8b5cf6',
  },
  {
    id: 'svc-4',
    providerId: 'demo-provider-001',
    name: 'Braut-Styling',
    description: 'Probestyling und Hochzeitsfrisur inkl. Beratung.',
    duration: 90,
    bufferBefore: 15,
    bufferAfter: 15,
    price: 120,
    priceType: 'fixed',
    capacity: 1,
    category: 'Styling',
    addons: [],
    isActive: true,
    sortOrder: 3,
    color: '#ec4899',
  },
  {
    id: 'svc-5',
    providerId: 'demo-provider-001',
    name: 'Kinderhaarschnitt',
    description: 'Für Kids bis 12 Jahre. Geduld inklusive!',
    duration: 25,
    bufferBefore: 0,
    bufferAfter: 5,
    price: 18,
    priceType: 'fixed',
    capacity: 1,
    category: 'Haarschnitte',
    addons: [],
    isActive: true,
    sortOrder: 4,
    color: '#f59e0b',
  },
];

// ── Staff ─────────────────────────────────

export const DEMO_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    providerId: 'demo-provider-001',
    name: 'Maria Schmidt',
    email: 'maria@demo-salon.de',
    specialties: ['Färben', 'Balayage', 'Braut-Styling'],
    serviceIds: ['svc-1', 'svc-3', 'svc-4'],
    isActive: true,
  },
  {
    id: 'staff-2',
    providerId: 'demo-provider-001',
    name: 'Thomas Weber',
    email: 'thomas@demo-salon.de',
    specialties: ['Herrenschnitte', 'Bartpflege'],
    serviceIds: ['svc-2', 'svc-5'],
    isActive: true,
  },
  {
    id: 'staff-3',
    providerId: 'demo-provider-001',
    name: 'Lisa Hoffmann',
    email: 'lisa@demo-salon.de',
    specialties: ['Styling', 'Hochsteckfrisuren'],
    serviceIds: ['svc-1', 'svc-4', 'svc-5'],
    isActive: true,
  },
];

// ── Availability (Mo-Sa) ──────────────────

export const DEMO_AVAILABILITY: Availability[] = [
  // Monday - Friday: 9-18, lunch break 12-13
  ...[1, 2, 3, 4, 5].map((day) => ({
    id: `avail-${day}`,
    providerId: 'demo-provider-001',
    dayOfWeek: day as DayOfWeek,
    startTime: '09:00',
    endTime: '18:00',
    breaks: [{ start: '12:00', end: '13:00' }],
    isActive: true,
  })),
  // Saturday: 9-14, no break
  {
    id: 'avail-6',
    providerId: 'demo-provider-001',
    dayOfWeek: 6 as DayOfWeek,
    startTime: '09:00',
    endTime: '14:00',
    breaks: [],
    isActive: true,
  },
];

// ── Customers ─────────────────────────────

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    providerId: 'demo-provider-001',
    firstName: 'Anna',
    lastName: 'Müller',
    email: 'anna.mueller@example.de',
    phone: '+49 170 1234567',
    tags: ['stammkunde', 'vip'],
    notes: 'Bevorzugt Termine morgens. Latte Macchiato mit Hafermilch.',
    noShowCount: 0,
    totalSpent: 486,
    firstBookingAt: '2025-06-15T10:00:00Z',
    lastBookingAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: 'cust-2',
    providerId: 'demo-provider-001',
    firstName: 'Lisa',
    lastName: 'Klein',
    email: 'lisa.klein@example.de',
    phone: '+49 171 9876543',
    tags: ['stammkunde'],
    noShowCount: 0,
    totalSpent: 312,
    firstBookingAt: '2025-09-01T10:00:00Z',
    lastBookingAt: subDays(new Date(), 7).toISOString(),
  },
  {
    id: 'cust-3',
    providerId: 'demo-provider-001',
    firstName: 'Tom',
    lastName: 'Schneider',
    email: 'tom.schneider@example.de',
    phone: '+49 152 5551234',
    tags: ['neukunde'],
    noShowCount: 0,
    totalSpent: 28,
    firstBookingAt: subDays(new Date(), 5).toISOString(),
    lastBookingAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: 'cust-4',
    providerId: 'demo-provider-001',
    firstName: 'Sarah',
    lastName: 'Becker',
    email: 'sarah.becker@example.de',
    tags: ['stammkunde'],
    noShowCount: 1,
    totalSpent: 267,
    firstBookingAt: '2025-07-20T10:00:00Z',
    lastBookingAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: 'cust-5',
    providerId: 'demo-provider-001',
    firstName: 'Jan',
    lastName: 'Richter',
    email: 'jan.richter@example.de',
    phone: '+49 176 4443210',
    tags: ['neukunde'],
    noShowCount: 0,
    totalSpent: 56,
    firstBookingAt: subDays(new Date(), 10).toISOString(),
    lastBookingAt: subDays(new Date(), 1).toISOString(),
  },
];

// ── Bookings (past + today + upcoming) ────

export const DEMO_BOOKINGS: Booking[] = [
  // Today's bookings
  {
    id: 'book-t1',
    providerId: 'demo-provider-001',
    serviceId: 'svc-1',
    staffId: 'staff-1',
    customerId: 'cust-1',
    date: today,
    startTime: '09:00',
    endTime: '09:45',
    status: 'confirmed',
    addons: [],
    totalPrice: 42,
    depositPaid: 0,
    createdAt: subDays(new Date(), 3).toISOString(),
    confirmationToken: 'demo-token-t1',
  },
  {
    id: 'book-t2',
    providerId: 'demo-provider-001',
    serviceId: 'svc-2',
    staffId: 'staff-2',
    customerId: 'cust-3',
    date: today,
    startTime: '10:00',
    endTime: '10:30',
    status: 'confirmed',
    addons: ['addon-3'],
    totalPrice: 40,
    depositPaid: 0,
    createdAt: subDays(new Date(), 2).toISOString(),
    confirmationToken: 'demo-token-t2',
  },
  {
    id: 'book-t3',
    providerId: 'demo-provider-001',
    serviceId: 'svc-3',
    staffId: 'staff-1',
    customerId: 'cust-2',
    date: today,
    startTime: '13:00',
    endTime: '15:00',
    status: 'confirmed',
    addons: ['addon-4'],
    totalPrice: 114,
    depositPaid: 0,
    createdAt: subDays(new Date(), 5).toISOString(),
    confirmationToken: 'demo-token-t3',
  },
  {
    id: 'book-t4',
    providerId: 'demo-provider-001',
    serviceId: 'svc-1',
    staffId: 'staff-3',
    customerId: 'cust-4',
    date: today,
    startTime: '14:00',
    endTime: '14:45',
    status: 'confirmed',
    addons: [],
    totalPrice: 42,
    depositPaid: 0,
    createdAt: subDays(new Date(), 1).toISOString(),
    confirmationToken: 'demo-token-t4',
  },
  {
    id: 'book-t5',
    providerId: 'demo-provider-001',
    serviceId: 'svc-2',
    staffId: 'staff-2',
    customerId: 'cust-5',
    date: today,
    startTime: '15:30',
    endTime: '16:00',
    status: 'confirmed',
    addons: [],
    totalPrice: 28,
    depositPaid: 0,
    createdAt: subDays(new Date(), 1).toISOString(),
    confirmationToken: 'demo-token-t5',
  },
  // Tomorrow
  {
    id: 'book-m1',
    providerId: 'demo-provider-001',
    serviceId: 'svc-4',
    staffId: 'staff-1',
    customerId: 'cust-1',
    date: tomorrow,
    startTime: '10:00',
    endTime: '11:30',
    status: 'confirmed',
    addons: [],
    totalPrice: 120,
    depositPaid: 0,
    createdAt: subDays(new Date(), 7).toISOString(),
    confirmationToken: 'demo-token-m1',
  },
  {
    id: 'book-m2',
    providerId: 'demo-provider-001',
    serviceId: 'svc-5',
    staffId: 'staff-3',
    customerId: 'cust-2',
    date: tomorrow,
    startTime: '09:30',
    endTime: '09:55',
    status: 'confirmed',
    addons: [],
    totalPrice: 18,
    depositPaid: 0,
    createdAt: subDays(new Date(), 2).toISOString(),
    confirmationToken: 'demo-token-m2',
  },
  // Day after
  {
    id: 'book-d1',
    providerId: 'demo-provider-001',
    serviceId: 'svc-1',
    staffId: 'staff-3',
    customerId: 'cust-5',
    date: dayAfter,
    startTime: '11:00',
    endTime: '11:45',
    status: 'confirmed',
    addons: ['addon-1'],
    totalPrice: 50,
    depositPaid: 0,
    createdAt: subDays(new Date(), 1).toISOString(),
    confirmationToken: 'demo-token-d1',
  },
  // Past bookings (for analytics)
  ...generatePastBookings(),
];

// ── Blocker ───────────────────────────────

export const DEMO_BLOCKERS: Blocker[] = [
  {
    id: 'blocker-1',
    providerId: 'demo-provider-001',
    staffId: 'staff-2',
    startDate: `${format(addDays(new Date(), 5), 'yyyy-MM-dd')}T00:00:00`,
    endDate: `${format(addDays(new Date(), 5), 'yyyy-MM-dd')}T23:59:59`,
    reason: 'Fortbildung',
    isAllDay: true,
  },
];

// ── Helper: Generate 30 days of past bookings ──

function generatePastBookings(): Booking[] {
  const bookings: Booking[] = [];
  const serviceIds = ['svc-1', 'svc-2', 'svc-3', 'svc-5'];
  const staffIds = ['staff-1', 'staff-2', 'staff-3'];
  const customerIds = ['cust-1', 'cust-2', 'cust-3', 'cust-4', 'cust-5'];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const prices: Record<string, number> = { 'svc-1': 42, 'svc-2': 28, 'svc-3': 89, 'svc-5': 18 };

  for (let d = 1; d <= 30; d++) {
    const date = format(subDays(new Date(), d), 'yyyy-MM-dd');
    const dayOfWeek = subDays(new Date(), d).getDay();
    if (dayOfWeek === 0) continue; // skip Sundays

    // 3-6 bookings per day
    const count = 3 + Math.floor(Math.abs(Math.sin(d * 7)) * 4);
    for (let b = 0; b < count && b < times.length; b++) {
      const svcId = serviceIds[b % serviceIds.length]!;
      const status = d === 8 && b === 0 ? 'no-show' as const
        : d === 12 && b === 1 ? 'cancelled' as const
        : 'completed' as const;

      bookings.push({
        id: `book-past-${d}-${b}`,
        providerId: 'demo-provider-001',
        serviceId: svcId,
        staffId: staffIds[b % staffIds.length],
        customerId: customerIds[b % customerIds.length]!,
        date,
        startTime: times[b]!,
        endTime: times[b]!.replace(':00', ':45'),
        status,
        addons: [],
        totalPrice: prices[svcId] ?? 30,
        depositPaid: 0,
        createdAt: subDays(new Date(), d + 2).toISOString(),
        confirmationToken: `demo-past-${d}-${b}`,
      });
    }
  }

  return bookings;
}

// ═══════════════════════════════════════════
// Check if we're in demo mode (no Supabase)
// ═══════════════════════════════════════════

export function isDemoMode(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  return !url || url.includes('placeholder');
}
