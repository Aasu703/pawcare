"use client";

import Link from "next/link";
import { 
    LayoutDashboard, 
    PawPrint, 
    Users, 
    Calendar, 
    Briefcase, 
    UserCog 
} from "lucide-react";
import { AdminTab } from "./types";

interface NavItem {
    name: string;
    tab: AdminTab;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { name: "Overview", tab: "overview", icon: LayoutDashboard },
    { name: "Pets", tab: "pets", icon: PawPrint },
    { name: "Owners", tab: "owners", icon: Users },
    { name: "Appointments", tab: "appointments", icon: Calendar },
    { name: "Services", tab: "services", icon: Briefcase },
    { name: "Staff", tab: "staff", icon: UserCog },
];

interface AdminSidebarProps {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/admin" className="flex items-center gap-2">
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
                        const isActive = activeTab === item.tab;
                        return (
                            <li key={item.name}>
                                <button
                                    onClick={() => setActiveTab(item.tab)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? "text-orange-600" : "text-gray-400"}`} />
                                    {item.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
