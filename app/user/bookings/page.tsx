"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBookingsByUser, deleteBooking } from "@/lib/api/user/booking";
import { createReview, getMyReviews } from "@/lib/api/user/review";
import { addAppNotification, createUpcomingAppointmentNotifications } from "@/lib/notifications/app-notifications";
import { Calendar, Clock, Trash2, Plus, Star, X } from "lucide-react";
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
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [bookingReviewMap, setBookingReviewMap] = useState<Record<string, any>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const userId = user?._id || user?.id;

  const getEntityId = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value?._id) return getEntityId(value._id);
    if (value?.id) return getEntityId(value.id);
    if (typeof value?.toHexString === "function") return value.toHexString();
    if (typeof value?.toString === "function") {
      const stringified = value.toString();
      return stringified === "[object Object]" ? "" : stringified;
    }
    return "";
  };

  async function loadBookings(uid: string) {
    setLoading(true);
    const [bookingsRes, reviewsRes] = await Promise.all([getBookingsByUser(uid), getMyReviews()]);

    if (bookingsRes.success && bookingsRes.data) {
      const nextBookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
      setBookings(nextBookings);
      createUpcomingAppointmentNotifications(nextBookings, {
        audience: "user",
        statuses: ["confirmed"],
        link: "/user/bookings",
      });
    } else if (!bookingsRes.success) {
      toast.error(bookingsRes.message || "Failed to fetch bookings");
    }

    if (reviewsRes.success && reviewsRes.data) {
      const nextMap = (Array.isArray(reviewsRes.data) ? reviewsRes.data : []).reduce(
        (acc: Record<string, any>, review: any) => {
          const bookingId = getEntityId(review?.bookingId);
          if (bookingId) {
            acc[bookingId] = review;
          }
          return acc;
        },
        {},
      );
      setBookingReviewMap(nextMap);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (userId) loadBookings(userId);
  }, [userId]);

  const handleCancel = async (data: any) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const res = await deleteBooking(data);
    if (res.success) {
      addAppNotification({
        audience: "user",
        type: "booking",
        title: "Booking cancelled",
        message: "A booking was cancelled from your schedule.",
        link: "/user/bookings",
      });
      toast.success("Booking cancelled");
      if (userId) loadBookings(userId);
    } else {
      toast.error(res.message);
    }
  };

  const openReviewModal = (booking: any) => {
    setSelectedBooking(booking);
    setReviewForm({ rating: 5, comment: "" });
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedBooking(null);
    setReviewForm({ rating: 5, comment: "" });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const bookingId = getEntityId(selectedBooking?._id || selectedBooking?.id);
    const providerId = getEntityId(selectedBooking?.provider?._id || selectedBooking?.providerId);
    const providerServiceId = getEntityId(selectedBooking?.providerServiceId);

    if (!bookingId || !providerId) {
      toast.error("Provider details are missing for this booking");
      return;
    }

    setSubmittingReview(true);
    const payload: Record<string, any> = {
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim() || undefined,
      providerId,
      bookingId,
      reviewType: "provider",
    };

    if (providerServiceId) {
      payload.providerServiceId = providerServiceId;
    }

    const res = await createReview(payload);
    if (res.success) {
      toast.success("Thanks for rating your provider");
      setBookingReviewMap((prev) => ({
        ...prev,
        [bookingId]: res.data ?? { ...payload, _id: `temp-${bookingId}` },
      }));
      closeReviewModal();
    } else {
      toast.error(res.message);
    }
    setSubmittingReview(false);
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
          {filtered.map((booking, idx) => (
            <div
              key={booking._id ?? `booking-${idx}`}
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
                {(booking.provider?.businessName || booking.providerId) && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Provider:</span>{" "}
                    {booking.provider?.businessName || booking.providerId}
                  </p>
                )}
                {booking.notes && (
                  <p className="text-sm text-gray-600 mt-2">{booking.notes}</p>
                )}

                {booking.status === "completed" && (
                  <div className="mt-3">
                    {bookingReviewMap[getEntityId(booking._id || booking.id)] ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        Rated
                      </span>
                    ) : (
                      <button
                        onClick={() => openReviewModal(booking)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        <Star className="h-4 w-4" />
                        Rate Provider
                      </button>
                    )}
                  </div>
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

      {isReviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Rate Provider</h2>
                <p className="text-sm text-gray-500">
                  {selectedBooking?.provider?.businessName || "Share your booking experience"}
                </p>
              </div>
              <button onClick={closeReviewModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                      className="rounded p-0.5"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Comment (optional)</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:ring-2 focus:ring-[#0f4f57]"
                  placeholder="How was your experience?"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full rounded-lg bg-[#0f4f57] py-2.5 font-semibold text-white hover:bg-[#0c4148] disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Rating"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

