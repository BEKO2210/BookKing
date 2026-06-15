import { InfoButton } from "@/components/ui/InfoButton";
import { useCalendarSync } from "@/hooks/useCalendarSync";
import { getViewTitle, useCalendarStore } from "@/store/calendar-store";
import type { CalendarView } from "@/types";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Download,
	Plus,
} from "lucide-react";

const views: { key: CalendarView; label: string }[] = [
	{ key: "day", label: "Tag" },
	{ key: "week", label: "Woche" },
	{ key: "month", label: "Monat" },
];

interface CalendarHeaderProps {
	onAddBlocker: () => void;
}

export function CalendarHeader({ onAddBlocker }: CalendarHeaderProps) {
	const { view, setView, currentDate, goBack, goForward, goToToday } =
		useCalendarStore();
	const { exportIcal } = useCalendarSync();

	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={goBack}
						className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
						aria-label="Zurück"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						type="button"
						onClick={goForward}
						className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
						aria-label="Vor"
					>
						<ChevronRight size={20} />
					</button>
				</div>

				<h2 className="text-lg font-semibold text-gray-900">
					{getViewTitle(view, currentDate)}
				</h2>

				<button
					type="button"
					onClick={goToToday}
					className="text-sm font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors"
				>
					Heute
				</button>

				<InfoButton title="Kalender">
					<p>Verwalten Sie hier alle Ihre Termine:</p>
					<ul className="list-disc list-inside space-y-1 ml-1">
						<li>
							Wechseln Sie zwischen <strong>Tag</strong>, <strong>Woche</strong>{" "}
							und <strong>Monat</strong>
						</li>
						<li>
							Klicken Sie auf einen Termin für Details oder zum Stornieren
						</li>
						<li>
							<strong>Blocker</strong> sperren Zeiträume (z.B. Mittagspause,
							Urlaub)
						</li>
						<li>
							<strong>iCal Export</strong> synchronisiert mit Google Calendar,
							Apple etc.
						</li>
					</ul>
				</InfoButton>
			</div>

			<div className="flex items-center gap-2">
				{/* View switcher */}
				<div className="flex bg-gray-100 rounded-lg p-0.5">
					{views.map((v) => (
						<button
							type="button"
							key={v.key}
							onClick={() => setView(v.key)}
							className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
								view === v.key
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							{v.label}
						</button>
					))}
				</div>

				<button
					type="button"
					onClick={onAddBlocker}
					className="btn-secondary flex items-center gap-1.5 text-sm"
				>
					<Plus size={16} />
					Blocker
				</button>

				<button
					type="button"
					onClick={exportIcal}
					className="btn-secondary flex items-center gap-1.5 text-sm"
					title="iCal Export"
				>
					<Download size={16} />
				</button>
			</div>
		</div>
	);
}
