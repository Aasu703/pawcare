"use client";

import { useEffect, useState } from "react";
import { getProviderBookings, updateBookingStatus } from "@/lib/api/provider/booking";
import { createFeedback, getFeedbackByProvider } from "@/lib/api/provider/provider";
import { addAppNotification, createUpcomingAppointmentNotifications } from "@/lib/notifications/app-notifications";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare, X } from "lucide-react";
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
  const [feedbackByBookingMap, setFeedbackByBookingMap] = useState<Record<string, any>>({});
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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

  async function fetchBookings() {
    setLoading(true);
    const res = await getProviderBookings();
    if (res.success && res.data) {
      const nextBookings = Array.isArray(res.data.bookings) ? res.data.bookings : [];
      setBookings(nextBookings);

      for (const booking of nextBookings) {
        if (booking?.status === "pending") {
          const bookingLabel = isVet ? "vet booking request" : "grooming booking request";
          addAppNotification({
            audience: "provider",
            providerType: providerType ?? undefined,
            type: "booking",
            title: "New booking request",
            message: `${booking.service?.title || bookingLabel} is awaiting your confirmation.`,
            link: "/provider/bookings",
            dedupeKey: `provider-pending-booking:${booking._id || booking.id}`,
            pushToBrowser: true,
          });
        }
      }

      createUpcomingAppointmentNotifications(nextBookings, {
        audience: "provider",
        providerType: providerType ?? undefined,
        statuses: ["confirmed"],
        link: isVet ? "/provider/vet-appointments" : "/provider/bookings",
      });

      const providerId = getEntityId(user?._id || user?.id || nextBookings[0]?.providerId);
      if (providerId) {
        const feedbackRes = await getFeedbackByProvider(providerId);
        if (feedbackRes.success && feedbackRes.data) {
          const nextMap = (Array.isArray(feedbackRes.data) ? feedbackRes.data : []).reduce(
            (acc: Record<string, any>, feedback: any) => {
              const bookingId = getEntityId(feedback?.bookingId);
              if (bookingId) {
                acc[bookingId] = feedback;
              }
              return acc;
            },
            {},
          );
          setFeedbackByBookingMap(nextMap);
        }
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
        providerType: providerType ?? undefined,
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

  const openFeedbackModal = (booking: any) => {
    setSelectedBooking(booking);
    setFeedbackText("");
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedBooking(null);
    setFeedbackText("");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!feedbackText.trim()) {
      toast.error("Please write feedback before submitting");
      return;
    }

    const providerId = getEntityId(user?._id || user?.id || selectedBooking?.providerId);
    const targetUserId = getEntityId(selectedBooking?.user?._id || selectedBooking?.userId);
    const bookingId = getEntityId(selectedBooking?._id || selectedBooking?.id);

    if (!providerId || !targetUserId || !bookingId) {
      toast.error("Booking details are incomplete");
      return;
    }

    setSubmittingFeedback(true);
    const res = await createFeedback({
      providerId,
      userId: targetUserId,
      bookingId,
      feedback: feedbackText.trim(),
    });

    if (res.success) {
      toast.success("Feedback submitted");
      setFeedbackByBookingMap((prev) => ({
        ...prev,
        [bookingId]: res.data ?? {
          providerId,
          userId: targetUserId,
          bookingId,
          feedback: feedbackText.trim(),
          _id: `temp-${bookingId}`,
        },
      }));
      closeFeedbackModal();
    } else {
      toast.error(res.message);
    }
    setSubmittingFeedback(false);
  };

  const filteredBookings = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (!hasBookingAccess) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Bookings Not Available</h1>
        <p className="text-muted-foreground">
          Shop owners cannot accept service bookings. Manage products from Inventory instead.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--pc-teal)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--pc-teal-dark)]">
          {isVet ? "Vet Appointment Bookings" : "Booking Management"}
        </h1>
        <p className="text-muted-foreground mt-1">
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
                ? "bg-[var(--pc-teal)] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === "pending" && bookings.filter((b) => b.status === "pending").length > 0 && (
              <span className="ml-1.5 bg-[var(--pc-primary)] text-[var(--pc-teal-dark)] text-xs px-1.5 py-0.5 rounded-full">
                {bookings.filter((b) => b.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No bookings found</h3>
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
                      <span className="text-xs text-muted-foreground">
                        ID: {booking._id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Service:</span> {booking.service?.title || "Not specified"}
                    </div>
                    {booking.pet && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Pet:</span> {booking.pet.name} ({booking.pet.species || "unknown"})
                      </div>
                    )}
                    {booking.user && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Owner:</span> {booking.user.name || booking.user.email || "N/A"}
                      </div>
                    )}
                    {booking.notes && (
                      <p className="text-sm text-muted-foreground">
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
                      className="flex items-center gap-1 px-3 py-1.5 bg-[var(--pc-teal-light)] text-blue-700 border border-[var(--pc-teal)]/20 rounded-lg text-sm font-medium hover:bg-[var(--pc-teal-light)] disabled:opacity-50 transition"
                    >
                      <CheckCircle className="h-4 w-4" /> Mark Complete
                    </button>
                  )}
                  {booking.status === "completed" && booking.user && (
                    <>
                      {feedbackByBookingMap[getEntityId(booking._id)] ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Feedback sent
                        </span>
                      ) : (
                        <button
                          onClick={() => openFeedbackModal(booking)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition"
                        >
                          <MessageSquare className="h-4 w-4" /> Give Feedback
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFeedbackModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Give User Feedback</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedBooking?.user?.name || selectedBooking?.user?.email || "Booking customer"}
                </p>
              </div>
              <button onClick={closeFeedbackModal} className="text-muted-foreground hover:text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-border px-3 py-2.5 focus:border-transparent focus:ring-2 focus:ring-[var(--pc-teal)]"
                  placeholder="Share your experience with this user..."
                />
              </div>

              <button
                type="submit"
                disabled={submittingFeedback}
                className="w-full rounded-lg bg-[var(--pc-teal)] py-2.5 font-semibold text-white hover:bg-[var(--pc-teal-dark)] disabled:opacity-50"
              >
                {submittingFeedback ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

