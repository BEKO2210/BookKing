import { createClient } from '@supabase/supabase-js';
import Dexie, { type Table } from 'dexie';
import type {
  Availability,
  Blocker,
  Booking,
  Customer,
  NotificationTemplate,
  Provider,
  Service,
  StaffMember,
  WaitlistEntry,
} from '@/types';

// ═══════════════════════════════════════════
// Supabase Client
// ═══════════════════════════════════════════

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ═══════════════════════════════════════════
// Dexie Offline Cache (für Dienstleister-Dashboard)
// ═══════════════════════════════════════════

export class BookKingDB extends Dexie {
  providers!: Table<Provider>;
  services!: Table<Service>;
  availability!: Table<Availability>;
  blockers!: Table<Blocker>;
  bookings!: Table<Booking>;
  customers!: Table<Customer>;
  staff!: Table<StaffMember>;
  notifications!: Table<NotificationTemplate>;
  waitlist!: Table<WaitlistEntry>;

  constructor() {
    super('BookKingDB');

    this.version(1).stores({
      providers: 'id, email, bookingSlug',
      services: 'id, providerId, category, isActive, sortOrder',
      availability: 'id, providerId, staffId, dayOfWeek',
      blockers: 'id, providerId, staffId, startDate',
      bookings: 'id, providerId, serviceId, customerId, date, status, createdAt',
      customers: 'id, providerId, email, lastBookingAt',
      staff: 'id, providerId, isActive',
      notifications: 'id, providerId, type',
      waitlist: 'id, providerId, customerId, serviceId',
    });
  }
}

export const db = new BookKingDB();

// ═══════════════════════════════════════════
// Sync helpers: Supabase ↔ Dexie
// ═══════════════════════════════════════════

export async function syncTableToLocal<T extends { id: string }>(
  tableName: string,
  providerId: string,
): Promise<T[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('provider_id', providerId);

  if (error) {
    console.error(`Sync error for ${tableName}:`, error);
    return [];
  }

  const items = (data ?? []).map(snakeToCamel) as T[];
  const table = db.table(tableName);
  await table.where('providerId').equals(providerId).delete();
  await table.bulkPut(items);
  return items;
}

export async function upsertToSupabase<T extends object>(
  tableName: string,
  item: T,
): Promise<T | null> {
  const payload = camelToSnake(item as unknown as Record<string, unknown>);
  const { data, error } = await supabase
    .from(tableName)
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error(`Upsert error for ${tableName}:`, error);
    return null;
  }

  return snakeToCamel(data) as T;
}

export async function deleteFromSupabase(
  tableName: string,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) {
    console.error(`Delete error for ${tableName}:`, error);
    return false;
  }
  return true;
}

// ═══════════════════════════════════════════
// Case conversion utilities
// ═══════════════════════════════════════════

function convertValue(value: unknown, converter: (obj: Record<string, unknown>) => Record<string, unknown>): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => convertValue(item, converter));
  return converter(value as Record<string, unknown>);
}

function snakeToCamel(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter: string) =>
      letter.toUpperCase(),
    );
    result[camelKey] = convertValue(value, snakeToCamel);
  }
  return result;
}

function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`,
    );
    result[snakeKey] = convertValue(value, camelToSnake);
  }
  return result;
}
