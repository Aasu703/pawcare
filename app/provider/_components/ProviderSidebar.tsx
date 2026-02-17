"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Wrench, Package, MessageSquare, LogOut, CalendarCheck, FileText, UserCircle, HeartPulse, LucideIcon } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import {
  canAccessVetFeatures,
  canManageBookings,
  canManageInventory,
  canManageServices,
  getProviderTypeLabel,
} from "@/lib/provider-access";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function ProviderSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, user } = useAuth();
  const providerType = user?.providerType;

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/provider/profile", icon: UserCircle },
    ...(canManageServices(providerType) ? [{ label: "Services", href: "/provider/services", icon: Wrench }] : []),
    ...(canManageInventory(providerType) ? [{ label: "Inventory", href: "/provider/inventory", icon: Package }] : []),
    ...(canManageBookings(providerType) ? [{ label: "Bookings", href: "/provider/bookings", icon: CalendarCheck }] : []),
    ...(canAccessVetFeatures(providerType) ? [{ label: "Vet Appointments", href: "/provider/vet-appointments", icon: HeartPulse }] : []),
    { label: "Posts", href: "/provider/posts", icon: FileText },
    { label: "Feedback", href: "/provider/feedback", icon: MessageSquare },
  ];

  const onLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // Ensure client-side cleanup if context logout fails
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0c4148] border-r border-[#f8d548]/20 flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#f8d548]/20">
        <Image src="/images/pawcare.png" alt="PawCare" width={36} height={36} />
        <div>
          <span className="text-xl font-bold text-white">PawCare</span>
          <p className="text-xs text-[#f8d548]">{getProviderTypeLabel(providerType)}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#f8d548] text-[#0c4148]"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#f8d548]/20">
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}

