"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    PawPrint, 
    Users, 
    Calendar, 
    Briefcase, 
    UserCog 
} from "lucide-react";

const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Pets", href: "/admin/pets", icon: PawPrint },
    { name: "Owners", href: "/admin/owners", icon: Users },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Staff", href: "/admin/staff", icon: UserCog },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <PawPrint className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">PawCare Admin</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? "text-orange-600" : "text-gray-400"}`} />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
