import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, supabase, upsertToSupabase, deleteFromSupabase } from '@/lib/db';
import type { Customer } from '@/types';
import { useSettingsStore } from '@/store/settings-store';
import { isDemoMode, DEMO_CUSTOMERS } from '@/lib/demo-data';

export function useCustomers() {
  const provider = useSettingsStore((s) => s.provider);
  const providerId = provider?.id ?? '';
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['customers', providerId],
    queryFn: async (): Promise<Customer[]> => {
      if (isDemoMode()) return DEMO_CUSTOMERS;

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('provider_id', providerId)
        .order('last_booking_at', { ascending: false });

      if (error || !data) {
        return db.customers.where('providerId').equals(providerId).toArray();
      }

      return data as unknown as Customer[];
    },
    enabled: !!providerId,
    staleTime: 30_000,
  });

  const updateCustomer = useMutation({
    mutationFn: async (customer: Customer) => {
      await db.customers.put(customer);
      if (!isDemoMode()) await upsertToSupabase('customers', customer);
      return customer;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      await db.customers.delete(id);
      if (!isDemoMode()) await deleteFromSupabase('customers', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });

  return {
    customers: query.data ?? [],
    isLoading: query.isLoading,
    updateCustomer,
    deleteCustomer,
  };
}

export function useCustomer(customerId: string | undefined) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: async (): Promise<Customer | null> => {
      if (!customerId) return null;

      if (isDemoMode()) {
        return DEMO_CUSTOMERS.find((c) => c.id === customerId) ?? null;
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error || !data) {
        return (await db.customers.get(customerId)) ?? null;
      }

      return data as unknown as Customer;
    },
    enabled: !!customerId,
  });
}
