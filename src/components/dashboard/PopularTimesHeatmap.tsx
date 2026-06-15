import type { DayOfWeek } from "@/types";

interface PopularTimesHeatmapProps {
	data: { hour: number; day: DayOfWeek; count: number }[];
}

const DAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

export function PopularTimesHeatmap({ data }: PopularTimesHeatmapProps) {
	const maxCount = Math.max(...data.map((d) => d.count), 1);

	const getIntensity = (day: DayOfWeek, hour: number): number => {
		const entry = data.find((d) => d.day === day && d.hour === hour);
		return entry ? entry.count / maxCount : 0;
	};

	const getColor = (intensity: number): string => {
		if (intensity === 0) return "#f8fafc";
		if (intensity < 0.25) return "#dbeafe";
		if (intensity < 0.5) return "#93c5fd";
		if (intensity < 0.75) return "#3b82f6";
		return "#1d4ed8";
	};

	return (
		<div className="card p-5">
			<h3 className="text-sm font-semibold text-gray-700 mb-4">
				Beliebteste Zeiten
			</h3>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr>
							<th className="text-xs text-gray-400 font-normal pb-2 text-left w-8" />
							{HOURS.map((h) => (
								<th
									key={h}
									className="text-[10px] text-gray-400 font-normal pb-2 text-center"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{[1, 2, 3, 4, 5, 6, 0].map((day) => (
							<tr key={day}>
								<td className="text-xs text-gray-500 pr-2 py-0.5">
									{DAY_LABELS[day]}
								</td>
								{HOURS.map((hour) => {
									const intensity = getIntensity(day as DayOfWeek, hour);
									return (
										<td key={`${day}-${hour}`} className="p-0.5">
											<div
												className="w-full aspect-square rounded-sm min-w-[20px]"
												style={{ backgroundColor: getColor(intensity) }}
												title={`${DAY_LABELS[day]} ${hour}:00 — ${Math.round(intensity * maxCount)} Buchungen`}
											/>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-end gap-1 mt-3">
				<span className="text-[10px] text-gray-400">Wenig</span>
				{[0, 0.25, 0.5, 0.75, 1].map((v) => (
					<div
						key={v}
						className="w-3 h-3 rounded-sm"
						style={{ backgroundColor: getColor(v) }}
					/>
				))}
				<span className="text-[10px] text-gray-400">Viel</span>
			</div>
		</div>
	);
}
