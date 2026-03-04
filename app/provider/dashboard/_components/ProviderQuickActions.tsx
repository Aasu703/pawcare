"use client";

import Link from "next/link";
import { Wrench, CalendarCheck, HeartPulse, PawPrint, MessageSquare, Package } from "lucide-react";
import { NotificationProviderType } from "@/lib/notifications/app-notifications";

interface ProviderQuickActionsProps {
  providerType: string | undefined;
  canManageServices: boolean;
  canManageBookings: boolean;
  canManageInventory: boolean;
  isVet: boolean;
}

export function ProviderQuickActions({ 
  providerType, 
  canManageServices, 
  canManageBookings, 
  canManageInventory,
  isVet 
}: ProviderQuickActionsProps) {
  return (
    <div className={`grid grid-cols-1 ${providerType === 'shop' ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4`}>
      {canManageServices && (
        <Link href="/provider/services" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
          <Wrench className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
          <p className="font-semibold text-gray-900">Manage Services</p>
          <p className="text-sm text-gray-500 mt-1">Add or edit your services</p>
        </Link>
      )}
      {canManageBookings && (
        <Link href="/provider/bookings" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
          <CalendarCheck className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
          <p className="font-semibold text-gray-900">Manage Bookings</p>
          <p className="text-sm text-gray-500 mt-1">Confirm and process requests</p>
        </Link>
      )}
      {isVet && (
        <Link href="/provider/vet-appointments" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
          <HeartPulse className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
          <p className="font-semibold text-gray-900">Vet Appointments</p>
          <p className="text-sm text-gray-500 mt-1">Create checkup reports for pets</p>
        </Link>
      )}
      {isVet && (
        <Link href="/provider/assigned-pets" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
          <PawPrint className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
          <p className="font-semibold text-gray-900">Assigned Pets</p>
          <p className="text-sm text-gray-500 mt-1">Review pets assigned by users</p>
        </Link>
      )}
      {canManageBookings && (
        <Link href="/provider/messages" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
          <MessageSquare className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
          <p className="font-semibold text-gray-900">Messages</p>
          <p className="text-sm text-gray-500 mt-1">Chat with pet owners</p>
        </Link>
      )}
      {canManageInventory && (
        <Link href="/provider/inventory" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
          <Package className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
          <p className="font-semibold text-gray-900">Manage Shop Products</p>
          <p className="text-sm text-gray-500 mt-1">Add products visible to users</p>
        </Link>
      )}
      <Link href="/provider/feedback" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
        <MessageSquare className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
        <p className="font-semibold text-gray-900">View Feedback</p>
        <p className="text-sm text-gray-500 mt-1">See customer feedback</p>
      </Link>
    </div>
  );
}
