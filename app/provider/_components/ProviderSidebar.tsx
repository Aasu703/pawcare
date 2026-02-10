"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Wrench, Package, MessageSquare, LogOut, CalendarCheck, FileText } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Services", href: "/provider/services", icon: Wrench },
  { label: "Inventory", href: "/provider/inventory", icon: Package },
  { label: "Bookings", href: "/provider/bookings", icon: CalendarCheck },
  { label: "Posts", href: "/provider/posts", icon: FileText },
  { label: "Feedback", href: "/provider/feedback", icon: MessageSquare },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/provider/login";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0c4148] border-r border-[#f8d548]/20 flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#f8d548]/20">
        <Image src="/images/pawcare.png" alt="PawCare" width={36} height={36} />
        <div>
          <span className="text-xl font-bold text-white">PawCare</span>
          <p className="text-xs text-[#f8d548]">Provider</p>
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
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
