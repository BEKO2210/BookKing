import { Code, Eye, Mail } from "lucide-react";
import { useState } from "react";

export function EmailTemplateEditor() {
	const [activeTemplate, setActiveTemplate] = useState<string>("confirmation");
	const [showPreview, setShowPreview] = useState(true);

	const templates = [
		{ id: "confirmation", label: "Buchungsbestätigung" },
		{ id: "reminder", label: "Terminerinnerung" },
		{ id: "cancellation", label: "Stornierung" },
		{ id: "waitlist", label: "Warteliste" },
	];

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
				<Mail size={20} />
				E-Mail-Templates
			</h3>

			{/* Template selector */}
			<div className="flex gap-2 overflow-x-auto pb-2">
				{templates.map((t) => (
					<button
						type="button"
						key={t.id}
						onClick={() => setActiveTemplate(t.id)}
						className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
							activeTemplate === t.id
								? "bg-primary-50 text-primary-700"
								: "text-gray-500 hover:bg-gray-50"
						}`}
					>
						{t.label}
					</button>
				))}
			</div>

			{/* Toggle */}
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => setShowPreview(true)}
					className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
						showPreview ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
					}`}
				>
					<Eye size={14} />
					Vorschau
				</button>
				<button
					type="button"
					onClick={() => setShowPreview(false)}
					className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
						!showPreview
							? "bg-gray-900 text-white"
							: "bg-gray-100 text-gray-600"
					}`}
				>
					<Code size={14} />
					Bearbeiten
				</button>
			</div>

			{/* Preview / Editor */}
			<div className="card overflow-hidden">
				{showPreview ? (
					<div className="p-6 bg-gray-50">
						<div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
							<div className="bg-primary-600 p-6">
								<h2 className="text-white text-lg font-semibold">
									Ihr Geschäftsname
								</h2>
							</div>
							<div className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{activeTemplate === "confirmation" && "Buchungsbestätigung"}
									{activeTemplate === "reminder" && "Terminerinnerung"}
									{activeTemplate === "cancellation" && "Termin storniert"}
									{activeTemplate === "waitlist" && "Wunschtermin verfügbar!"}
								</h3>
								<p className="text-gray-500 text-sm mb-4">
									Hallo {"{{kundenname}}"}, ...
								</p>
								<div className="bg-gray-50 rounded-xl p-4 mb-4">
									<div className="flex justify-between text-sm mb-2">
										<span className="text-gray-500">Service</span>
										<span className="font-medium">{"{{service}}"}</span>
									</div>
									<div className="flex justify-between text-sm mb-2">
										<span className="text-gray-500">Datum</span>
										<span className="font-medium">{"{{datum}}"}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-500">Uhrzeit</span>
										<span className="font-medium">{"{{uhrzeit}}"}</span>
									</div>
								</div>
								<div className="text-center">
									<span className="inline-block bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-medium">
										Termin verwalten
									</span>
								</div>
							</div>
							<div className="px-6 py-3 border-t text-center text-xs text-gray-400">
								Powered by BookKing
							</div>
						</div>
					</div>
				) : (
					<div className="p-4">
						<p className="text-sm text-gray-500 mb-3">
							Verfügbare Variablen: {"{{kundenname}}"}, {"{{service}}"},{" "}
							{"{{datum}}"}, {"{{uhrzeit}}"}, {"{{preis}}"}, {"{{manage_url}}"}
						</p>
						<textarea
							className="input-field font-mono text-sm min-h-[300px]"
							defaultValue={
								"Hallo {{kundenname}},\n\nIhr Termin wurde bestätigt!\n\nService: {{service}}\nDatum: {{datum}}\nUhrzeit: {{uhrzeit}}\n\nSie können Ihren Termin unter folgendem Link verwalten:\n{{manage_url}}\n\nMit freundlichen Grüßen,\nIhr Team"
							}
						/>
						<div className="flex justify-end mt-3">
							<button type="button" className="btn-primary text-sm">
								Speichern
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
