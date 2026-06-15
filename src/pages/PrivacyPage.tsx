import {
	ArrowLeft,
	Database,
	Eye,
	Lock,
	Mail,
	Shield,
	Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PrivacyPage() {
	const navigate = useNavigate();

	const sections = [
		{
			icon: Database,
			title: "Welche Daten speichern wir?",
			items: [
				"Vorname und Nachname — damit Ihr Anbieter Sie zuordnen kann",
				"E-Mail-Adresse — für Buchungsbestätigungen und Erinnerungen",
				"Telefonnummer (optional) — falls der Anbieter Sie kontaktieren muss",
				"Buchungsdetails — Service, Datum, Uhrzeit, Notizen",
			],
		},
		{
			icon: Eye,
			title: "Wofür nutzen wir Ihre Daten?",
			items: [
				"Terminbestätigung und Erinnerungen per E-Mail senden",
				"Dem Anbieter Ihre Buchungsdetails anzeigen",
				"Ihnen eine Übersicht Ihrer gebuchten Termine geben",
				"Service-Verbesserungen (anonymisiert)",
			],
		},
		{
			icon: Lock,
			title: "Wie schützen wir Ihre Daten?",
			items: [
				"Verschlüsselte Übertragung (HTTPS/TLS)",
				"Daten werden lokal auf dem Gerät und verschlüsselt in der Cloud gespeichert",
				"Kein Verkauf Ihrer Daten an Dritte — niemals",
				"Regelmäßige Sicherheits-Updates",
			],
		},
		{
			icon: Trash2,
			title: "Ihre Rechte",
			items: [
				"Auskunft — Fragen Sie jederzeit, welche Daten gespeichert sind",
				"Löschung — Lassen Sie Ihre Daten vollständig löschen",
				"Widerspruch — Sie können Benachrichtigungen jederzeit abbestellen",
				"Datenportabilität — Exportieren Sie Ihre Daten als CSV",
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
					<h1 className="font-semibold text-gray-900">Datenschutz</h1>
				</div>
			</header>

			<main id="main-content" className="max-w-2xl mx-auto px-4 py-8 space-y-8">
				{/* Intro */}
				<section>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
							<Shield size={24} className="text-primary-600" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Datenschutz</h2>
							<p className="text-sm text-gray-500">
								Einfach und verständlich erklärt
							</p>
						</div>
					</div>
					<p className="text-gray-600 leading-relaxed">
						Wir nehmen den Schutz Ihrer persönlichen Daten ernst. Hier erklären
						wir in einfacher Sprache, was mit Ihren Daten passiert, wenn Sie
						über BookKing einen Termin buchen.
					</p>
				</section>

				{/* Sections */}
				{sections.map((section) => (
					<section key={section.title} className="card p-5">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
								<section.icon size={16} className="text-primary-600" />
							</div>
							<h3 className="font-semibold text-gray-900">{section.title}</h3>
						</div>
						<ul className="space-y-2">
							{section.items.map((item) => (
								<li
									key={item}
									className="flex items-start gap-2 text-sm text-gray-600"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0 mt-1.5" />
									{item}
								</li>
							))}
						</ul>
					</section>
				))}

				{/* Cookies */}
				<section className="card p-5">
					<h3 className="font-semibold text-gray-900 mb-3">
						Cookies & Tracking
					</h3>
					<p className="text-sm text-gray-600 leading-relaxed">
						BookKing verwendet <strong>keine Tracking-Cookies</strong> und kein
						Google Analytics. Wir speichern nur technisch notwendige Daten (wie
						Ihre Einstellungen) lokal auf Ihrem Gerät. Es werden keine Daten an
						Werbetreibende weitergegeben.
					</p>
				</section>

				{/* Contact */}
				<section className="card p-5 bg-gray-50 border-0">
					<div className="flex items-center gap-3 mb-3">
						<Mail size={18} className="text-gray-500" />
						<h3 className="font-semibold text-gray-900">
							Fragen zum Datenschutz?
						</h3>
					</div>
					<p className="text-sm text-gray-600 leading-relaxed">
						Wenn Sie Fragen zu Ihren Daten haben oder eine Löschung wünschen,
						kontaktieren Sie den jeweiligen Anbieter direkt oder schreiben Sie
						uns an{" "}
						<span className="font-medium text-primary-600">
							datenschutz@bookking.app
						</span>
						.
					</p>
				</section>

				<p className="text-xs text-gray-400 text-center pb-8">
					Stand: März 2026 &middot; BookKing Datenschutzerklärung
				</p>
			</main>
		</div>
	);
}
