"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AppointmentData {
  day: string;
  count: number;
}

interface WeeklyAppointmentsChartProps {
  data?: any[];
  isLoading?: boolean;
}

const defaultData: any[] = [
  { day: "Mon", count: 18 },
  { day: "Tue", count: 24 },
  { day: "Wed", count: 15 },
  { day: "Thu", count: 27 },
  { day: "Fri", count: 30 },
  { day: "Sat", count: 22 },
  { day: "Sun", count: 12 },
];

export default function WeeklyAppointmentsChart({
  data = defaultData,
  isLoading = false,
}: any) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-muted mb-6" />
        <div className="h-64 w-full animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">Weekly Appointments</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: any, right: any, left: any, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              className="text-sm text-muted-foreground"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-sm text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

