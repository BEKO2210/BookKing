import type { Booking, Customer, Provider, Service } from "@/types";

// ═══════════════════════════════════════════
// BookKing — E-Mail-Templates
// ═══════════════════════════════════════════

interface TemplateVars {
	booking: Booking;
	service: Service;
	provider: Provider;
	customer: Customer;
	manageUrl: string;
}

function baseLayout(provider: Provider, content: string): string {
	return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
  <tr><td style="background:#2563eb;padding:24px 32px;">
    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">${escapeHtml(provider.businessName)}</h1>
  </td></tr>
  <tr><td style="padding:32px;">
    ${content}
  </td></tr>
  <tr><td style="padding:16px 32px 24px;border-top:1px solid #e2e8f0;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:13px;">
      ${escapeHtml(provider.businessName)} &bull; Powered by BookKing
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function bookingConfirmationEmail(vars: TemplateVars): {
	subject: string;
	html: string;
} {
	const { booking, service, provider, customer, manageUrl } = vars;

	const content = `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:18px;">Buchungsbestätigung</h2>
    <p style="margin:0 0 24px;color:#64748b;">Hallo ${escapeHtml(customer.firstName)}, Ihr Termin wurde bestätigt!</p>

    <table width="100%" style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Service</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(service.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Datum</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${formatDateDE(booking.date)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Uhrzeit</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${booking.startTime} – ${booking.endTime} Uhr</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Dauer</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${service.duration} Min.</td></tr>
      ${
				booking.totalPrice > 0
					? `
      <tr><td style="padding:8px 0;border-top:1px solid #e2e8f0;color:#64748b;font-size:14px;">Preis</td>
          <td style="padding:8px 0;border-top:1px solid #e2e8f0;color:#1e293b;font-size:16px;font-weight:700;text-align:right;">${booking.totalPrice.toFixed(2)} ${provider.currency}</td></tr>`
					: ""
			}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr><td align="center">
        <a href="${manageUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
          Termin verwalten
        </a>
      </td></tr>
    </table>

    <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">
      Kostenlose Stornierung bis ${provider.settings.cancellationWindow}h vor dem Termin möglich.
    </p>`;

	return {
		subject: `Buchungsbestätigung: ${service.name} am ${formatDateDE(booking.date)}`,
		html: baseLayout(provider, content),
	};
}

export function bookingReminderEmail(vars: TemplateVars): {
	subject: string;
	html: string;
} {
	const { booking, service, provider, customer, manageUrl } = vars;

	const content = `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:18px;">Terminerinnerung</h2>
    <p style="margin:0 0 24px;color:#64748b;">
      Hallo ${escapeHtml(customer.firstName)}, wir möchten Sie an Ihren bevorstehenden Termin erinnern.
    </p>

    <table width="100%" style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Service</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(service.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Datum</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${formatDateDE(booking.date)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Uhrzeit</td>
          <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;text-align:right;">${booking.startTime} Uhr</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${manageUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
          Termin verwalten
        </a>
      </td></tr>
    </table>`;

	return {
		subject: `Erinnerung: ${service.name} am ${formatDateDE(booking.date)} um ${booking.startTime} Uhr`,
		html: baseLayout(provider, content),
	};
}

export function bookingCancellationEmail(vars: TemplateVars): {
	subject: string;
	html: string;
} {
	const { booking, service, provider, customer } = vars;

	const content = `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:18px;">Termin storniert</h2>
    <p style="margin:0 0 24px;color:#64748b;">
      Hallo ${escapeHtml(customer.firstName)}, Ihr Termin wurde storniert.
    </p>

    <table width="100%" style="background:#fef2f2;border-radius:12px;padding:20px;margin-bottom:24px;" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Service</td>
          <td style="padding:8px 0;color:#991b1b;font-size:14px;font-weight:600;text-align:right;text-decoration:line-through;">${escapeHtml(service.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Datum</td>
          <td style="padding:8px 0;color:#991b1b;font-size:14px;font-weight:600;text-align:right;text-decoration:line-through;">${formatDateDE(booking.date)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;">Uhrzeit</td>
          <td style="padding:8px 0;color:#991b1b;font-size:14px;font-weight:600;text-align:right;text-decoration:line-through;">${booking.startTime} Uhr</td></tr>
    </table>

    <p style="margin:0;color:#64748b;font-size:14px;text-align:center;">
      Möchten Sie einen neuen Termin buchen? Besuchen Sie unsere Buchungsseite.
    </p>`;

	return {
		subject: `Stornierung: ${service.name} am ${formatDateDE(booking.date)}`,
		html: baseLayout(provider, content),
	};
}

export function waitlistNotificationEmail(
	vars: Omit<TemplateVars, "booking"> & { bookingUrl: string },
): { subject: string; html: string } {
	const { service, provider, customer, bookingUrl } = vars;

	const content = `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:18px;">Wunschtermin verfügbar!</h2>
    <p style="margin:0 0 24px;color:#64748b;">
      Hallo ${escapeHtml(customer.firstName)}, ein Termin für <strong>${escapeHtml(service.name)}</strong> ist frei geworden!
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${bookingUrl}" style="display:inline-block;background:#16a34a;color:#ffffff;padding:12px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
          Jetzt buchen
        </a>
      </td></tr>
    </table>

    <p style="margin:16px 0 0;color:#94a3b8;font-size:13px;text-align:center;">
      Schnell sein — der Termin ist nicht reserviert.
    </p>`;

	return {
		subject: `Wunschtermin für ${service.name} ist verfügbar!`,
		html: baseLayout(provider, content),
	};
}

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function formatDateDE(dateStr: string): string {
	const [year, month, day] = dateStr.split("-");
	const months = [
		"Januar",
		"Februar",
		"März",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Dezember",
	];
	const monthName = months[Number.parseInt(month ?? "1", 10) - 1];
	return `${Number.parseInt(day ?? "1", 10)}. ${monthName} ${year}`;
}
