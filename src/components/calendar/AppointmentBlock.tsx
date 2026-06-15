import { getContrastColor } from "@/lib/utils";
import type { CalendarEvent } from "@/types";
import { motion } from "framer-motion";

interface AppointmentBlockProps {
	event: CalendarEvent;
	onClick?: (event: CalendarEvent) => void;
	style?: React.CSSProperties;
}

export function AppointmentBlock({
	event,
	onClick,
	style,
}: AppointmentBlockProps) {
	const textColor = getContrastColor(event.color);
	const isBooking = event.type === "booking";
	const isBlocker = event.type === "blocker";

	return (
		<motion.button
			layout
			onClick={() => onClick?.(event)}
			className={`
        absolute left-1 right-1 rounded-lg px-2 py-1 text-left overflow-hidden cursor-pointer
        transition-shadow hover:shadow-md hover:z-10
        ${isBlocker ? "opacity-75 bg-stripes" : ""}
      `}
			style={{
				backgroundColor: event.color,
				color: textColor,
				...style,
			}}
		>
			<p className="text-xs font-semibold truncate">{event.title}</p>
			<p className="text-[10px] opacity-80 truncate">
				{event.startTime} – {event.endTime}
			</p>
			{isBooking && event.booking && (
				<p className="text-[10px] opacity-70 truncate">
					{event.booking.status === "confirmed"
						? "Bestätigt"
						: event.booking.status}
				</p>
			)}
		</motion.button>
	);
}
