import { useAvailability } from "@/hooks/useAvailability";
import { useSettingsStore } from "@/store/settings-store";
import type { Availability, DayOfWeek, TimeRange } from "@/types";
import { Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const DAY_LABELS: Record<DayOfWeek, string> = {
	0: "Sonntag",
	1: "Montag",
	2: "Dienstag",
	3: "Mittwoch",
	4: "Donnerstag",
	5: "Freitag",
	6: "Samstag",
};

const ORDERED_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

export function AvailabilityEditor() {
	const { availability, upsertAvailability, deleteAvailability } =
		useAvailability();
	const provider = useSettingsStore((s) => s.provider);

	const getAvailForDay = (day: DayOfWeek) =>
		availability.find((a) => a.dayOfWeek === day && a.isActive);

	const handleToggleDay = (day: DayOfWeek) => {
		const existing = getAvailForDay(day);
		if (existing) {
			deleteAvailability.mutate(existing.id);
		} else {
			upsertAvailability.mutate({
				providerId: provider?.id ?? "",
				dayOfWeek: day,
				startTime: "09:00",
				endTime: "18:00",
				breaks: [{ start: "12:00", end: "13:00" }],
				isActive: true,
			});
		}
	};

	const handleUpdateTime = (
		avail: Availability,
		field: "startTime" | "endTime",
		value: string,
	) => {
		upsertAvailability.mutate({ ...avail, [field]: value });
	};

	const handleAddBreak = (avail: Availability) => {
		upsertAvailability.mutate({
			...avail,
			breaks: [...avail.breaks, { start: "12:00", end: "13:00" }],
		});
	};

	const handleRemoveBreak = (avail: Availability, idx: number) => {
		upsertAvailability.mutate({
			...avail,
			breaks: avail.breaks.filter((_, i) => i !== idx),
		});
	};

	const handleUpdateBreak = (
		avail: Availability,
		idx: number,
		field: "start" | "end",
		value: string,
	) => {
		const current = avail.breaks[idx];
		if (!current) return;
		const breaks = [...avail.breaks];
		breaks[idx] = { ...current, [field]: value };
		upsertAvailability.mutate({ ...avail, breaks });
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 mb-4">
				<Clock size={20} className="text-gray-400" />
				<h3 className="text-lg font-semibold text-gray-900">Arbeitszeiten</h3>
			</div>

			{ORDERED_DAYS.map((day) => {
				const avail = getAvailForDay(day);
				const isActive = !!avail;

				return (
					<div key={day} className="card p-4">
						<div className="flex items-center justify-between mb-2">
							<label className="flex items-center gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={isActive}
									onChange={() => handleToggleDay(day)}
									className="w-4 h-4 rounded border-gray-300 text-primary-600"
								/>
								<span
									className={`font-medium ${isActive ? "text-gray-900" : "text-gray-400"}`}
								>
									{DAY_LABELS[day]}
								</span>
							</label>

							{avail && (
								<div className="flex items-center gap-2">
									<input
										type="time"
										value={avail.startTime}
										onChange={(e) =>
											handleUpdateTime(avail, "startTime", e.target.value)
										}
										className="input-field py-1 px-2 w-auto text-sm"
									/>
									<span className="text-gray-400">–</span>
									<input
										type="time"
										value={avail.endTime}
										onChange={(e) =>
											handleUpdateTime(avail, "endTime", e.target.value)
										}
										className="input-field py-1 px-2 w-auto text-sm"
									/>
								</div>
							)}
						</div>

						{/* Breaks */}
						{avail && (
							<div className="ml-7 mt-2 space-y-2">
								{avail.breaks.map((brk, idx) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: breaks have no stable id and may be identical
									<div key={idx} className="flex items-center gap-2 text-sm">
										<span className="text-gray-400 text-xs w-12">Pause:</span>
										<input
											type="time"
											value={brk.start}
											onChange={(e) =>
												handleUpdateBreak(avail, idx, "start", e.target.value)
											}
											className="input-field py-1 px-2 w-auto text-sm"
										/>
										<span className="text-gray-400">–</span>
										<input
											type="time"
											value={brk.end}
											onChange={(e) =>
												handleUpdateBreak(avail, idx, "end", e.target.value)
											}
											className="input-field py-1 px-2 w-auto text-sm"
										/>
										<button
											type="button"
											onClick={() => handleRemoveBreak(avail, idx)}
											className="p-1 text-gray-400 hover:text-red-500"
										>
											<Trash2 size={14} />
										</button>
									</div>
								))}
								<button
									type="button"
									onClick={() => handleAddBreak(avail)}
									className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
								>
									<Plus size={12} />
									Pause hinzufügen
								</button>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
