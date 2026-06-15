import { format, parseISO } from "date-fns";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface RevenueChartProps {
	data: { date: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
	const chartData = data.map((d) => ({
		...d,
		label: format(parseISO(d.date), "dd.MM."),
	}));

	return (
		<div className="card p-5">
			<h3 className="text-sm font-semibold text-gray-700 mb-4">
				Umsatz (letzte 30 Tage)
			</h3>

			<div className="h-[200px]">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={chartData}>
						<defs>
							<linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
								<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 11, fill: "#94a3b8" }}
							tickLine={false}
							axisLine={false}
							interval="preserveStartEnd"
						/>
						<YAxis
							tick={{ fontSize: 11, fill: "#94a3b8" }}
							tickLine={false}
							axisLine={false}
							tickFormatter={(v: number) => `${v} €`}
							width={60}
						/>
						<Tooltip
							contentStyle={{
								borderRadius: "12px",
								border: "1px solid #e2e8f0",
								boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
							}}
							formatter={(value: number) => [`${value.toFixed(2)} €`, "Umsatz"]}
						/>
						<Area
							type="monotone"
							dataKey="revenue"
							stroke="#3b82f6"
							strokeWidth={2}
							fill="url(#revenueGradient)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
