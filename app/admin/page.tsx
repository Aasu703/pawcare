import { PawPrint, Users, Calendar, DollarSign } from "lucide-react";
import {
  DashboardHeader,
  StatsCard,
  WeeklyAppointmentsChart,
  RevenueTrendChart,
  RecentAppointments,
} from "./_components";

export default function AdminDashboardPage() {
  return (
    <div>
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening today."
      />

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pets"
          value="1,284"
          change={12.5}
          icon={PawPrint}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Active Owners"
          value="892"
          change={8.2}
          icon={Users}
          iconColor="text-teal-500"
        />
        <StatsCard
          title="Appointments Today"
          value="24"
          change={-2.4}
          icon={Calendar}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$48,532"
          change={18.7}
          icon={DollarSign}
          iconColor="text-yellow-500"
        />
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <WeeklyAppointmentsChart />
        <RevenueTrendChart />
      </div>

      {/* Recent Appointments Table */}
      <RecentAppointments />
    </div>
  );
}
