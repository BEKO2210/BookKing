// ═══════════════════════════════════════════
// BookKing — Notification System
// ═══════════════════════════════════════════

import type { Booking, Customer, Provider, Service } from "@/types";
import {
	bookingCancellationEmail,
	bookingConfirmationEmail,
	bookingReminderEmail,
} from "./email-templates";

export type NotificationChannel = "email" | "push" | "sms";

interface NotificationPayload {
	channel: NotificationChannel;
	to: string;
	subject: string;
	body: string;
	html?: string;
}

/**
 * Request browser push notification permission.
 */
export async function requestPushPermission(): Promise<boolean> {
	if (!("Notification" in window)) return false;
	if (Notification.permission === "granted") return true;
	if (Notification.permission === "denied") return false;

	const result = await Notification.requestPermission();
	return result === "granted";
}

/**
 * Send a browser push notification.
 */
export function sendPushNotification(
	title: string,
	body: string,
	icon?: string,
): void {
	if (!("Notification" in window) || Notification.permission !== "granted")
		return;

	const notification = new Notification(title, {
		body,
		icon: icon ?? "/icons/icon-192.png",
		badge: "/icons/icon-192.png",
		tag: `bookking-${Date.now()}`,
	});

	notification.onclick = () => {
		window.focus();
		notification.close();
	};
}

/**
 * Notify the provider about a new booking.
 */
export function notifyNewBooking(
	booking: Booking,
	service: Service,
	customer: Customer,
): void {
	sendPushNotification(
		"Neue Buchung!",
		`${customer.firstName} ${customer.lastName} hat ${service.name} am ${formatDateShort(booking.date)} um ${booking.startTime} gebucht.`,
	);
}

/**
 * Notify the provider about a cancellation.
 */
export function notifyCancellation(
	booking: Booking,
	service: Service,
	customer: Customer,
): void {
	sendPushNotification(
		"Stornierung",
		`${customer.firstName} ${customer.lastName} hat ${service.name} am ${formatDateShort(booking.date)} um ${booking.startTime} storniert.`,
	);
}

/**
 * Prepare confirmation email for a new booking.
 */
export function prepareConfirmationEmail(
	booking: Booking,
	service: Service,
	provider: Provider,
	customer: Customer,
): NotificationPayload {
	const manageUrl = `${window.location.origin}/manage/${booking.confirmationToken}`;
	const email = bookingConfirmationEmail({
		booking,
		service,
		provider,
		customer,
		manageUrl,
	});

	return {
		channel: "email",
		to: customer.email,
		subject: email.subject,
		body: "",
		html: email.html,
	};
}

/**
 * Prepare reminder email.
 */
export function prepareReminderEmail(
	booking: Booking,
	service: Service,
	provider: Provider,
	customer: Customer,
): NotificationPayload {
	const manageUrl = `${window.location.origin}/manage/${booking.confirmationToken}`;
	const email = bookingReminderEmail({
		booking,
		service,
		provider,
		customer,
		manageUrl,
	});

	return {
		channel: "email",
		to: customer.email,
		subject: email.subject,
		body: "",
		html: email.html,
	};
}

/**
 * Prepare cancellation email.
 */
export function prepareCancellationEmail(
	booking: Booking,
	service: Service,
	provider: Provider,
	customer: Customer,
): NotificationPayload {
	const manageUrl = `${window.location.origin}/manage/${booking.confirmationToken}`;
	const email = bookingCancellationEmail({
		booking,
		service,
		provider,
		customer,
		manageUrl,
	});

	return {
		channel: "email",
		to: customer.email,
		subject: email.subject,
		body: "",
		html: email.html,
	};
}

/**
 * Send a notification via the configured channel.
 * In production, this would call your backend API (Supabase Edge Function, etc.)
 */
export async function sendNotification(
	payload: NotificationPayload,
): Promise<boolean> {
	console.log(
		`[Notification] Would send ${payload.channel} to ${payload.to}: ${payload.subject}`,
	);

	// In production:
	// const { error } = await supabase.functions.invoke('send-notification', {
	//   body: payload,
	// });
	// return !error;

	return true;
}

function formatDateShort(dateStr: string): string {
	const [, month, day] = dateStr.split("-");
	return `${day}.${month}.`;
}
