"use client";

import { useState } from "react";
import AdminSidebar from "./_components/AdminSidebar";
import DashboardContent from "./_components/DashboardContent";
import PetsContent from "./_components/PetsContent";
import OwnersContent from "./_components/OwnersContent";
import AppointmentsContent from "./_components/AppointmentsContent";
import ServicesContent from "./_components/ServicesContent";
import StaffContent from "./_components/StaffContent";
import { AdminTab } from "./_components/types";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>("overview");

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <DashboardContent />;
            case "pets":
                return <PetsContent />;
            case "owners":
                return <OwnersContent />;
            case "appointments":
                return <AppointmentsContent />;
            case "services":
                return <ServicesContent />;
            case "staff":
                return <StaffContent />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 overflow-auto">
                {renderContent()}
            </main>
        </div>
    );
}