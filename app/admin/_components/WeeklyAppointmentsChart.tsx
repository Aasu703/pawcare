"use client";

interface AppointmentData {
  day: string;
  count: number;
}

interface WeeklyAppointmentsChartProps {
  data?: AppointmentData[];
}

const defaultData: AppointmentData[] = [
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
}: WeeklyAppointmentsChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count));
  const yAxisSteps = [0, 8, 16, 24, 32];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">Weekly Appointments</h3>
      <div className="flex h-64">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-4 text-sm text-muted-foreground">
          {yAxisSteps.reverse().map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex flex-1 items-end justify-around gap-2">
          {data.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-2">
              <div
                className="w-12 rounded-t-md bg-orange-500 transition-all hover:bg-orange-600"
                style={{
                  height: `${(item.count / maxCount) * 200}px`,
                }}
              />
              <span className="text-sm text-muted-foreground">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
