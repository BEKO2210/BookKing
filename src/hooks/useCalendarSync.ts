import { downloadICalFile, generateICalFeed } from "@/lib/ical-generator";
import { useSettingsStore } from "@/store/settings-store";
import type { Service } from "@/types";
import { useCallback } from "react";
import { useBookings } from "./useBookings";
import { useServices } from "./useServices";

export function useCalendarSync() {
	const provider = useSettingsStore((s) => s.provider);
	const { bookings } = useBookings();
	const { services } = useServices();

	const exportIcal = useCallback(() => {
		if (!provider) return;

		const serviceMap = new Map<string, Service>();
		for (const s of services) {
			serviceMap.set(s.id, s);
		}

		const icalContent = generateICalFeed(bookings, serviceMap, provider);
		downloadICalFile(icalContent, `${provider.bookingSlug}-termine.ics`);
	}, [provider, bookings, services]);

	return { exportIcal };
}
