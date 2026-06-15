import { useBookingStore } from "@/store/booking-store";
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	getDay,
	isBefore,
	isSameDay,
	isSameMonth,
	startOfDay,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns";
import { de } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function DatePicker() {
	const { selectedDate, selectDate, prevStep } = useBookingStore();
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const today = startOfDay(new Date());

	const days = useMemo(() => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(currentMonth);
		const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
		const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

		return eachDayOfInterval({ start: calStart, end: calEnd });
	}, [currentMonth]);

	const handleSelectDate = (date: Date) => {
		if (isBefore(date, today)) return;
		selectDate(format(date, "yyyy-MM-dd"));
	};

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

			<h2 className="text-2xl font-bold text-gray-900 mb-2">Datum wählen</h2>
			<p className="text-gray-500 mb-6">Wann soll Ihr Termin stattfinden?</p>

			<div className="card p-4">
				{/* Month navigation */}
				<div className="flex items-center justify-between mb-4">
					<button
						type="button"
						onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
						className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
						aria-label="Vorheriger Monat"
					>
						<ChevronLeft size={20} />
					</button>
					<h3 className="text-base font-semibold text-gray-900">
						{format(currentMonth, "MMMM yyyy", { locale: de })}
					</h3>
					<button
						type="button"
						onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
						className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
						aria-label="Nächster Monat"
					>
						<ChevronRight size={20} />
					</button>
				</div>

				{/* Weekday headers */}
				<div className="grid grid-cols-7 mb-2">
					{WEEKDAYS.map((day) => (
						<div
							key={day}
							className="text-center text-xs font-medium text-gray-400 py-2"
						>
							{day}
						</div>
					))}
				</div>

				{/* Days grid */}
				<div className="grid grid-cols-7 gap-1">
					{days.map((date) => {
						const isCurrentMonth = isSameMonth(date, currentMonth);
						const isPast = isBefore(date, today);
						const isSelected =
							selectedDate &&
							isSameDay(date, new Date(`${selectedDate}T00:00:00`));
						const isToday = isSameDay(date, today);

						return (
							<button
								type="button"
								key={date.toISOString()}
								onClick={() => handleSelectDate(date)}
								disabled={isPast || !isCurrentMonth}
								className={`
                  relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                  ${!isCurrentMonth ? "text-gray-200 cursor-default" : ""}
                  ${isPast && isCurrentMonth ? "text-gray-300 cursor-not-allowed" : ""}
                  ${isSelected ? "bg-primary-600 text-white shadow-sm" : ""}
                  ${!isSelected && isCurrentMonth && !isPast ? "text-gray-900 hover:bg-primary-50 active:bg-primary-100" : ""}
                  ${isToday && !isSelected ? "ring-2 ring-primary-200" : ""}
                `}
							>
								{format(date, "d")}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
