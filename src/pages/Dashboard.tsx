import { BookingDashboard } from "@/components/dashboard/BookingDashboard";
import { BookingLink } from "@/components/ui/BookingLink";
import { InfoButton } from "@/components/ui/InfoButton";
import { useSettingsStore } from "@/store/settings-store";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
	const provider = useSettingsStore((s) => s.provider);
	const navigate = useNavigate();

	return (
		<div>
			<div className="flex items-start justify-between mb-6">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
						Willkommen{provider ? `, ${provider.name.split(" ")[0]}` : ""}
					</h1>
					<p className="text-gray-500 text-sm">Ihr Dashboard im Überblick.</p>
				</div>
				<div className="flex items-center gap-2">
					<InfoButton title="Dashboard-Übersicht">
						<p>Hier sehen Sie auf einen Blick:</p>
						<ul className="list-disc list-inside space-y-1 ml-1">
							<li>
								<strong>Heute</strong> — Anzahl der heutigen Termine
							</li>
							<li>
								<strong>Monatsumsatz</strong> — Ihr Umsatz diesen Monat
							</li>
							<li>
								<strong>Auslastung</strong> — Wie voll Ihr Kalender ist
							</li>
							<li>
								<strong>No-Show Rate</strong> — Anteil verpasster Termine
							</li>
						</ul>
						<p>Scrollen Sie nach unten für Ihren Tagesplan und Statistiken.</p>
					</InfoButton>
					<button
						type="button"
						onClick={() => navigate("/info/help")}
						className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
						aria-label="Hilfe-Center öffnen"
					>
						<HelpCircle size={20} />
					</button>
				</div>
			</div>

			<div className="mb-6">
				<BookingLink />
			</div>

			<BookingDashboard />
		</div>
	);
}
