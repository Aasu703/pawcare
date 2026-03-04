import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "teal"
  | "sage"
  | "success"
  | "warning"
  | "error"
  | "info";

const variants: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  primary:
    "bg-[var(--pc-primary-light)] text-[var(--pc-primary-hover)] border border-[var(--pc-primary)]/20",
  teal: "bg-[var(--pc-teal-light)] text-[var(--pc-teal-dark)]",
  sage: "bg-[var(--pc-sage)]/20 text-[var(--pc-sage)]",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
