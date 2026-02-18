"use client";

import { useEffect, useState } from "react";
import { getProviderBookings, updateBookingStatus } from "@/lib/api/provider/booking";
import { addAppNotification, createUpcomingAppointmentNotifications } from "@/lib/notifications/app-notifications";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { canManageBookings, isVetProvider } from "@/lib/provider-access";

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  confirmed: { label: "Confirmed", color: "text-blue-700", bgColor: "bg-blue-100" },
  completed: { label: "Completed", color: "text-green-700", bgColor: "bg-green-100" },
  cancelled: { label: "Cancelled", color: "text-red-700", bgColor: "bg-red-100" },
};

export default function ProviderBookingsPage() {
  const { user } = useAuth();
  const providerType = user?.providerType;
  const hasBookingAccess = canManageBookings(providerType);
  const isVet = isVetProvider(providerType);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchBookings() {
    setLoading(true);
    const res = await getProviderBookings();
    if (res.success && res.data) {
      const nextBookings = Array.isArray(res.data.bookings) ? res.data.bookings : [];
      setBookings(nextBookings);

      for (const booking of nextBookings) {
        if (booking?.status === "pending") {
          addAppNotification({
            audience: "provider",
            type: "booking",
            title: "New booking request",
            message: `${booking.service?.title || "Service booking"} is awaiting your confirmation.`,
            link: "/provider/bookings",
            dedupeKey: `provider-pending-booking:${booking._id || booking.id}`,
            pushToBrowser: true,
          });
        }
      }

      if (isVet) {
        createUpcomingAppointmentNotifications(nextBookings, {
          audience: "provider",
          statuses: ["confirmed"],
          link: "/provider/vet-appointments",
        });
      }
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (hasBookingAccess) fetchBookings();
    else setLoading(false);
  }, [hasBookingAccess]);

  const handleStatusChange = async (bookingId: any, status: any) => {
    setUpdating(bookingId);
    const res = await updateBookingStatus(bookingId, status);
    if (res.success) {
      addAppNotification({
        audience: "provider",
        type: "booking",
        title: "Booking updated",
        message: `Booking marked as ${status}.`,
        link: "/provider/bookings",
      });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } else {
      toast.error(res.message);
    }
    setUpdating(null);
  };

  const filteredBookings = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (!hasBookingAccess) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bookings Not Available</h1>
        <p className="text-gray-500">
          Shop owners cannot accept service bookings. Manage products from Inventory instead.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f4f57]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0c4148]">
          {isVet ? "Vet Appointment Bookings" : "Booking Management"}
        </h1>
        <p className="text-gray-500 mt-1">
          {isVet ? "Accept appointments and complete checkups" : "Manage customer bookings"}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === status
                ? "bg-[#0f4f57] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === "pending" && bookings.filter((b) => b.status === "pending").length > 0 && (
              <span className="ml-1.5 bg-[#f8d548] text-[#0c4148] text-xs px-1.5 py-0.5 rounded-full">
                {bookings.filter((b) => b.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No bookings found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.pending;
            return (
              <div key={booking._id} className="bg-white rounded-xl shadow border p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: {booking._id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Service:</span> {booking.service?.title || "Not specified"}
                    </div>
                    {booking.pet && (
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Pet:</span> {booking.pet.name} ({booking.pet.species || "unknown"})
                      </div>
                    )}
                    {booking.user && (
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Owner:</span> {booking.user.name || booking.user.email || "N/A"}
                      </div>
                    )}
                    {booking.notes && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(booking._id, "confirmed")}
                        disabled={updating === booking._id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 disabled:opacity-50 transition"
                      >
                        <CheckCircle className="h-4 w-4" /> Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, "cancelled")}
                        disabled={updating === booking._id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition"
                      >
                        <XCircle className="h-4 w-4" /> Decline
                      </button>
                    </div>
                  )}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => handleStatusChange(booking._id, "completed")}
                      disabled={updating === booking._id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 disabled:opacity-50 transition"
                    >
                      <CheckCircle className="h-4 w-4" /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

