"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { Home, PawPrint, Calendar, Star, MessageSquare, User, LogOut, Heart } from "lucide-react";

const navItems = [
  { label: "Home", href: "/user/home", icon: Home },
  { label: "My Pets", href: "/user/pet", icon: PawPrint },
  { label: "Services", href: "/user/services", icon: Heart },
  { label: "Bookings", href: "/user/bookings", icon: Calendar },
  { label: "Reviews", href: "/user/reviews", icon: Star },
  { label: "Messages", href: "/user/messages", icon: MessageSquare },
  { label: "Profile", href: "/user/profile", icon: User },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { user, logout, loggingOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0c4148] border-r border-[#f8d548]/20 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#f8d548]/20">
        <Image src="/images/pawcare.png" alt="PawCare" width={36} height={36} />
        <span className="text-xl font-bold text-white">PawCare</span>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-[#f8d548]/10">
        <p className="text-sm text-[#f8d548] font-semibold truncate">
          {user?.Firstname} {user?.Lastname}
        </p>
        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
      </div>

      {/* Navigation */}
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

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#f8d548]/20">
        <button
          onClick={logout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
