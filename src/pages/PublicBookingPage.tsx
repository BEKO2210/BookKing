import { BookingFlow } from "@/components/booking/BookingFlow";
import { useBookingStore } from "@/store/booking-store";
import { DEMO_PROVIDER, useSettingsStore } from "@/store/settings-store";
import { HelpCircle, Shield } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function PublicBookingPage() {
	const { slug } = useParams<{ slug: string }>();
	const { setProvider, provider } = useSettingsStore();
	const { reset } = useBookingStore();
	const navigate = useNavigate();

	// In production, fetch provider by slug from Supabase
	// biome-ignore lint/correctness/useExhaustiveDependencies: effect intentionally runs only on slug change; adding provider/setProvider/reset would re-run cleanup on every provider change
	useEffect(() => {
		if (!provider) {
			setProvider(DEMO_PROVIDER);
		}
		return () => {
			reset();
		};
	}, [slug]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
			{/* Provider header */}
			<header className="bg-white border-b border-gray-100">
				<div className="max-w-lg mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
							{provider?.businessName?.charAt(0) ?? "B"}
						</div>
						<div>
							<h1 className="font-semibold text-gray-900">
								{provider?.businessName ?? "Buchung"}
							</h1>
							<p className="text-xs text-gray-500">Online Terminbuchung</p>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => navigate("/info/how-it-works")}
							className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
							aria-label="So funktioniert's"
							title="So funktioniert's"
						>
							<HelpCircle size={18} />
						</button>
						<button
							type="button"
							onClick={() => navigate("/info/privacy")}
							className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
							aria-label="Datenschutz"
							title="Datenschutz"
						>
							<Shield size={18} />
						</button>
					</div>
				</div>
			</header>

			<BookingFlow />

			{/* Footer info links */}
			<footer className="max-w-lg mx-auto px-4 py-6 text-center border-t border-gray-100">
				<div className="flex items-center justify-center gap-4 text-xs text-gray-400">
					<button
						type="button"
						onClick={() => navigate("/info/how-it-works")}
						className="hover:text-primary-600 transition-colors"
					>
						So funktioniert's
					</button>
					<span>&middot;</span>
					<button
						type="button"
						onClick={() => navigate("/info/privacy")}
						className="hover:text-primary-600 transition-colors"
					>
						Datenschutz
					</button>
					<span>&middot;</span>
					<button
						type="button"
						onClick={() => navigate("/info/help")}
						className="hover:text-primary-600 transition-colors"
					>
						Hilfe
					</button>
				</div>
				<p className="text-[10px] text-gray-300 mt-2">Powered by BookKing</p>
			</footer>
		</div>
	);
}
