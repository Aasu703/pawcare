import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-orange-500",
  isLoading = false,
  onClick,
}: any) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md cursor-pointer",
        onClick && "hover:bg-accent/50"
      )}
      onClick={onClick}
    >
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

