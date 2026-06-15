import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
	const isOnline = useOnlineStatus();

	return (
		<AnimatePresence>
			{!isOnline && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					className="bg-amber-500 text-white overflow-hidden"
				>
					<div className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
						<WifiOff size={16} />
						Offline — Änderungen werden synchronisiert, sobald Sie wieder online
						sind.
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
