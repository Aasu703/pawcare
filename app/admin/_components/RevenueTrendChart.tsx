"use client";

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueTrendChartProps {
  data?: RevenueData[];
}

const defaultData: RevenueData[] = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 35000 },
  { month: "Mar", revenue: 38000 },
  { month: "Apr", revenue: 42000 },
  { month: "May", revenue: 45000 },
  { month: "Jun", revenue: 48532 },
];

export default function RevenueTrendChart({
  data = defaultData,
}: RevenueTrendChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const yAxisSteps = [0, 15000, 30000, 45000, 60000];

  // Calculate points for the line
  const chartWidth = 100;
  const chartHeight = 200;
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - (item.revenue / maxRevenue) * chartHeight;
    return { x, y, ...item };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">Revenue Trend</h3>
      <div className="flex h-64">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-4 text-sm text-muted-foreground">
          {[...yAxisSteps].reverse().map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>

        {/* Chart */}
        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-52 w-full"
            preserveAspectRatio="none"
          >
            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {/* Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#eab308"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* X-axis labels */}
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            {data.map((item) => (
              <span key={item.month}>{item.month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
