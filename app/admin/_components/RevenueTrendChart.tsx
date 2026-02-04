"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueTrendChartProps {
  data?: RevenueData[];
  isLoading?: boolean;
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
  isLoading = false,
}: RevenueTrendChartProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="h-6 w-32 animate-pulse rounded bg-muted mb-6" />
        <div className="h-64 w-full animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">Revenue Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              className="text-sm text-muted-foreground"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-sm text-muted-foreground"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number | undefined) => value ? [`$${value.toLocaleString()}`, "Revenue"] : ["$0", "Revenue"]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#eab308"
              strokeWidth={3}
              dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#eab308", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
