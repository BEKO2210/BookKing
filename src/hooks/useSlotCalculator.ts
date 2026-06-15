import { getAvailableDatesInRange, getAvailableSlots } from "@/lib/slot-engine";
import { useSettingsStore } from "@/store/settings-store";
import type { AvailableSlot, Service } from "@/types";
import { parseISO } from "date-fns";
import { useMemo } from "react";
import { useAvailability, useBlockers } from "./useAvailability";
import { useBookings } from "./useBookings";

/**
 * Calculate available time slots for a given date and service.
 */
export function useSlotCalculator(
	date: string | null,
	service: Service | null,
	staffId?: string,
): { slots: AvailableSlot[]; isLoading: boolean } {
	const provider = useSettingsStore((s) => s.provider);
	const { availability, isLoading: loadingAvail } = useAvailability();
	const { blockers, isLoading: loadingBlockers } = useBlockers();

	const dateRange = date ? { from: date, to: date } : undefined;
	const { bookings, isLoading: loadingBookings } = useBookings(dateRange);

	const isLoading = loadingAvail || loadingBlockers || loadingBookings;

	const slots = useMemo(() => {
		if (!date || !service || !provider) return [];

		return getAvailableSlots({
			date: parseISO(date),
			service,
			availability,
			bookings,
			blockers,
			staffId,
			minLeadTime: provider.settings.minLeadTime,
			slotInterval: provider.settings.slotInterval,
			timezone: provider.timezone,
		});
	}, [date, service, provider, availability, bookings, blockers, staffId]);

	return { slots, isLoading };
}

/**
 * Get dates with available slots in a date range (for calendar highlighting).
 */
export function useAvailableDates(
	startDate: string,
	endDate: string,
	service: Service | null,
	staffId?: string,
): { dates: string[]; isLoading: boolean } {
	const provider = useSettingsStore((s) => s.provider);
	const { availability, isLoading: loadingAvail } = useAvailability();
	const { blockers, isLoading: loadingBlockers } = useBlockers();
	const { bookings, isLoading: loadingBookings } = useBookings({
		from: startDate,
		to: endDate,
	});

	const isLoading = loadingAvail || loadingBlockers || loadingBookings;

	const dates = useMemo(() => {
		if (!service || !provider) return [];

		return getAvailableDatesInRange(parseISO(startDate), parseISO(endDate), {
			service,
			availability,
			bookings,
			blockers,
			staffId,
			minLeadTime: provider.settings.minLeadTime,
			slotInterval: provider.settings.slotInterval,
			timezone: provider.timezone,
		});
	}, [
		startDate,
		endDate,
		service,
		provider,
		availability,
		bookings,
		blockers,
		staffId,
	]);

	return { dates, isLoading };
}
