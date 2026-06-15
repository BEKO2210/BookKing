import { useBookings } from "@/hooks/useBookings";
import { useCustomers } from "@/hooks/useCustomers";
import {
	formatDateShort,
	getContrastColor,
	getInitials,
	getStatusBadgeClass,
	getStatusLabel,
	getTagLabel,
	pluralize,
	stringToColor,
} from "@/lib/utils";
import type { Customer } from "@/types";
import { ArrowLeft, Calendar, Mail, Phone, Tag } from "lucide-react";
import { CustomerNotes } from "./CustomerNotes";

interface CustomerProfileProps {
	customer: Customer;
	onBack: () => void;
}

export function CustomerProfile({ customer, onBack }: CustomerProfileProps) {
	const { bookings } = useBookings();
	const { updateCustomer } = useCustomers();

	const customerBookings = bookings.filter((b) => b.customerId === customer.id);
	const initials = getInitials(customer.firstName, customer.lastName);
	const bgColor = stringToColor(customer.email);
	const textColor = getContrastColor(bgColor);

	const handleToggleTag = (tag: Customer["tags"][number]) => {
		const newTags = customer.tags.includes(tag)
			? customer.tags.filter((t) => t !== tag)
			: [...customer.tags, tag];
		updateCustomer.mutate({ ...customer, tags: newTags });
	};

	return (
		<div>
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
			>
				<ArrowLeft size={16} />
				Zurück zur Kundenliste
			</button>

			{/* Profile header */}
			<div className="card p-6 mb-6">
				<div className="flex items-center gap-4 mb-4">
					<div
						className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold"
						style={{ backgroundColor: bgColor, color: textColor }}
					>
						{initials}
					</div>
					<div>
						<h2 className="text-xl font-bold text-gray-900">
							{customer.firstName} {customer.lastName}
						</h2>
						<div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
							<span className="flex items-center gap-1">
								<Mail size={14} />
								{customer.email}
							</span>
							{customer.phone && (
								<span className="flex items-center gap-1">
									<Phone size={14} />
									{customer.phone}
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
					<div>
						<p className="text-2xl font-bold text-gray-900">
							{customer.totalSpent.toFixed(0)} €
						</p>
						<p className="text-xs text-gray-500">Gesamtumsatz</p>
					</div>
					<div>
						<p className="text-2xl font-bold text-gray-900">
							{customerBookings.length}
						</p>
						<p className="text-xs text-gray-500">Buchungen</p>
					</div>
					<div>
						<p className="text-2xl font-bold text-gray-900">
							{customer.noShowCount}
						</p>
						<p className="text-xs text-gray-500">No-Shows</p>
					</div>
				</div>
			</div>

			{/* Tags */}
			<div className="card p-4 mb-6">
				<h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
					<Tag size={16} />
					Tags
				</h3>
				<div className="flex flex-wrap gap-2">
					{(["vip", "stammkunde", "neukunde", "problematisch"] as const).map(
						(tag) => (
							<button
								type="button"
								key={tag}
								onClick={() => handleToggleTag(tag)}
								className={`badge cursor-pointer transition-colors ${
									customer.tags.includes(tag)
										? tag === "vip"
											? "bg-amber-100 text-amber-800"
											: tag === "stammkunde"
												? "bg-green-100 text-green-800"
												: tag === "problematisch"
													? "bg-red-100 text-red-800"
													: "bg-blue-100 text-blue-800"
										: "bg-gray-100 text-gray-400"
								}`}
							>
								{getTagLabel(tag)}
							</button>
						),
					)}
				</div>
			</div>

			{/* Notes */}
			<CustomerNotes customer={customer} />

			{/* Booking history */}
			<div className="card p-4 mt-6">
				<h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
					<Calendar size={16} />
					Buchungshistorie
				</h3>

				{customerBookings.length === 0 ? (
					<p className="text-sm text-gray-400">Keine Buchungen.</p>
				) : (
					<div className="space-y-2">
						{customerBookings.map((booking) => (
							<div
								key={booking.id}
								className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
							>
								<div>
									<p className="text-sm font-medium text-gray-900">
										{formatDateShort(booking.date)} · {booking.startTime}
									</p>
									<span className={getStatusBadgeClass(booking.status)}>
										{getStatusLabel(booking.status)}
									</span>
								</div>
								<p className="text-sm font-semibold text-gray-700">
									{booking.totalPrice.toFixed(2)} €
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
