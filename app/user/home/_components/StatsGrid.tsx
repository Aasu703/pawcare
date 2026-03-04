"use client";

import { motion } from "framer-motion";
import { PawPrint, Calendar, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  onClick?: () => void;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-2 gap-4"
    >
      {stats.map((stat, index) => (
        <button
          key={index}
          type="button"
          onClick={stat.onClick}
          className={`bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-left ${index === 0 ? 'col-span-2' : ''}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-[var(--pc-teal-light)] flex items-center justify-center text-primary mb-4">
            <stat.icon className="w-5 h-5" />
          </div>
          <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
          <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
        </button>
      ))}
    </motion.div>
  );
}

export function QuickActions({ onOpenReminders }: { onOpenReminders: () => void }) {
  const router = useRouter();

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-lg shadow-gray-200/40 backdrop-blur-xl md:p-8">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Quick Care Actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Jump straight to the tasks you do most often.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenReminders}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
        >
          <Bell className="h-4 w-4" />
          Open Reminders
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => router.push("/user/pet/add")}
          className="rounded-2xl border border-border bg-white px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-foreground">Add Pet</p>
          <p className="mt-1 text-xs text-muted-foreground">Create profile and care plan.</p>
        </button>
        <button
          type="button"
          onClick={() => router.push("/user/bookings")}
          className="rounded-2xl border border-border bg-white px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-foreground">Manage Appointments</p>
          <p className="mt-1 text-xs text-muted-foreground">Review and schedule vet visits.</p>
        </button>
        <button
          type="button"
          onClick={() => router.push("/user/pet")}
          className="rounded-2xl border border-border bg-white px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-foreground">Open Pet Care</p>
          <p className="mt-1 text-xs text-muted-foreground">Update feeding and vaccination tasks.</p>
        </button>
      </div>
    </section>
  );
}
