import { PawPrint, Users, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
    iconBgColor: string;
}

function StatCard({ title, value, change, isPositive, icon, iconBgColor }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-500"}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {change}
                </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
}

export default function StatCards() {
    const stats = [
        {
            title: "Total Pets",
            value: "1,284",
            change: "+12.5%",
            isPositive: true,
            icon: <PawPrint className="w-6 h-6 text-orange-600" />,
            iconBgColor: "bg-orange-100",
        },
        {
            title: "Active Owners",
            value: "892",
            change: "+8.2%",
            isPositive: true,
            icon: <Users className="w-6 h-6 text-orange-600" />,
            iconBgColor: "bg-orange-100",
        },
        {
            title: "Appointments Today",
            value: "24",
            change: "-2.4%",
            isPositive: false,
            icon: <Calendar className="w-6 h-6 text-gray-600" />,
            iconBgColor: "bg-gray-100",
        },
        {
            title: "Monthly Revenue",
            value: "$48,532",
            change: "+18.7%",
            isPositive: true,
            icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
            iconBgColor: "bg-yellow-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
            ))}
        </div>
    );
}
