import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-orange-500",
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <Icon className={cn("h-8 w-8", iconColor)} />
        {change !== undefined && (
          <span
            className={cn(
              "flex items-center text-sm font-medium",
              isPositive && "text-green-500",
              isNegative && "text-red-500"
            )}
          >
            {isPositive ? "↗" : "↘"} {isPositive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
