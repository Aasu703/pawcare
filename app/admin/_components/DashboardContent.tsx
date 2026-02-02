import StatCards from "@/components/admin/StatCards";
import WeeklyAppointmentsChart from "@/components/admin/WeeklyAppointmentsChart";
import RevenueTrendChart from "@/components/admin/RevenueTrendChart";
import RecentAppointmentsTable from "@/components/admin/RecentAppointmentsTable";

export default function DashboardContent() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Cards */}
            <StatCards />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <WeeklyAppointmentsChart />
                <RevenueTrendChart />
            </div>

            {/* Recent Appointments Table */}
            <div className="mt-6">
                <RecentAppointmentsTable />
            </div>
        </div>
    );
}
