// ═══════════════════════════════════════════
// BookKing — Core Type Definitions
// ═══════════════════════════════════════════

export interface Provider {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessType: BusinessType;
  logo?: string;
  bookingSlug: string;
  timezone: string;
  currency: Currency;
  settings: ProviderSettings;
  createdAt: string;
}

export type BusinessType =
  | 'friseur'
  | 'coach'
  | 'arztpraxis'
  | 'fitness'
  | 'agentur'
  | 'generisch';

export type Currency = 'EUR' | 'USD' | 'CHF';

export interface ProviderSettings {
  minLeadTime: number;
  maxLeadTime: number;
  cancellationWindow: number;
  noShowFee?: number;
  depositPercent?: number;
  reminderTimes: number[];
  slotInterval: number;
  locale: string;
  colorScheme: 'service' | 'status';
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  description?: string;
  duration: number;
  bufferBefore: number;
  bufferAfter: number;
  price: number;
  priceType: PriceType;
  capacity: number;
  category?: string;
  addons: ServiceAddon[];
  isActive: boolean;
  sortOrder: number;
  color: string;
  seasonStart?: string;
  seasonEnd?: string;
}

export type PriceType = 'fixed' | 'from' | 'free' | 'on-request';

export interface ServiceAddon {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface Availability {
  id: string;
  providerId: string;
  staffId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  breaks: TimeRange[];
  isActive: boolean;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface TimeRange {
  start: string;
  end: string;
}

export interface Blocker {
  id: string;
  providerId: string;
  staffId?: string;
  startDate: string;
  endDate: string;
  reason?: string;
  isAllDay: boolean;
}

export interface Booking {
  id: string;
  providerId: string;
  serviceId: string;
  staffId?: string;
  customerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  addons: string[];
  totalPrice: number;
  depositPaid: number;
  notes?: string;
  cancelledAt?: string;
  cancelReason?: string;
  confirmationToken: string;
  createdAt: string;
}

export type BookingStatus =
  | 'confirmed'
  | 'cancelled'
  | 'no-show'
  | 'completed'
  | 'rescheduled';

export interface Customer {
  id: string;
  providerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tags: CustomerTag[];
  notes?: string;
  noShowCount: number;
  totalSpent: number;
  firstBookingAt: string;
  lastBookingAt: string;
}

export type CustomerTag = 'vip' | 'stammkunde' | 'neukunde' | 'problematisch';

export interface StaffMember {
  id: string;
  providerId: string;
  name: string;
  email: string;
  avatar?: string;
  specialties: string[];
  serviceIds: string[];
  isActive: boolean;
}

export interface AvailableSlot {
  time: string;
  staffId?: string;
  spotsLeft?: number;
}

export interface BookingFormData {
  serviceId: string;
  staffId?: string;
  date: string;
  time: string;
  addons: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthRevenue: number;
  occupancyRate: number;
  noShowRate: number;
  newCustomers: number;
  returningCustomers: number;
  popularServices: { serviceId: string; name: string; count: number }[];
  popularTimes: { hour: number; day: DayOfWeek; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
}

export interface NotificationTemplate {
  id: string;
  providerId: string;
  type: NotificationType;
  subject: string;
  bodyHtml: string;
  isActive: boolean;
}

export type NotificationType =
  | 'booking-confirmation'
  | 'booking-reminder'
  | 'booking-cancellation'
  | 'booking-rescheduled'
  | 'waitlist-available';

export interface WaitlistEntry {
  id: string;
  providerId: string;
  customerId: string;
  serviceId: string;
  preferredDate: string;
  preferredTimeRange?: TimeRange;
  staffId?: string;
  createdAt: string;
  notifiedAt?: string;
}

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  type: 'booking' | 'blocker' | 'break';
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
  staffId?: string;
  booking?: Booking;
  blocker?: Blocker;
}

export type BookingStep =
  | 'service'
  | 'staff'
  | 'datetime'
  | 'details'
  | 'summary'
  | 'payment'
  | 'confirmation';
