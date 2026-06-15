import { useActiveServicesByCategory } from "@/hooks/useServices";
import { formatDuration, formatPrice } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";
import type { Service } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";

export function ServiceSelector() {
	const { selectService, nextStep } = useBookingStore();
	const { grouped } = useActiveServicesByCategory();

	const handleSelect = (service: Service) => {
		selectService(service);
		nextStep(); // → staff
	};

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 mb-2">Service wählen</h2>
			<p className="text-gray-500 mb-6">
				Welche Dienstleistung möchten Sie buchen?
			</p>

			{Array.from(grouped.entries()).map(([category, services]) => (
				<div key={category} className="mb-6">
					{grouped.size > 1 && (
						<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
							{category}
						</h3>
					)}

					<div className="space-y-3">
						{services.map((service, i) => (
							<motion.button
								key={service.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.05 }}
								onClick={() => handleSelect(service)}
								className="card w-full p-4 text-left hover:border-primary-200 hover:shadow-md transition-all group"
							>
								<div className="flex items-center justify-between">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<div
												className="w-3 h-3 rounded-full shrink-0"
												style={{ backgroundColor: service.color }}
											/>
											<h4 className="font-semibold text-gray-900 truncate">
												{service.name}
											</h4>
										</div>

										{service.description && (
											<p className="text-sm text-gray-500 mb-2 line-clamp-2">
												{service.description}
											</p>
										)}

										<div className="flex items-center gap-4 text-sm">
											<span className="flex items-center gap-1 text-gray-500">
												<Clock size={14} />
												{formatDuration(service.duration)}
											</span>
											<span className="font-semibold text-gray-900">
												{formatPrice(service.price, service.priceType)}
											</span>
										</div>

										{service.capacity > 1 && (
											<span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
												Gruppenangebot · max. {service.capacity} Plätze
											</span>
										)}
									</div>

									<ChevronRight
										size={20}
										className="text-gray-300 group-hover:text-primary-500 transition-colors shrink-0 ml-3"
									/>
								</div>

								{service.addons.length > 0 && (
									<div className="mt-3 pt-3 border-t border-gray-50">
										<p className="text-xs text-gray-400">
											+ {service.addons.length} Zusatzoptionen verfügbar
										</p>
									</div>
								)}
							</motion.button>
						))}
					</div>
				</div>
			))}

			{grouped.size === 0 && (
				<div className="text-center py-12 text-gray-400">
					<p>Keine Services verfügbar.</p>
				</div>
			)}
		</div>
	);
}
