"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookingsByUser, deleteBooking } from "@/lib/api/user/booking";
import { Booking } from "@/lib/types/booking";
import { Calendar, Clock, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?._id) loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    const res = await getBookingsByUser(user._id);
    if (res.success && res.data) {
      setBookings(res.data);
    }
    setLoading(false);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const res = await deleteBooking(id);
    if (res.success) {
      toast.success("Booking cancelled");
      loadBookings();
    } else {
      toast.error(res.message);
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">Manage your pet care appointments</p>
        </div>
        <Link
          href="/user/services"
          className="flex items-center gap-2 bg-[#0f4f57] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0c4148] transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Booking
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === s ? "bg-[#0f4f57] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No bookings found</p>
          <Link href="/user/services" className="text-[#0f4f57] hover:underline mt-2 inline-block">
            Browse services to create a booking
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[booking.status] || "bg-gray-100 text-gray-600"}`}>
                    {booking.status}
                  </span>
                  {booking.price && (
                    <span className="text-sm font-semibold text-gray-700">${booking.price}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                  </span>
                </div>
                {booking.notes && (
                  <p className="text-sm text-gray-600 mt-2">{booking.notes}</p>
                )}
              </div>

              {(booking.status === "pending" || booking.status === "confirmed") && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancel booking"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
