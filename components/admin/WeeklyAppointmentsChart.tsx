"use client";

export default function WeeklyAppointmentsChart() {
    const data = [
        { day: "Mon", value: 18 },
        { day: "Tue", value: 22 },
        { day: "Wed", value: 15 },
        { day: "Thu", value: 26 },
        { day: "Fri", value: 30 },
        { day: "Sat", value: 20 },
        { day: "Sun", value: 14 },
    ];

    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Appointments</h3>
            <div className="flex items-end justify-between gap-4 h-48">
                {data.map((item) => (
                    <div key={item.day} className="flex flex-col items-center flex-1">
                        <div className="w-full flex flex-col items-center justify-end h-40">
                            <span className="text-sm text-gray-600 mb-2">{item.value}</span>
                            <div
                                className="w-full max-w-12 bg-orange-500 rounded-t-md transition-all"
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-500 mt-2">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
