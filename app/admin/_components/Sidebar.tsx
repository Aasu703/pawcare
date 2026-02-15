"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  PawPrint,
  Users,
  Calendar,
  Store,
  UserCog,
  LogOut,
  Star,
  MessageSquare,
  HeartPulse,
  MessageCircle,
  Package,
  ShoppingCart,
  FileText,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: any,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: any,
  },
  {
    title: "Pets",
    href: "/admin/pets",
    icon: any,
  },
  {
    title: "Providers",
    href: "/admin/providers",
    icon: any,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: any,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: any,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: any,
  },
  {
    title: "Posts",
    href: "/admin/posts",
    icon: any,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: any,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: any,
  },
  {
    title: "Health Records",
    href: "/admin/health-records",
    icon: any,
  },
  {
    title: "Feedback",
    href: "/admin/feedback",
    icon: any,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: any,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <PawPrint className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold">PawCare Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t p-4">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium">{user?.Firstname} {user?.Lastname}</p>
            <p className="text-xs text-muted-foreground">Logged in as {user?.role || "admin"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

