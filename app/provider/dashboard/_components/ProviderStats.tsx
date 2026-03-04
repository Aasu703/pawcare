"use client";

import { Package, AlertTriangle, DollarSign, Wrench, CalendarCheck, ClipboardList } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface ProviderStatsProps {
  stats: Stat[];
}

export function ProviderStats({ stats }: ProviderStatsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10`}>
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
          <div className={`${s.color} p-3 rounded-lg`}>
            <s.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
