import {
	ArrowLeft,
	BarChart3,
	Bell,
	Calendar,
	Clock,
	CreditCard,
	FileText,
	Globe,
	HelpCircle,
	Scissors,
	Settings,
	Smartphone,
	Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HelpPage() {
	const navigate = useNavigate();

	const sections = [
		{
			title: "Dashboard",
			icon: BarChart3,
			items: [
				{
					q: "Was zeigt das Dashboard?",
					a: "Eine Übersicht über Ihre heutigen Termine, Monatsumsatz, Auslastung, No-Show-Rate und die beliebtesten Services. Alles auf einen Blick.",
				},
				{
					q: 'Was bedeutet „Auslastung"?',
					a: "Der Prozentsatz der gebuchten Zeitslots im Verhältnis zu Ihren verfügbaren Arbeitszeiten. 100% heißt: jeder Slot ist gebucht.",
				},
				{
					q: "Was ist die No-Show-Rate?",
					a: "Der Anteil der Kunden, die nicht zum Termin erscheinen, ohne vorher abzusagen.",
				},
			],
		},
		{
			title: "Kalender",
			icon: Calendar,
			items: [
				{
					q: "Wie wechsle ich die Ansicht?",
					a: 'Nutzen Sie die Buttons „Tag", „Woche" und „Monat" oben im Kalender, um zwischen den Ansichten zu wechseln.',
				},
				{
					q: "Wie blockiere ich Zeiten?",
					a: 'Klicken Sie auf „+ Blocker", um Zeiten zu sperren (z.B. Mittagspause oder Urlaub). Geblockte Zeiten erscheinen nicht in der Buchungsseite.',
				},
				{
					q: "Wie storniere ich einen Termin?",
					a: 'Klicken Sie auf den Termin im Kalender und wählen Sie „Stornieren". Der Kunde wird automatisch per E-Mail informiert.',
				},
			],
		},
		{
			title: "Services",
			icon: Scissors,
			items: [
				{
					q: "Wie erstelle ich einen Service?",
					a: 'Klicken Sie auf „Neuer Service" und füllen Sie Name, Dauer, Preis und Kategorie aus. Optional: Pufferzeit und Kapazität.',
				},
				{
					q: "Was ist die Pufferzeit?",
					a: "Zeit vor oder nach dem Termin für Vorbereitung/Nachbereitung. Z.B. 10 Min. Aufräumen nach jedem Haarschnitt.",
				},
				{
					q: "Was bedeutet Kapazität?",
					a: "Wie viele Kunden gleichzeitig gebucht werden können. Für Gruppenkurse z.B. 10, für Einzeltermine 1.",
				},
			],
		},
		{
			title: "Kunden",
			icon: Users,
			items: [
				{
					q: "Wie finde ich einen Kunden?",
					a: "Nutzen Sie die Suchleiste oben. Sie können nach Name, E-Mail oder Telefonnummer suchen.",
				},
				{
					q: "Was bedeuten die Kunden-Tags?",
					a: '„VIP" = besonders wichtiger Kunde, „Stammkunde" = kommt regelmäßig, „Neu" = erster Besuch.',
				},
				{
					q: "Kann ich Kunden exportieren?",
					a: 'Ja! Klicken Sie auf „CSV Export" und alle Kundendaten werden als Datei heruntergeladen.',
				},
			],
		},
		{
			title: "Einstellungen",
			icon: Settings,
			items: [
				{
					q: "Wie ändere ich meine Arbeitszeiten?",
					a: "Unter Einstellungen → Arbeitszeiten können Sie für jeden Wochentag Ihre verfügbaren Zeiten festlegen.",
				},
				{
					q: "Was ist die Vorlaufzeit?",
					a: "Die Mindestzeit, die zwischen Buchung und Termin liegen muss. Z.B. 2 Stunden = Kunden können nicht kurzfristiger als 2h im Voraus buchen.",
				},
				{
					q: "Wie funktionieren E-Mail-Templates?",
					a: "Unter Einstellungen → E-Mail-Templates können Sie die automatischen E-Mails anpassen, die an Kunden gesendet werden (Bestätigung, Erinnerung, Stornierung).",
				},
			],
		},
		{
			title: "Buchungsseite",
			icon: Globe,
			items: [
				{
					q: "Wie teile ich meine Buchungsseite?",
					a: "Auf dem Dashboard finden Sie Ihren Buchungslink. Kopieren Sie ihn und teilen Sie ihn per WhatsApp, Social Media oder auf Ihrer Website.",
				},
				{
					q: "Können Kunden ohne Konto buchen?",
					a: "Ja! Kunden brauchen kein Konto. Sie geben nur Name, E-Mail und Telefon ein.",
				},
				{
					q: "Funktioniert die Buchung auf dem Handy?",
					a: "Ja, die Buchungsseite ist vollständig für Smartphones optimiert und funktioniert auf allen Geräten.",
				},
			],
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
			<header className="bg-white border-b border-gray-100 sticky top-0 z-10">
				<div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
						aria-label="Zurück"
					>
						<ArrowLeft size={20} />
					</button>
					<h1 className="font-semibold text-gray-900">Hilfe & Anleitungen</h1>
				</div>
			</header>

			<main id="main-content" className="max-w-2xl mx-auto px-4 py-8 space-y-8">
				<section>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
							<HelpCircle size={24} className="text-primary-600" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Hilfe-Center</h2>
							<p className="text-sm text-gray-500">Alles einfach erklärt</p>
						</div>
					</div>
					<p className="text-gray-600 leading-relaxed">
						Hier finden Sie Antworten auf die häufigsten Fragen zu allen
						Bereichen von BookKing. Klicken Sie auf eine Frage, um die Antwort
						zu sehen.
					</p>
				</section>

				{/* Quick Links */}
				<section className="grid grid-cols-2 sm:grid-cols-3 gap-2">
					{[
						{
							label: "So funktioniert's",
							icon: FileText,
							path: "/info/how-it-works",
						},
						{ label: "Datenschutz", icon: CreditCard, path: "/info/privacy" },
						{ label: "PWA installieren", icon: Smartphone, path: "" },
						{ label: "Benachrichtigungen", icon: Bell, path: "" },
						{ label: "Arbeitszeiten", icon: Clock, path: "" },
						{ label: "Buchungsseite", icon: Globe, path: "" },
					].map((link) => (
						<button
							type="button"
							key={link.label}
							onClick={() => link.path && navigate(link.path)}
							className={`card p-3 flex items-center gap-2 text-left text-sm ${link.path ? "hover:border-primary-200 cursor-pointer" : "opacity-60 cursor-default"}`}
						>
							<link.icon size={16} className="text-primary-600 shrink-0" />
							<span className="text-gray-700 font-medium text-xs">
								{link.label}
							</span>
						</button>
					))}
				</section>

				{/* FAQ Sections */}
				{sections.map((section) => (
					<section key={section.title}>
						<div className="flex items-center gap-2 mb-3">
							<section.icon size={18} className="text-primary-600" />
							<h3 className="font-semibold text-gray-900">{section.title}</h3>
						</div>
						<div className="space-y-2">
							{section.items.map((item) => (
								<details key={item.q} className="card group">
									<summary className="p-4 cursor-pointer font-medium text-gray-900 text-sm flex items-center justify-between list-none">
										{item.q}
										<span className="text-gray-400 group-open:rotate-180 transition-transform ml-2 shrink-0">
											▾
										</span>
									</summary>
									<div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
										{item.a}
									</div>
								</details>
							))}
						</div>
					</section>
				))}

				<p className="text-xs text-gray-400 text-center pb-8">
					Weitere Fragen? Schreiben Sie uns an{" "}
					<span className="text-primary-600">hilfe@bookking.app</span>
				</p>
			</main>
		</div>
	);
}
