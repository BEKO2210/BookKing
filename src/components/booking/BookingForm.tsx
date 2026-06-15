import { isValidEmail, isValidPhone } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export function BookingForm() {
	const { formData, setFormData, nextStep, prevStep, selectedService } =
		useBookingStore();
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = (): boolean => {
		const errs: Record<string, string> = {};
		if (!formData.firstName?.trim())
			errs.firstName = "Vorname ist erforderlich";
		if (!formData.lastName?.trim()) errs.lastName = "Nachname ist erforderlich";
		if (!formData.email?.trim()) {
			errs.email = "E-Mail ist erforderlich";
		} else if (!isValidEmail(formData.email)) {
			errs.email = "Ungültige E-Mail-Adresse";
		}
		if (formData.phone && !isValidPhone(formData.phone)) {
			errs.phone = "Ungültige Telefonnummer";
		}
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validate()) {
			nextStep(); // → summary
		}
	};

	// Addon toggling
	const addons = selectedService?.addons ?? [];

	return (
		<div>
			<button
				type="button"
				onClick={prevStep}
				className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
			>
				<ArrowLeft size={16} />
				Zurück
			</button>

			<h2 className="text-2xl font-bold text-gray-900 mb-2">Ihre Daten</h2>
			<p className="text-gray-500 mb-6">
				Geben Sie Ihre Kontaktdaten ein, damit wir Ihnen eine Bestätigung senden
				können.
			</p>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="firstName"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Vorname *
						</label>
						<input
							id="firstName"
							type="text"
							className={`input-field ${errors.firstName ? "border-red-400" : ""}`}
							value={formData.firstName ?? ""}
							onChange={(e) => setFormData({ firstName: e.target.value })}
							placeholder="Max"
							autoComplete="given-name"
						/>
						{errors.firstName && (
							<p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
						)}
					</div>
					<div>
						<label
							htmlFor="lastName"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Nachname *
						</label>
						<input
							id="lastName"
							type="text"
							className={`input-field ${errors.lastName ? "border-red-400" : ""}`}
							value={formData.lastName ?? ""}
							onChange={(e) => setFormData({ lastName: e.target.value })}
							placeholder="Mustermann"
							autoComplete="family-name"
						/>
						{errors.lastName && (
							<p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
						)}
					</div>
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						E-Mail *
					</label>
					<input
						id="email"
						type="email"
						className={`input-field ${errors.email ? "border-red-400" : ""}`}
						value={formData.email ?? ""}
						onChange={(e) => setFormData({ email: e.target.value })}
						placeholder="max@example.de"
						autoComplete="email"
					/>
					{errors.email && (
						<p className="text-xs text-red-500 mt-1">{errors.email}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="phone"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Telefon (optional)
					</label>
					<input
						id="phone"
						type="tel"
						className={`input-field ${errors.phone ? "border-red-400" : ""}`}
						value={formData.phone ?? ""}
						onChange={(e) => setFormData({ phone: e.target.value })}
						placeholder="+49 170 1234567"
						autoComplete="tel"
					/>
					{errors.phone && (
						<p className="text-xs text-red-500 mt-1">{errors.phone}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="notes"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Anmerkungen (optional)
					</label>
					<textarea
						id="notes"
						className="input-field min-h-[80px] resize-none"
						value={formData.notes ?? ""}
						onChange={(e) => setFormData({ notes: e.target.value })}
						placeholder="Besondere Wünsche oder Hinweise..."
						rows={3}
					/>
				</div>

				{/* Addon selection */}
				{addons.length > 0 && (
					<div>
						<p className="text-sm font-medium text-gray-700 mb-2">
							Zusatzoptionen
						</p>
						<div className="space-y-2">
							{addons.map((addon) => (
								<label
									key={addon.id}
									className="flex items-center gap-3 card p-3 cursor-pointer hover:border-primary-200 transition-colors"
								>
									<input
										type="checkbox"
										className="w-4 h-4 rounded border-gray-300 text-primary-600"
										checked={formData.addons?.includes(addon.id) ?? false}
										onChange={() => {
											const current = formData.addons ?? [];
											const next = current.includes(addon.id)
												? current.filter((id) => id !== addon.id)
												: [...current, addon.id];
											setFormData({ addons: next });
										}}
									/>
									<div className="flex-1">
										<span className="text-sm font-medium text-gray-900">
											{addon.name}
										</span>
										<span className="text-sm text-gray-500 ml-2">
											+{addon.duration} Min.
										</span>
									</div>
									<span className="text-sm font-semibold text-gray-700">
										+{addon.price.toFixed(2)} €
									</span>
								</label>
							))}
						</div>
					</div>
				)}

				<button type="submit" className="btn-primary w-full">
					Weiter zur Zusammenfassung
				</button>
			</form>
		</div>
	);
}
