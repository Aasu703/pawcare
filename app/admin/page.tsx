"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PawPrint, Users, Calendar, DollarSign, RefreshCw } from "lucide-react";
import {
  DashboardHeader,
  StatsCard,
  WeeklyAppointmentsChart,
  RevenueTrendChart,
  RecentAppointments,
} from "./_components";
import { getDashboardStats } from "@/lib/api/admin/stats";
import { toast } from "react-toastify";

interface DashboardStats {
  totalPets: number;
  activeOwners: number;
  appointmentsToday: number;
  monthlyRevenue: number;
  weeklyAppointments: Array<{ day: string; count: number }>;
  revenueTrend: Array<{ month: string; revenue: number }>;
  recentAppointments: Array<{
    id: string;
    petName: string;
    ownerName: string;
    service: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
  }>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      toast.error("Failed to load dashboard data");
      // Set mock data as fallback
      setStats({
        totalPets: 0,
        activeOwners: 0,
        appointmentsToday: 0,
        monthlyRevenue: 0,
        weeklyAppointments: [
          { day: "Mon", count: 18 },
          { day: "Tue", count: 24 },
          { day: "Wed", count: 15 },
          { day: "Thu", count: 27 },
          { day: "Fri", count: 30 },
          { day: "Sat", count: 22 },
          { day: "Sun", count: 12 },
        ],
        revenueTrend: [
          { month: "Jan", revenue: 42000 },
          { month: "Feb", revenue: 45000 },
          { month: "Mar", revenue: 48000 },
          { month: "Apr", revenue: 52000 },
          { month: "May", revenue: 48532 },
        ],
        recentAppointments: [
          {
            id: "1",
            petName: "Max",
            ownerName: "John Smith",
            service: "Grooming",
            time: "9:00 AM",
            status: "scheduled",
          },
          {
            id: "2",
            petName: "Bella",
            ownerName: "Sarah Johnson",
            service: "Checkup",
            time: "10:30 AM",
            status: "completed",
          },
          {
            id: "3",
            petName: "Charlie",
            ownerName: "Mike Davis",
            service: "Vaccination",
            time: "11:00 AM",
            status: "scheduled",
          },
          {
            id: "4",
            petName: "Luna",
            ownerName: "Emily Brown",
            service: "Dental Cleaning",
            time: "2:00 PM",
            status: "scheduled",
          },
          {
            id: "5",
            petName: "Cooper",
            ownerName: "David Wilson",
            service: "Surgery",
            time: "3:30 PM",
            status: "cancelled",
          },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats(true);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <DashboardHeader
          title="Dashboard Overview"
          subtitle="Welcome back! Here's what's happening today."
        />
        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </motion.button>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StatsCard
          title="Total Pets"
          value={(stats?.totalPets ?? 0).toLocaleString()}
          change={12.5}
          icon={PawPrint}
          iconColor="text-primary"
          isLoading={loading}
          onClick={() => router.push("/admin/pets")}
        />
        <StatsCard
          title="Active Owners"
          value={(stats?.activeOwners ?? 0).toLocaleString()}
          change={8.2}
          icon={Users}
          iconColor="text-primary"
          isLoading={loading}
          onClick={() => router.push("/admin/users")}
        />
        <StatsCard
          title="Appointments Today"
          value={(stats?.appointmentsToday ?? 0).toString()}
          change={-2.4}
          icon={Calendar}
          iconColor="text-blue-500"
          isLoading={loading}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${(stats?.monthlyRevenue ?? 0).toLocaleString()}`}
          change={18.7}
          icon={DollarSign}
          iconColor="text-primary"
          isLoading={loading}
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        className="mb-8 grid gap-6 lg:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <WeeklyAppointmentsChart
          data={stats?.weeklyAppointments}
          isLoading={loading}
        />
        <RevenueTrendChart
          data={stats?.revenueTrend}
          isLoading={loading}
        />
      </motion.div>

      {/* Recent Appointments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <RecentAppointments
          appointments={stats?.recentAppointments}
          isLoading={loading}
        />
      </motion.div>
    </motion.div>
  );
}


