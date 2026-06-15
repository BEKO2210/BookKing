import type { BookingStatus, CustomerTag, PriceType } from "@/types";
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { de } from "date-fns/locale";

/**
 * Generate a UUID v4.
 */
export function generateId(): string {
	return crypto.randomUUID();
}

/**
 * Generate a confirmation token for booking management links.
 */
export function generateToken(): string {
	const array = new Uint8Array(24);
	crypto.getRandomValues(array);
	return Array.from(array, (b) => b.toString(36).padStart(2, "0"))
		.join("")
		.slice(0, 32);
}

/**
 * Format a date string for display in German locale.
 */
export function formatDate(dateStr: string): string {
	const date = parseISO(dateStr);
	if (isToday(date)) return "Heute";
	if (isTomorrow(date)) return "Morgen";
	if (isYesterday(date)) return "Gestern";
	return format(date, "EEEE, d. MMMM yyyy", { locale: de });
}

/**
 * Format a date string as short format.
 */
export function formatDateShort(dateStr: string): string {
	return format(parseISO(dateStr), "dd.MM.yyyy");
}

/**
 * Format a date as relative text.
 */
export function formatDateRelative(dateStr: string): string {
	const date = parseISO(dateStr);
	if (isToday(date)) return "Heute";
	if (isTomorrow(date)) return "Morgen";
	if (isYesterday(date)) return "Gestern";
	return format(date, "dd.MM.", { locale: de });
}

/**
 * Format a time string for display.
 */
export function formatTime(time: string): string {
	return `${time} Uhr`;
}

/**
 * Format a duration in minutes to human-readable format.
 */
export function formatDuration(minutes: number): string {
	if (minutes < 60) return `${minutes} Min.`;
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (mins === 0) return `${hours} Std.`;
	return `${hours} Std. ${mins} Min.`;
}

/**
 * Format a price for display.
 */
export function formatPrice(
	price: number,
	priceType: PriceType,
	currency = "EUR",
): string {
	if (priceType === "free") return "Kostenlos";
	if (priceType === "on-request") return "Auf Anfrage";

	const formatted = new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency,
	}).format(price);

	return priceType === "from" ? `ab ${formatted}` : formatted;
}

/**
 * Get a human-readable label for a booking status.
 */
export function getStatusLabel(status: BookingStatus): string {
	const labels: Record<BookingStatus, string> = {
		confirmed: "Bestätigt",
		cancelled: "Storniert",
		"no-show": "Nicht erschienen",
		completed: "Abgeschlossen",
		rescheduled: "Umgebucht",
	};
	return labels[status];
}

/**
 * Get a CSS class for a booking status badge.
 */
export function getStatusBadgeClass(status: BookingStatus): string {
	const classes: Record<BookingStatus, string> = {
		confirmed: "badge-confirmed",
		cancelled: "badge-cancelled",
		"no-show": "badge-no-show",
		completed: "badge-completed",
		rescheduled: "badge-completed",
	};
	return classes[status];
}

/**
 * Get label for a customer tag.
 */
export function getTagLabel(tag: CustomerTag): string {
	const labels: Record<CustomerTag, string> = {
		vip: "VIP",
		stammkunde: "Stammkunde",
		neukunde: "Neukunde",
		problematisch: "Problematisch",
	};
	return labels[tag];
}

/**
 * Get a contrasting text color (black/white) for a background color.
 */
export function getContrastColor(hexColor: string): string {
	const hex = hexColor.replace("#", "");
	const r = Number.parseInt(hex.substring(0, 2), 16);
	const g = Number.parseInt(hex.substring(2, 4), 16);
	const b = Number.parseInt(hex.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Debounce a function.
 */
export function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Simple email validation.
 */
export function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Simple phone validation (accepts common formats).
 */
export function isValidPhone(phone: string): boolean {
	return /^[+]?[\d\s\-()]{6,20}$/.test(phone);
}

/**
 * Pluralize a German word based on count.
 */
export function pluralize(
	count: number,
	singular: string,
	plural: string,
): string {
	return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}

/**
 * Get initials from a name.
 */
export function getInitials(firstName: string, lastName: string): string {
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Generate a color from a string (for consistent avatar colors).
 */
export function stringToColor(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	const colors = [
		"#2563eb",
		"#7c3aed",
		"#db2777",
		"#dc2626",
		"#ea580c",
		"#d97706",
		"#65a30d",
		"#0d9488",
		"#0284c7",
		"#4f46e5",
	];
	return colors[Math.abs(hash) % colors.length] ?? "#2563eb";
}
