import { motion, useInView } from "framer-motion";
import {
	ArrowRight,
	BarChart3,
	Bell,
	Calendar,
	CalendarCheck,
	Check,
	ChevronRight,
	Clock,
	CreditCard,
	Globe,
	Heart,
	Layout,
	MousePointer,
	Play,
	Shield,
	Smartphone,
	Sparkles,
	Star,
	TrendingUp,
	Users,
	Wifi,
	WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ═══════════════════════════════════════════
// BookKing Landing Page — Conversion-Optimiert
// ═══════════════════════════════════════════

export function LandingPage() {
	return (
		<div className="min-h-screen bg-white overflow-hidden">
			<Navbar />
			<HeroSection />
			<LogoCloud />
			<FeaturesGrid />
			<BookingFlowDemo />
			<DashboardPreview />
			<StatsSection />
			<PricingSection />
			<TestimonialSection />
			<CTASection />
			<Footer />
		</div>
	);
}

// ═══════════════════════════════════════════
// Navbar
// ═══════════════════════════════════════════

function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const handler = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handler, { passive: true });
		return () => window.removeEventListener("scroll", handler);
	}, []);

	return (
		<>
			<motion.nav
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					scrolled
						? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100"
						: "bg-transparent"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 lg:h-20">
						<div className="flex items-center gap-2">
							<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
								<Calendar size={18} className="text-white" />
							</div>
							<span className="text-xl font-bold text-gray-900">
								Book<span className="text-blue-600">King</span>
							</span>
						</div>

						<div className="hidden md:flex items-center gap-8">
							<a
								href="#features"
								className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
							>
								Features
							</a>
							<a
								href="#demo"
								className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
							>
								Demo
							</a>
							<a
								href="#pricing"
								className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
							>
								Preise
							</a>
							<button
								type="button"
								onClick={() => navigate("/info/how-it-works")}
								className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
							>
								So funktioniert's
							</button>
						</div>

						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => navigate("/dashboard")}
								className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl transition-colors"
							>
								Login
							</button>
							<button
								type="button"
								onClick={() => navigate("/dashboard")}
								className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-[0.98]"
							>
								Kostenlos starten
							</button>
							{/* Mobile menu button */}
							<button
								type="button"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
								aria-label="Menü"
							>
								<svg
									width="24"
									height="24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									aria-hidden="true"
								>
									{mobileMenuOpen ? (
										<path d="M18 6L6 18M6 6l12 12" />
									) : (
										<path d="M3 12h18M3 6h18M3 18h18" />
									)}
								</svg>
							</button>
						</div>
					</div>
				</div>
			</motion.nav>

			{/* Mobile menu */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-40 md:hidden">
					<button
						type="button"
						aria-label="Menü schließen"
						className="absolute inset-0 bg-black/20"
						onClick={() => setMobileMenuOpen(false)}
					/>
					<div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-4 space-y-2">
						{/* biome-ignore lint/a11y/useValidAnchor: genuine in-page hash navigation; onClick only closes the mobile menu */}
						<a
							href="#features"
							onClick={() => setMobileMenuOpen(false)}
							className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
						>
							Features
						</a>
						{/* biome-ignore lint/a11y/useValidAnchor: genuine in-page hash navigation; onClick only closes the mobile menu */}
						<a
							href="#demo"
							onClick={() => setMobileMenuOpen(false)}
							className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
						>
							Demo
						</a>
						{/* biome-ignore lint/a11y/useValidAnchor: genuine in-page hash navigation; onClick only closes the mobile menu */}
						<a
							href="#pricing"
							onClick={() => setMobileMenuOpen(false)}
							className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
						>
							Preise
						</a>
						<button
							type="button"
							onClick={() => {
								navigate("/info/how-it-works");
								setMobileMenuOpen(false);
							}}
							className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
						>
							So funktioniert's
						</button>
						<button
							type="button"
							onClick={() => {
								navigate("/info/help");
								setMobileMenuOpen(false);
							}}
							className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
						>
							Hilfe & FAQ
						</button>
						<button
							type="button"
							onClick={() => {
								navigate("/info/privacy");
								setMobileMenuOpen(false);
							}}
							className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
						>
							Datenschutz
						</button>
						<div className="border-t border-gray-100 pt-2">
							<button
								type="button"
								onClick={() => {
									navigate("/dashboard");
									setMobileMenuOpen(false);
								}}
								className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-semibold"
							>
								Kostenlos starten
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

// ═══════════════════════════════════════════
// Hero Section
// ═══════════════════════════════════════════

function HeroSection() {
	const navigate = useNavigate();

	return (
		<section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-60" />
				<div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-indigo-50 to-transparent rounded-full blur-3xl opacity-40" />
				<div className="absolute top-40 left-0 w-[300px] h-[300px] bg-gradient-to-br from-purple-50 to-transparent rounded-full blur-3xl opacity-30" />
				{/* Grid pattern */}
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"radial-gradient(circle, #000 1px, transparent 1px)",
						backgroundSize: "32px 32px",
					}}
				/>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-4xl mx-auto">
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
							<Sparkles size={14} />
							Die Zukunft der Terminbuchung ist da
						</span>
					</motion.div>

					{/* Headline */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.08]"
					>
						Termine buchen.
						<br />
						<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
							Kunden begeistern.
						</span>
						<br />
						Einfach.
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="mt-8 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
					>
						Das intelligente Buchungssystem das sich mit Calendly und SimplyBook
						messen kann — als installierbare Progressive Web App. Vollständig.
						Bezahlbar. Deins.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
					>
						<button
							type="button"
							onClick={() => navigate("/book/demo-salon")}
							className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center gap-2"
						>
							Live Demo testen
							<ArrowRight
								size={18}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</button>
						<button
							type="button"
							onClick={() => navigate("/dashboard")}
							className="group bg-white text-gray-700 px-8 py-4 rounded-2xl text-base font-semibold border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all flex items-center gap-2"
						>
							<Play size={18} className="text-blue-600" />
							Dashboard ansehen
						</button>
					</motion.div>

					{/* Trust line */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="mt-6 text-sm text-gray-400 flex items-center justify-center gap-4"
					>
						<span className="flex items-center gap-1">
							<Check size={14} className="text-green-500" />
							Keine Kreditkarte nötig
						</span>
						<span className="flex items-center gap-1">
							<Check size={14} className="text-green-500" />
							Sofort einsatzbereit
						</span>
						<span className="flex items-center gap-1">
							<Check size={14} className="text-green-500" />
							DSGVO-konform
						</span>
					</motion.p>
				</div>

				{/* Hero visual — Dashboard mockup */}
				<motion.div
					initial={{ opacity: 0, y: 60 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.8 }}
					className="mt-20 relative max-w-5xl mx-auto"
				>
					<div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-200/60 bg-white">
						<DashboardMockup />
					</div>
					{/* Glow effect */}
					<div className="absolute -inset-4 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl -z-10 blur-xl" />
				</motion.div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// Dashboard Mockup (visual)
// ═══════════════════════════════════════════

function DashboardMockup() {
	return (
		<div className="flex h-[420px] sm:h-[500px]">
			{/* Sidebar */}
			<div className="hidden sm:flex w-[220px] bg-gray-50 border-r border-gray-100 flex-col p-4 shrink-0">
				<div className="flex items-center gap-2 mb-8">
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
						<Calendar size={14} className="text-white" />
					</div>
					<span className="font-bold text-gray-900 text-sm">BookKing</span>
				</div>
				{[
					{ icon: Layout, label: "Dashboard", active: true },
					{ icon: Calendar, label: "Kalender", active: false },
					{ icon: Users, label: "Kunden", active: false },
					{ icon: BarChart3, label: "Statistik", active: false },
				].map((item) => (
					<div
						key={item.label}
						className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-1 ${
							item.active
								? "bg-blue-50 text-blue-700 font-medium"
								: "text-gray-500"
						}`}
					>
						<item.icon size={16} />
						{item.label}
					</div>
				))}
			</div>

			{/* Main content */}
			<div className="flex-1 p-4 sm:p-6 overflow-hidden">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-lg font-bold text-gray-900">Willkommen, Max</h2>
						<p className="text-xs text-gray-400">Ihr Dashboard im Überblick</p>
					</div>
					<div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
						Heute, 11. März 2026
					</div>
				</div>

				{/* KPI Cards */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
					{[
						{
							label: "Heute",
							value: "8",
							sub: "Termine",
							color: "blue",
							icon: Calendar,
						},
						{
							label: "Umsatz",
							value: "2.340 €",
							sub: "diesen Monat",
							color: "green",
							icon: TrendingUp,
						},
						{
							label: "Auslastung",
							value: "87%",
							sub: "diesen Monat",
							color: "amber",
							icon: BarChart3,
						},
						{
							label: "Kunden",
							value: "156",
							sub: "Gesamt",
							color: "purple",
							icon: Users,
						},
					].map((kpi) => (
						<div
							key={kpi.label}
							className="bg-white rounded-xl border border-gray-100 p-3"
						>
							<div className="flex items-center gap-1.5 mb-1">
								<kpi.icon size={12} className={`text-${kpi.color}-500`} />
								<span className="text-[10px] text-gray-400">{kpi.label}</span>
							</div>
							<p className="text-lg font-bold text-gray-900">{kpi.value}</p>
							<p className="text-[10px] text-gray-400">{kpi.sub}</p>
						</div>
					))}
				</div>

				{/* Chart area */}
				<div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
					<p className="text-xs font-medium text-gray-500 mb-3">
						Umsatz (letzte 30 Tage)
					</p>
					<div className="flex items-end gap-1 h-20">
						{[
							30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95, 80, 100, 90, 88,
							92, 78, 85, 95, 88, 100, 92, 85, 90, 95, 100, 92, 88, 96,
						].map((h, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: static decorative chart bars, never reorder
								key={i}
								className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm opacity-70 hover:opacity-100 transition-opacity"
								style={{ height: `${h}%` }}
							/>
						))}
					</div>
				</div>

				{/* Today's schedule */}
				<div className="bg-white rounded-xl border border-gray-100 p-4">
					<p className="text-xs font-medium text-gray-500 mb-2">
						Heutige Termine
					</p>
					{[
						{
							time: "09:00",
							name: "Haarschnitt",
							client: "Anna M.",
							color: "#3b82f6",
						},
						{
							time: "10:30",
							name: "Färben",
							client: "Lisa K.",
							color: "#8b5cf6",
						},
						{
							time: "12:00",
							name: "Styling",
							client: "Tom S.",
							color: "#ec4899",
						},
					].map((t) => (
						<div key={t.time} className="flex items-center gap-2 py-1.5">
							<div
								className="w-0.5 h-6 rounded-full"
								style={{ backgroundColor: t.color }}
							/>
							<span className="text-[11px] text-gray-400 w-10">{t.time}</span>
							<span className="text-[11px] font-medium text-gray-800">
								{t.name}
							</span>
							<span className="text-[11px] text-gray-400 ml-auto">
								{t.client}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ═══════════════════════════════════════════
// Logo Cloud
// ═══════════════════════════════════════════

function LogoCloud() {
	const industries = [
		"Friseure",
		"Coaching",
		"Arztpraxen",
		"Fitness",
		"Beauty",
		"Beratung",
		"Massage",
		"Tattoo",
		"Fahrschulen",
		"Nachhilfe",
		"Therapeuten",
		"Agenturen",
	];

	return (
		<section className="py-12 border-y border-gray-100 bg-gray-50/50">
			<div className="max-w-7xl mx-auto px-4 text-center">
				<p className="text-sm text-gray-400 mb-6">
					Perfekt für jede Branche mit Terminbuchung
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
					{industries.map((name) => (
						<span
							key={name}
							className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// Features Grid
// ═══════════════════════════════════════════

function FeaturesGrid() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const features = [
		{
			icon: CalendarCheck,
			title: "Online Buchung",
			desc: "4-Schritt Buchungsflow optimiert für maximale Conversion. Mobile-First, keine Registrierung nötig.",
			color: "blue",
		},
		{
			icon: Calendar,
			title: "Kalender-Management",
			desc: "Tag-, Wochen- und Monatsansicht. Drag & Drop. Arbeitszeiten, Pausen und Blocker.",
			color: "indigo",
		},
		{
			icon: Users,
			title: "Kunden-CRM",
			desc: "Automatische Kundenanlage. Tags, Notizen, Buchungshistorie. CSV-Export für Newsletter.",
			color: "purple",
		},
		{
			icon: BarChart3,
			title: "Analytics Dashboard",
			desc: "Umsatz, Auslastung, Stoßzeiten-Heatmap, No-Show Rate, beliebteste Services.",
			color: "emerald",
		},
		{
			icon: Bell,
			title: "Benachrichtigungen",
			desc: "Push-Notifications bei neuer Buchung. E-Mail-Erinnerungen. Warteliste bei Stornierung.",
			color: "amber",
		},
		{
			icon: Smartphone,
			title: "Progressive Web App",
			desc: "Installierbar wie eine App. Offline-fähig für den Dienstleister. Push Notifications.",
			color: "rose",
		},
		{
			icon: Globe,
			title: "Embeddable Widget",
			desc: "Web Component einbettbar auf jeder Website. 1 Script-Tag. Responsive. Shadow DOM.",
			color: "cyan",
		},
		{
			icon: CreditCard,
			title: "Payment Ready",
			desc: "Stripe & PayPal Integration vorbereitet. Anzahlung, Stornierungsgebühr, No-Show Fee.",
			color: "orange",
		},
		{
			icon: Shield,
			title: "DSGVO-Konform",
			desc: "Datenschutz-konform. Supabase EU-Hosting. Keine Drittanbieter-Tracker.",
			color: "green",
		},
	];

	const colorMap: Record<string, string> = {
		blue: "bg-blue-50 text-blue-600",
		indigo: "bg-indigo-50 text-indigo-600",
		purple: "bg-purple-50 text-purple-600",
		emerald: "bg-emerald-50 text-emerald-600",
		amber: "bg-amber-50 text-amber-600",
		rose: "bg-rose-50 text-rose-600",
		cyan: "bg-cyan-50 text-cyan-600",
		orange: "bg-orange-50 text-orange-600",
		green: "bg-green-50 text-green-600",
	};

	return (
		<section id="features" className="py-24 lg:py-32" ref={ref}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
						Features
					</span>
					<h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
						Alles was Sie brauchen.
						<br />
						<span className="text-gray-400">
							Nichts was Sie nicht brauchen.
						</span>
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((f, i) => (
						<motion.div
							key={f.title}
							initial={{ opacity: 0, y: 30 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.08, duration: 0.5 }}
							className="group rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
						>
							<div
								className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colorMap[f.color] ?? ""}`}
							>
								<f.icon size={20} />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								{f.title}
							</h3>
							<p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// Booking Flow Demo
// ═══════════════════════════════════════════

function BookingFlowDemo() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const navigate = useNavigate();

	const steps = [
		{
			num: 1,
			title: "Service wählen",
			desc: "Ihre Dienstleistungen als schöne Cards mit Preis, Dauer und Beschreibung.",
			visual: (
				<div className="space-y-2">
					{[
						{
							name: "Haarschnitt",
							dur: "45 Min.",
							price: "35 €",
							color: "#3b82f6",
						},
						{
							name: "Färben & Styling",
							dur: "120 Min.",
							price: "89 €",
							color: "#8b5cf6",
						},
						{
							name: "Bartpflege",
							dur: "30 Min.",
							price: "25 €",
							color: "#ec4899",
						},
					].map((s) => (
						<div
							key={s.name}
							className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 hover:border-blue-200 transition-colors cursor-pointer"
						>
							<div
								className="w-2.5 h-2.5 rounded-full"
								style={{ backgroundColor: s.color }}
							/>
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">{s.name}</p>
								<p className="text-[11px] text-gray-400">{s.dur}</p>
							</div>
							<span className="text-sm font-semibold text-gray-700">
								{s.price}
							</span>
						</div>
					))}
				</div>
			),
		},
		{
			num: 2,
			title: "Datum & Zeit",
			desc: "Kalender zeigt verfügbare Tage. Freie Zeitslots als klickbare Buttons.",
			visual: (
				<div>
					<div className="grid grid-cols-7 gap-1 mb-3">
						{["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
							<div key={d} className="text-center text-[10px] text-gray-400">
								{d}
							</div>
						))}
						{Array.from({ length: 14 }, (_, i) => i + 10).map((d) => (
							<div
								key={d}
								className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium ${
									d === 15
										? "bg-blue-600 text-white"
										: d % 3 === 0
											? "text-gray-300"
											: "text-gray-700 hover:bg-blue-50"
								}`}
							>
								{d}
							</div>
						))}
					</div>
					<div className="grid grid-cols-3 gap-1.5">
						{["09:00", "10:00", "11:30", "14:00", "15:30", "16:00"].map((t) => (
							<div
								key={t}
								className={`py-1.5 rounded-lg text-center text-xs font-medium ${
									t === "14:00"
										? "bg-blue-600 text-white"
										: "bg-gray-50 text-gray-600"
								}`}
							>
								{t}
							</div>
						))}
					</div>
				</div>
			),
		},
		{
			num: 3,
			title: "Daten eingeben",
			desc: "Nur 3 Felder: Name, E-Mail, Telefon. Keine Registrierung nötig.",
			visual: (
				<div className="space-y-2.5">
					<div>
						<span className="text-[10px] text-gray-400 mb-0.5 block">Name</span>
						<div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
							Max Mustermann
						</div>
					</div>
					<div>
						<span className="text-[10px] text-gray-400 mb-0.5 block">
							E-Mail
						</span>
						<div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
							max@email.de
						</div>
					</div>
					<div>
						<span className="text-[10px] text-gray-400 mb-0.5 block">
							Telefon
						</span>
						<div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
							+49 170 1234567
						</div>
					</div>
				</div>
			),
		},
		{
			num: 4,
			title: "Bestätigt!",
			desc: "Sofortige Bestätigung + E-Mail + Kalender-Download (.ics).",
			visual: (
				<div className="text-center py-4">
					<div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
						<Check size={28} className="text-green-500" />
					</div>
					<p className="text-sm font-semibold text-gray-900 mb-1">
						Termin bestätigt!
					</p>
					<p className="text-[11px] text-gray-400">
						Haarschnitt · 15.03. · 14:00 Uhr
					</p>
					<div className="mt-3 flex justify-center gap-2">
						<span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
							.ics Download
						</span>
						<span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
							E-Mail gesendet
						</span>
					</div>
				</div>
			),
		},
	];

	return (
		<section id="demo" className="py-24 lg:py-32 bg-gray-50" ref={ref}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
						Buchungsflow
					</span>
					<h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
						4 Schritte zum Termin
					</h2>
					<p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
						Conversion-optimiert. Mobile-first. Mit einer Hand bedienbar.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{steps.map((step, i) => (
						<motion.div
							key={step.num}
							initial={{ opacity: 0, y: 30 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.12, duration: 0.5 }}
							className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
						>
							<div className="flex items-center gap-2 mb-4">
								<span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
									{step.num}
								</span>
								<h3 className="font-semibold text-gray-900 text-sm">
									{step.title}
								</h3>
							</div>
							<div className="mb-4">{step.visual}</div>
							<p className="text-xs text-gray-500">{step.desc}</p>
						</motion.div>
					))}
				</div>

				<div className="text-center mt-12">
					<button
						type="button"
						onClick={() => navigate("/book/demo-salon")}
						className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all active:scale-[0.98] inline-flex items-center gap-2"
					>
						Live ausprobieren
						<MousePointer
							size={18}
							className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform"
						/>
					</button>
				</div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// Dashboard Preview
// ═══════════════════════════════════════════

function DashboardPreview() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const capabilities = [
		{ icon: Calendar, text: "Kalender mit Tag/Wochen/Monatsansicht" },
		{ icon: Users, text: "Kunden-CRM mit Tags und Notizen" },
		{ icon: BarChart3, text: "Umsatz-Charts und Stoßzeiten-Heatmap" },
		{ icon: Bell, text: "Push & E-Mail Benachrichtigungen" },
		{ icon: Smartphone, text: "Installierbar als App (PWA)" },
		{ icon: WifiOff, text: "Offline-fähig für Dienstleister" },
	];

	return (
		<section className="py-24 lg:py-32" ref={ref}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<motion.div
						initial={{ opacity: 0, x: -40 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						<span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
							Dashboard
						</span>
						<h2 className="mt-3 text-4xl font-extrabold text-gray-900 tracking-tight">
							Ihr Geschäft.
							<br />
							Auf einen Blick.
						</h2>
						<p className="mt-4 text-lg text-gray-500">
							Alles was Sie brauchen um Ihre Termine, Kunden und Umsätze zu
							verwalten — in einem elegant designten Dashboard.
						</p>

						<div className="mt-8 space-y-4">
							{capabilities.map((c) => (
								<div key={c.text} className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
										<c.icon size={16} className="text-blue-600" />
									</div>
									<span className="text-sm text-gray-700">{c.text}</span>
								</div>
							))}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 40 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="relative"
					>
						{/* Phone mockup */}
						<div className="relative mx-auto w-[280px] h-[560px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
							<div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-10" />
							<div className="w-full h-full bg-white rounded-[2.25rem] overflow-hidden">
								{/* Mobile dashboard content */}
								<div className="p-4 pt-8">
									<div className="flex items-center justify-between mb-4">
										<div>
											<p className="text-xs font-bold text-gray-900">
												BookKing
											</p>
											<p className="text-[10px] text-gray-400">Demo Salon</p>
										</div>
										<div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
											M
										</div>
									</div>

									<div className="grid grid-cols-2 gap-2 mb-4">
										<div className="bg-blue-50 rounded-xl p-3">
											<p className="text-lg font-bold text-blue-700">8</p>
											<p className="text-[10px] text-blue-500">Heute</p>
										</div>
										<div className="bg-green-50 rounded-xl p-3">
											<p className="text-lg font-bold text-green-700">87%</p>
											<p className="text-[10px] text-green-500">Auslastung</p>
										</div>
									</div>

									<p className="text-[10px] font-semibold text-gray-500 mb-2">
										NÄCHSTER TERMIN
									</p>
									<div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-3 text-white mb-4">
										<p className="text-sm font-bold">Haarschnitt</p>
										<p className="text-[11px] opacity-80">
											09:00 — Anna Müller
										</p>
										<p className="text-[10px] opacity-60 mt-1">in 15 Minuten</p>
									</div>

									<p className="text-[10px] font-semibold text-gray-500 mb-2">
										WEITERE TERMINE
									</p>
									{[
										{ t: "10:30", n: "Färben", c: "Lisa K." },
										{ t: "12:00", n: "Styling", c: "Tom S." },
										{ t: "14:00", n: "Bartpflege", c: "Jan R." },
									].map((item) => (
										<div
											key={item.t}
											className="flex items-center gap-2 py-1.5 border-b border-gray-50"
										>
											<span className="text-[10px] text-gray-400 w-8">
												{item.t}
											</span>
											<span className="text-[11px] font-medium text-gray-800 flex-1">
												{item.n}
											</span>
											<span className="text-[10px] text-gray-400">
												{item.c}
											</span>
										</div>
									))}
								</div>

								{/* Bottom nav */}
								<div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 px-1 rounded-b-[2.25rem]">
									{[Layout, Calendar, Users, BarChart3].map((Icon, i) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: static icon list, never reorders
											key={i}
											className={`p-1.5 ${i === 0 ? "text-blue-600" : "text-gray-300"}`}
										>
											<Icon size={16} />
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Floating badges */}
						<div className="absolute -left-4 top-20 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
								<Bell size={14} className="text-green-600" />
							</div>
							<div>
								<p className="text-[11px] font-semibold text-gray-900">
									Neue Buchung!
								</p>
								<p className="text-[10px] text-gray-400">
									Anna M. · Haarschnitt
								</p>
							</div>
						</div>

						<div className="absolute -right-4 bottom-32 bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
								<Wifi size={14} className="text-blue-600" />
							</div>
							<div>
								<p className="text-[11px] font-semibold text-gray-900">
									PWA installiert
								</p>
								<p className="text-[10px] text-gray-400">Offline verfügbar</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// Stats Section
// ═══════════════════════════════════════════

function StatsSection() {
	const stats = [
		{ value: "< 50kb", label: "Widget-Größe" },
		{ value: "4", label: "Buchungs-Schritte" },
		{ value: "99.9%", label: "Uptime" },
		{ value: "< 1s", label: "Ladezeit" },
	];

	return (
		<section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
					{stats.map((s) => (
						<div key={s.label}>
							<p className="text-4xl lg:text-5xl font-extrabold text-white">
								{s.value}
							</p>
							<p className="mt-2 text-sm text-blue-100">{s.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// Pricing Section
// ═══════════════════════════════════════════

function PricingSection() {
	const navigate = useNavigate();

	const plans = [
		{
			name: "Free",
			price: "0",
			desc: "10 Buchungen kostenlos",
			features: [
				"10 Buchungen gratis",
				"1 Mitarbeiter",
				"Buchungsseite",
				"E-Mail Benachrichtigungen",
			],
			cta: "Kostenlos testen",
			featured: false,
		},
		{
			name: "Professional",
			price: "19",
			desc: "Für wachsende Geschäfte",
			features: [
				"Unbegrenzte Buchungen",
				"Bis 5 Mitarbeiter",
				"Embeddable Widget",
				"Push Notifications",
				"Kunden-CRM",
				"Analytics Dashboard",
				"Payment Integration",
				"Prioritäts-Support",
			],
			cta: "Jetzt starten",
			featured: true,
		},
		{
			name: "Business",
			price: "49",
			desc: "Für Teams & Studios",
			features: [
				"Alles aus Professional",
				"Bis 20 Mitarbeiter",
				"Multi-Standort",
				"API-Zugang",
				"White-Label Option",
				"Custom Domain",
				"Persönlicher Ansprechpartner",
			],
			cta: "Kontakt aufnehmen",
			featured: false,
		},
	];

	return (
		<section id="pricing" className="py-24 lg:py-32 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
						Preise
					</span>
					<h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
						Einfache, faire Preise
					</h2>
					<p className="mt-4 text-lg text-gray-500">
						Starten Sie kostenlos. Upgraden Sie wenn Sie wachsen.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`rounded-2xl p-6 lg:p-8 ${
								plan.featured
									? "bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 scale-[1.02] lg:scale-105 relative"
									: "bg-white border border-gray-200"
							}`}
						>
							{plan.featured && (
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
									Beliebteste Wahl
								</span>
							)}

							<h3
								className={`text-lg font-semibold ${plan.featured ? "text-white" : "text-gray-900"}`}
							>
								{plan.name}
							</h3>
							<p
								className={`text-sm mt-1 ${plan.featured ? "text-blue-100" : "text-gray-500"}`}
							>
								{plan.desc}
							</p>

							<div className="mt-6 flex items-baseline gap-1">
								<span
									className={`text-5xl font-extrabold ${plan.featured ? "text-white" : "text-gray-900"}`}
								>
									{plan.price}
								</span>
								<span
									className={`text-sm ${plan.featured ? "text-blue-200" : "text-gray-400"}`}
								>
									€/Monat
								</span>
							</div>

							<ul className="mt-8 space-y-3">
								{plan.features.map((f) => (
									<li key={f} className="flex items-start gap-2">
										<Check
											size={16}
											className={`shrink-0 mt-0.5 ${plan.featured ? "text-blue-200" : "text-blue-600"}`}
										/>
										<span
											className={`text-sm ${plan.featured ? "text-blue-50" : "text-gray-600"}`}
										>
											{f}
										</span>
									</li>
								))}
							</ul>

							<button
								type="button"
								onClick={() => navigate("/dashboard")}
								className={`mt-8 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
									plan.featured
										? "bg-white text-blue-600 hover:bg-blue-50"
										: "bg-gray-900 text-white hover:bg-gray-800"
								}`}
							>
								{plan.cta}
							</button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// Testimonials
// ═══════════════════════════════════════════

function TestimonialSection() {
	const testimonials = [
		{
			name: "Sarah Klein",
			role: "Friseurin, Salon Sarah",
			text: "Seit wir BookKing nutzen, haben sich unsere No-Shows um 60% reduziert. Die automatischen Erinnerungen sind Gold wert!",
			rating: 5,
		},
		{
			name: "Dr. Thomas Weber",
			role: "Physiotherapie-Praxis",
			text: "Endlich ein Buchungssystem das nicht aussieht wie aus den 90ern. Meine Patienten lieben die einfache Online-Buchung.",
			rating: 5,
		},
		{
			name: "Julia Hoffmann",
			role: "Personal Coach",
			text: "Das Beste: Ich kann es auf meiner Website einbetten und es passt sich perfekt an mein Design an. Genial!",
			rating: 5,
		},
	];

	return (
		<section className="py-24 lg:py-32">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
						Was unsere Kunden sagen
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((t) => (
						<div
							key={t.name}
							className="rounded-2xl border border-gray-100 p-6"
						>
							<div className="flex gap-0.5 mb-4">
								{Array.from({ length: t.rating }).map((_, i) => (
									<Star
										// biome-ignore lint/suspicious/noArrayIndexKey: fixed-count identical star icons, never reorder
										key={i}
										size={16}
										className="fill-amber-400 text-amber-400"
									/>
								))}
							</div>
							<p className="text-gray-600 text-sm leading-relaxed mb-6">
								"{t.text}"
							</p>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
									{t.name.charAt(0)}
								</div>
								<div>
									<p className="text-sm font-semibold text-gray-900">
										{t.name}
									</p>
									<p className="text-xs text-gray-500">{t.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// CTA Section
// ═══════════════════════════════════════════

function CTASection() {
	const navigate = useNavigate();

	return (
		<section className="py-24">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 lg:p-16 shadow-xl shadow-blue-500/15">
					<h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
						Bereit, Ihre Terminbuchung
						<br />
						zu revolutionieren?
					</h2>
					<p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
						Starten Sie in unter 5 Minuten. Keine Kreditkarte nötig. Sofort
						einsatzbereit.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
						<button
							type="button"
							onClick={() => navigate("/dashboard")}
							className="group bg-white text-blue-600 px-8 py-4 rounded-2xl text-base font-semibold hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
						>
							Kostenlos starten
							<ArrowRight
								size={18}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</button>
						<button
							type="button"
							onClick={() => navigate("/book/demo-salon")}
							className="text-white/90 hover:text-white px-6 py-4 text-sm font-medium flex items-center gap-2 transition-colors"
						>
							<Play size={16} />
							Live Demo ansehen
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════
// Footer
// ═══════════════════════════════════════════

function Footer() {
	const navigate = useNavigate();

	return (
		<footer className="border-t border-gray-100 bg-gray-50 py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					{/* Brand */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
								<Calendar size={14} className="text-white" />
							</div>
							<span className="font-bold text-gray-900">
								Book<span className="text-blue-600">King</span>
							</span>
						</div>
						<p className="text-sm text-gray-500 leading-relaxed">
							Das intelligente Buchungssystem für Dienstleister. Einfach,
							schnell und als App installierbar.
						</p>
					</div>

					{/* Navigation */}
					<div>
						<h4 className="font-semibold text-gray-900 text-sm mb-3">
							Navigation
						</h4>
						<div className="space-y-2 text-sm">
							<a
								href="#features"
								className="block text-gray-500 hover:text-gray-700 transition-colors"
							>
								Features
							</a>
							<a
								href="#pricing"
								className="block text-gray-500 hover:text-gray-700 transition-colors"
							>
								Preise
							</a>
							<a
								href="#demo"
								className="block text-gray-500 hover:text-gray-700 transition-colors"
							>
								Demo
							</a>
						</div>
					</div>

					{/* Info */}
					<div>
						<h4 className="font-semibold text-gray-900 text-sm mb-3">
							Informationen
						</h4>
						<div className="space-y-2 text-sm">
							<button
								type="button"
								onClick={() => navigate("/info/how-it-works")}
								className="block text-gray-500 hover:text-gray-700 transition-colors"
							>
								So funktioniert's
							</button>
							<button
								type="button"
								onClick={() => navigate("/info/help")}
								className="block text-gray-500 hover:text-gray-700 transition-colors"
							>
								Hilfe & FAQ
							</button>
							<button
								type="button"
								onClick={() => navigate("/info/privacy")}
								className="block text-gray-500 hover:text-gray-700 transition-colors"
							>
								Datenschutz
							</button>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-sm text-gray-400">
						&copy; {new Date().getFullYear()} BookKing. Made with{" "}
						<Heart size={12} className="inline text-red-400 fill-red-400" /> in
						Deutschland.
					</p>
					<div className="flex items-center gap-4 text-xs text-gray-400">
						<button
							type="button"
							onClick={() => navigate("/info/privacy")}
							className="hover:text-gray-600 transition-colors"
						>
							Datenschutz
						</button>
						<span>&middot;</span>
						<button
							type="button"
							onClick={() => navigate("/info/help")}
							className="hover:text-gray-600 transition-colors"
						>
							Hilfe
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
