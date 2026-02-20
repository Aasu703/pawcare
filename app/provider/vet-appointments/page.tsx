"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartPulse, FilePlus2, X, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { canAccessVetFeatures } from "@/lib/provider-access";
import { getProviderBookings } from "@/lib/api/provider/booking";
import { createHealthRecord } from "@/lib/api/user/health-record";
import { addAppNotification, createUpcomingAppointmentNotifications } from "@/lib/notifications/app-notifications";

type CheckupForm = {
  title: string;
  description: string;
  date: string;
  nextDueDate: string;
};

const initialForm: CheckupForm = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  nextDueDate: "",
};

export default function VetAppointmentsPage() {
  const { user } = useAuth();
  const hasVetAccess = canAccessVetFeatures(user?.providerType);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [form, setForm] = useState<CheckupForm>(initialForm);

  async function loadAppointments() {
    setLoading(true);
    const res = await getProviderBookings();
    if (res.success && res.data?.bookings) {
      const nextBookings = Array.isArray(res.data.bookings) ? res.data.bookings : [];
      setBookings(nextBookings);
      createUpcomingAppointmentNotifications(nextBookings, {
        audience: "provider",
        providerType: "vet",
        statuses: ["confirmed"],
        link: "/provider/vet-appointments",
      });
    } else if (!res.success) {
      toast.error(res.message || "Failed to load appointments");
      setBookings([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (hasVetAccess) {
      loadAppointments();
    } else {
      setLoading(false);
    }
  }, [hasVetAccess]);

  const appointmentList = useMemo(
    () => bookings.filter((b) => ["confirmed", "completed"].includes(b.status)),
    [bookings]
  );

  const openForm = (booking: any) => {
    setSelectedBooking(booking);
    setForm({
      ...initialForm,
      title: `Checkup Report - ${booking.pet?.name || "Pet"}`,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedBooking(null);
    setSubmitting(false);
    setForm(initialForm);
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking?.petId) {
      toast.error("This booking does not have a linked pet.");
      return;
    }

    setSubmitting(true);
    const res = await createHealthRecord({
      petId: selectedBooking.petId,
      recordType: "checkup",
      title: form.title,
      description: form.description,
      date: form.date,
      nextDueDate: form.nextDueDate || undefined,
    });

    if (res.success) {
      addAppNotification({
        audience: "provider",
        providerType: "vet",
        type: "appointment",
        title: "Checkup report saved",
        message: `${selectedBooking?.pet?.name || "Pet"} checkup added to health records.`,
        link: "/provider/vet-appointments",
      });
      toast.success("Checkup report saved to health records");
      closeForm();
    } else {
      toast.error(res.message || "Failed to save checkup report");
      setSubmitting(false);
    }
  };

  if (!hasVetAccess) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vet Appointments Not Available</h1>
        <p className="text-gray-500">
          This page is only available to verified vet providers.
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0c4148]">Vet Appointments</h1>
        <p className="text-gray-500 mt-1">Complete checkups and save reports to pet health records.</p>
      </div>

      {appointmentList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <HeartPulse className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No confirmed vet appointments found</p>
          <p className="text-sm text-gray-400 mt-1">Confirmed bookings will appear here for checkup reporting.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {appointmentList.map((booking) => (
            <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{booking.service?.title || "Vet Service"}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                  {booking.status}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                  </span>
                </div>
                <p><span className="font-medium text-gray-700">Pet:</span> {booking.pet?.name || booking.petId || "Not linked"}</p>
                {booking.user && (
                  <p><span className="font-medium text-gray-700">Owner:</span> {booking.user.name || booking.user.email || "N/A"}</p>
                )}
              </div>

              <button
                onClick={() => openForm(booking)}
                disabled={!booking.petId}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#0f4f57] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#0c4148] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FilePlus2 className="h-4 w-4" />
                Add Checkup Report
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">New Checkup Report</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Checkup Notes</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Checkup Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up (optional)</label>
                  <input
                    type="date"
                    value={form.nextDueDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, nextDueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0f4f57] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0c4148] disabled:opacity-60 transition-colors"
              >
                {submitting ? "Saving..." : "Save To Health Records"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
