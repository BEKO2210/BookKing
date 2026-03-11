import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, supabase, upsertToSupabase, deleteFromSupabase } from '@/lib/db';
import type { Service } from '@/types';
import { generateId } from '@/lib/utils';
import { useSettingsStore } from '@/store/settings-store';
import { isDemoMode, DEMO_SERVICES } from '@/lib/demo-data';

export function useServices() {
  const provider = useSettingsStore((s) => s.provider);
  const providerId = provider?.id ?? '';
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['services', providerId],
    queryFn: async (): Promise<Service[]> => {
      if (isDemoMode()) return DEMO_SERVICES;

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .order('sort_order');

      if (error || !data) {
        return db.services.where('providerId').equals(providerId).sortBy('sortOrder');
      }

      const services = data as unknown as Service[];
      await db.services.where('providerId').equals(providerId).delete();
      await db.services.bulkPut(services);
      return services;
    },
    enabled: !!providerId,
    staleTime: 30_000,
  });

  const createService = useMutation({
    mutationFn: async (service: Omit<Service, 'id'>) => {
      const newService: Service = { ...service, id: generateId() };
      await db.services.put(newService);
      await upsertToSupabase('services', newService);
      return newService;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const updateService = useMutation({
    mutationFn: async (service: Service) => {
      await db.services.put(service);
      await upsertToSupabase('services', service);
      return service;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      await db.services.delete(id);
      await deleteFromSupabase('services', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  return {
    services: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createService,
    updateService,
    deleteService,
  };
}

/**
 * Get active services grouped by category.
 */
export function useActiveServicesByCategory() {
  const { services } = useServices();

  const active = services.filter((s) => s.isActive);
  const grouped = new Map<string, Service[]>();

  for (const service of active) {
    const cat = service.category ?? 'Allgemein';
    const existing = grouped.get(cat) ?? [];
    existing.push(service);
    grouped.set(cat, existing);
  }

  return { grouped, all: active };
}
