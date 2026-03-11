interface OccupancyRateProps {
  rate: number;
}

export function OccupancyRate({ rate }: OccupancyRateProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (rate / 100) * circumference;

  const getColor = () => {
    if (rate >= 80) return '#22c55e';
    if (rate >= 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="card p-5 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Auslastung</h3>

      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{rate}%</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2">diesen Monat</p>
    </div>
  );
}
