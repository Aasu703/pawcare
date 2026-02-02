"use client";

export default function RevenueTrendChart() {
    const data = [
        { month: "Jan", value: 32000 },
        { month: "Feb", value: 38000 },
        { month: "Mar", value: 36000 },
        { month: "Apr", value: 42000 },
        { month: "May", value: 48000 },
        { month: "Jun", value: 52000 },
    ];

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));

    // Calculate points for SVG path
    const getY = (value: number) => {
        const range = maxValue - minValue;
        return 150 - ((value - minValue) / range) * 130;
    };

    const points = data.map((d, i) => ({
        x: 50 + i * ((400 - 100) / (data.length - 1)),
        y: getY(d.value),
    }));

    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
            <div className="relative h-48">
                <svg viewBox="0 0 450 180" className="w-full h-full">
                    {/* Y-axis labels */}
                    <text x="10" y="20" className="text-xs fill-gray-400">60000</text>
                    <text x="10" y="55" className="text-xs fill-gray-400">45000</text>
                    <text x="10" y="90" className="text-xs fill-gray-400">30000</text>
                    <text x="10" y="125" className="text-xs fill-gray-400">15000</text>
                    <text x="10" y="160" className="text-xs fill-gray-400">0</text>

                    {/* Grid lines */}
                    {[20, 55, 90, 125, 160].map((y) => (
                        <line key={y} x1="45" y1={y} x2="430" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                    ))}

                    {/* Line path */}
                    <path d={pathD} fill="none" stroke="#eab308" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Data points */}
                    {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#eab308" />
                    ))}

                    {/* X-axis labels */}
                    {data.map((d, i) => (
                        <text key={d.month} x={points[i].x} y="175" textAnchor="middle" className="text-xs fill-gray-500">
                            {d.month}
                        </text>
                    ))}
                </svg>
            </div>
        </div>
    );
}
