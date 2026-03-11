import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, supabase, upsertToSupabase, deleteFromSupabase } from '@/lib/db';
import type { Availability, Blocker } from '@/types';
import { generateId } from '@/lib/utils';
import { useSettingsStore } from '@/store/settings-store';
import { isDemoMode, DEMO_AVAILABILITY, DEMO_BLOCKERS } from '@/lib/demo-data';

export function useAvailability() {
  const provider = useSettingsStore((s) => s.provider);
  const providerId = provider?.id ?? '';
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['availability', providerId],
    queryFn: async (): Promise<Availability[]> => {
      if (isDemoMode()) return DEMO_AVAILABILITY;

      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('provider_id', providerId)
        .order('day_of_week');

      if (error || !data) {
        return db.availability.where('providerId').equals(providerId).toArray();
      }

      return data as unknown as Availability[];
    },
    enabled: !!providerId,
    staleTime: 60_000,
  });

  const upsertAvailability = useMutation({
    mutationFn: async (avail: Omit<Availability, 'id'> & { id?: string }) => {
      const item: Availability = { ...avail, id: avail.id ?? generateId() };
      await db.availability.put(item);
      await upsertToSupabase('availability', item);
      return item;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability'] }),
  });

  const deleteAvailability = useMutation({
    mutationFn: async (id: string) => {
      await db.availability.delete(id);
      await deleteFromSupabase('availability', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability'] }),
  });

  return {
    availability: query.data ?? [],
    isLoading: query.isLoading,
    upsertAvailability,
    deleteAvailability,
  };
}

export function useBlockers() {
  const provider = useSettingsStore((s) => s.provider);
  const providerId = provider?.id ?? '';
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['blockers', providerId],
    queryFn: async (): Promise<Blocker[]> => {
      if (isDemoMode()) return DEMO_BLOCKERS;

      const { data, error } = await supabase
        .from('blockers')
        .select('*')
        .eq('provider_id', providerId)
        .order('start_date');

      if (error || !data) {
        return db.blockers.where('providerId').equals(providerId).toArray();
      }

      return data as unknown as Blocker[];
    },
    enabled: !!providerId,
    staleTime: 60_000,
  });

  const createBlocker = useMutation({
    mutationFn: async (blocker: Omit<Blocker, 'id'>) => {
      const item: Blocker = { ...blocker, id: generateId() };
      await db.blockers.put(item);
      await upsertToSupabase('blockers', item);
      return item;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blockers'] }),
  });

  const deleteBlocker = useMutation({
    mutationFn: async (id: string) => {
      await db.blockers.delete(id);
      await deleteFromSupabase('blockers', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blockers'] }),
  });

  return {
    blockers: query.data ?? [],
    isLoading: query.isLoading,
    createBlocker,
    deleteBlocker,
  };
}
