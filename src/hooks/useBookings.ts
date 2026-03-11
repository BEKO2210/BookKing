import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { db, supabase, upsertToSupabase } from '@/lib/db';
import type { Booking, BookingFormData, Customer } from '@/types';
import { generateId, generateToken } from '@/lib/utils';
import { calculateEndTime } from '@/lib/slot-engine';
import { useSettingsStore } from '@/store/settings-store';
import { isDemoMode, DEMO_BOOKINGS } from '@/lib/demo-data';

export function useBookings(dateRange?: { from: string; to: string }) {
  const provider = useSettingsStore((s) => s.provider);
  const providerId = provider?.id ?? '';
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['bookings', providerId, dateRange?.from, dateRange?.to],
    queryFn: async (): Promise<Booking[]> => {
      if (isDemoMode()) {
        let result = DEMO_BOOKINGS;
        if (dateRange) {
          result = result.filter((b) => b.date >= dateRange.from && b.date <= dateRange.to);
        }
        return result;
      }

      let q = supabase
        .from('bookings')
        .select('*')
        .eq('provider_id', providerId);

      if (dateRange) {
        q = q.gte('date', dateRange.from).lte('date', dateRange.to);
      }

      const { data, error } = await q.order('date').order('start_time');

      if (error || !data) {
        return db.bookings.where('providerId').equals(providerId).toArray();
      }

      const bookings = data as unknown as Booking[];
      return bookings;
    },
    enabled: !!providerId,
    staleTime: 10_000,
  });

  // Realtime subscription for new bookings
  useEffect(() => {
    if (!providerId) return;

    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `provider_id=eq.${providerId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerId, queryClient]);

  return {
    bookings: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreateBooking() {
  const provider = useSettingsStore((s) => s.provider);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      serviceDuration,
    }: {
      formData: BookingFormData;
      serviceDuration: number;
    }) => {
      const providerId = provider?.id ?? '';

      // Find or create customer
      const customer = await findOrCreateCustomer(providerId, formData);

      const booking: Booking = {
        id: generateId(),
        providerId,
        serviceId: formData.serviceId,
        staffId: formData.staffId,
        customerId: customer.id,
        date: formData.date,
        startTime: formData.time,
        endTime: calculateEndTime(formData.time, serviceDuration),
        status: 'confirmed',
        addons: formData.addons,
        totalPrice: 0, // calculated by caller
        depositPaid: 0,
        notes: formData.notes,
        confirmationToken: generateToken(),
        createdAt: new Date().toISOString(),
      };

      await db.bookings.put(booking);
      await upsertToSupabase('bookings', booking);

      return { booking, customer };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
      cancelReason,
    }: {
      bookingId: string;
      status: Booking['status'];
      cancelReason?: string;
    }) => {
      const updates: Partial<Booking> = { status };
      if (status === 'cancelled') {
        updates.cancelledAt = new Date().toISOString();
        updates.cancelReason = cancelReason;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId);

      if (error) throw error;

      await db.bookings.update(bookingId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

async function findOrCreateCustomer(
  providerId: string,
  formData: BookingFormData,
): Promise<Customer> {
  // Try to find existing customer by email
  const { data: existing } = await supabase
    .from('customers')
    .select('*')
    .eq('provider_id', providerId)
    .eq('email', formData.email)
    .single();

  if (existing) {
    const customer = existing as unknown as Customer;
    // Update last booking date
    await supabase
      .from('customers')
      .update({ last_booking_at: new Date().toISOString() })
      .eq('id', customer.id);
    return customer;
  }

  // Create new customer
  const customer: Customer = {
    id: generateId(),
    providerId,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    tags: ['neukunde'],
    noShowCount: 0,
    totalSpent: 0,
    firstBookingAt: new Date().toISOString(),
    lastBookingAt: new Date().toISOString(),
  };

  await upsertToSupabase('customers', customer);
  await db.customers.put(customer);

  return customer;
}
