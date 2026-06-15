import { downloadICalFile, generateICalEvent } from "@/lib/ical-generator";
import { calculateEndTime } from "@/lib/slot-engine";
import { formatDate, formatDuration, formatTime } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";
import { useSettingsStore } from "@/store/settings-store";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle, Download } from "lucide-react";

export function BookingConfirmation() {
	const { selectedService, selectedDate, selectedTime, formData, reset } =
		useBookingStore();
	const provider = useSettingsStore((s) => s.provider);

	if (!selectedService || !selectedDate || !selectedTime || !provider)
		return null;

	const handleDownloadIcal = () => {
		const booking = {
			id: "temp",
			providerId: provider.id,
			serviceId: selectedService.id,
			customerId: "",
			date: selectedDate,
			startTime: selectedTime,
			endTime: calculateEndTime(selectedTime, selectedService.duration),
			status: "confirmed" as const,
			addons: [],
			totalPrice: selectedService.price,
			depositPaid: 0,
			confirmationToken: "",
			createdAt: new Date().toISOString(),
		};

		const ical = generateICalEvent(booking, selectedService, provider);
		downloadICalFile(ical, `termin-${selectedDate}.ics`);
	};

	return (
		<div className="text-center">
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: "spring", stiffness: 200, damping: 15 }}
				className="mx-auto w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6"
			>
				<CheckCircle size={40} className="text-green-500" />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Termin bestätigt!
				</h2>
				<p className="text-gray-500 mb-8">
					Eine Bestätigung wurde an{" "}
					<span className="font-medium text-gray-700">{formData.email}</span>{" "}
					gesendet.
				</p>

				<div className="card p-5 mb-6 text-left">
					<div className="flex items-center gap-3 mb-4">
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center"
							style={{ backgroundColor: `${selectedService.color}20` }}
						>
							<div
								className="w-4 h-4 rounded-full"
								style={{ backgroundColor: selectedService.color }}
							/>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900">
								{selectedService.name}
							</h3>
							<p className="text-sm text-gray-500">
								{formatDuration(selectedService.duration)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 text-sm text-gray-700">
						<Calendar size={16} className="text-gray-400" />
						<span>
							{formatDate(selectedDate)} um {formatTime(selectedTime)}
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<button
						type="button"
						onClick={handleDownloadIcal}
						className="btn-secondary flex items-center justify-center gap-2"
					>
						<Download size={18} />
						Zum Kalender hinzufügen (.ics)
					</button>

					<button
						type="button"
						onClick={reset}
						className="btn-primary flex items-center justify-center gap-2"
					>
						Weiteren Termin buchen
						<ArrowRight size={18} />
					</button>
				</div>

				<p className="text-xs text-gray-400 mt-6">
					Sie können Ihren Termin über den Link in der Bestätigungs-E-Mail
					stornieren oder umbuchen.
				</p>
			</motion.div>
		</div>
	);
}
