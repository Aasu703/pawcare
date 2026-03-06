// ─── Dashboard Stats ────────────────────────────────────────
export interface DashboardStats {
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
