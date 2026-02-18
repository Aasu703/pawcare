"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getServiceById } from "@/lib/api/public/service";
import { getUserPets } from "@/lib/api/user/pet";
import { createBooking } from "@/lib/api/user/booking";
import { addAppNotification } from "@/lib/notifications/app-notifications";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

const QUICK_TIME_SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

function padTwo(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateForInput(date: Date) {
  return `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`;
}

function formatTimeForInput(date: Date) {
  return `${padTwo(date.getHours())}:${padTwo(date.getMinutes())}`;
}

function formatDateTimeForInput(date: Date) {
  return `${formatDateForInput(date)}T${formatTimeForInput(date)}`;
}

function toNextHalfHour(date: Date) {
  const next = new Date(date);
  next.setSeconds(0, 0);
  const minutes = next.getMinutes();
  const remainder = minutes % 30;
  if (remainder !== 0) {
    next.setMinutes(minutes + (30 - remainder));
  }
  if (next.getTime() <= date.getTime()) {
    next.setMinutes(next.getMinutes() + 30);
  }
  return next;
}

function addMinutesToLocalDateTime(localDateTime: string, minutesToAdd: number) {
  const date = new Date(localDateTime);
  if (Number.isNaN(date.getTime())) return "";
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return formatDateTimeForInput(date);
}

function combineDateAndTime(date: string, time: string) {
  if (!date || !time) return "";
  return `${date}T${time}`;
}

type ServiceSummary = {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
};

type PetSummary = {
  _id: string;
  name: string;
  species?: string;
};

function NewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const normalizedServiceId = serviceId && serviceId !== "undefined" ? serviceId : undefined;

  const [service, setService] = useState<ServiceSummary | null>(null);
  const [pets, setPets] = useState<PetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    petId: "",
    notes: "",
  });
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [serviceRes, petsRes] = await Promise.all([
      normalizedServiceId
        ? getServiceById(normalizedServiceId)
        : Promise.resolve({ success: false as const, message: "", data: undefined }),
      getUserPets(),
    ]);

    if (serviceRes.success && serviceRes.data) setService(serviceRes.data);
    if (petsRes.success && petsRes.data) setPets(petsRes.data);
    setLoading(false);
  }, [normalizedServiceId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadData]);

  useEffect(() => {
    if (form.startTime) return;
    const timer = window.setTimeout(() => {
      const defaultStart = toNextHalfHour(new Date());
      const date = formatDateForInput(defaultStart);
      const time = formatTimeForInput(defaultStart);
      const startTime = combineDateAndTime(date, time);
      const duration = service?.duration_minutes || 60;

      setBookingDate(date);
      setBookingTime(time);
      setForm((prev) => ({
        ...prev,
        startTime,
        endTime: addMinutesToLocalDateTime(startTime, duration),
      }));
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [form.startTime, service?.duration_minutes]);

  const updateStartSchedule = (nextDate: string, nextTime: string) => {
    const startTime = combineDateAndTime(nextDate, nextTime);
    const duration = service?.duration_minutes || 60;
    setBookingDate(nextDate);
    setBookingTime(nextTime);
    setForm((prev) => ({
      ...prev,
      startTime,
      endTime: addMinutesToLocalDateTime(startTime, duration),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startTime || !form.endTime) {
      toast.error("Please select start and end times");
      return;
    }
    if (new Date(form.startTime).getTime() < Date.now()) {
      toast.error("Please select a future date and time");
      return;
    }
    if (new Date(form.endTime).getTime() <= new Date(form.startTime).getTime()) {
      toast.error("End time must be after start time");
      return;
    }

    setSubmitting(true);
    const res = await createBooking({
      startTime: form.startTime,
      endTime: form.endTime,
      serviceId: normalizedServiceId,
      petId: form.petId || undefined,
      notes: form.notes || undefined,
    });

    if (res.success) {
      const startLabel = new Date(form.startTime).toLocaleString();
      addAppNotification({
        audience: "user",
        type: "booking",
        title: "Booking confirmed",
        message: `${service?.title || "Service"} booked for ${startLabel}.`,
        link: "/user/bookings",
        dedupeKey: `booking-created:${res.data?._id || `${normalizedServiceId}:${form.startTime}`}`,
        pushToBrowser: true,
      });
      toast.success("Booking created successfully!");
      router.push("/user/bookings");
    } else {
      toast.error(res.message || "Failed to create booking");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center">
      <Link href="/user/services" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-5 w-5" />
        Back to Services
      </Link>

      <div className="w-full text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Booking</h1>
        <p className="mb-8 text-gray-500">Fill in the details to book a service for your pet</p>

        {/* Service Info */}
        {service && (
          <div className="mb-8 rounded-xl border border-[#0f4f57]/20 bg-[#0f4f57]/5 p-5 text-center">
            <h3 className="font-semibold text-gray-900 text-lg">{service.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            <div className="mt-3 flex justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />${service.price}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{service.duration_minutes} min</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pet Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Pet</label>
            <select
              value={form.petId}
              onChange={(e) => setForm({ ...form, petId: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
            >
              <option value="">No pet selected</option>
              {pets.map((pet) => (
                <option key={pet._id} value={pet._id}>{pet.name} ({pet.species})</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0c4148]">
              <Calendar className="h-4 w-4" />
              Schedule
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => updateStartSchedule(formatDateForInput(new Date()), bookingTime || "09:00")}
                className="rounded-lg border border-[#0f4f57]/20 bg-white px-3 py-2 text-sm font-medium text-[#0f4f57] hover:bg-[#0f4f57]/5"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  updateStartSchedule(formatDateForInput(tomorrow), bookingTime || "09:00");
                }}
                className="rounded-lg border border-[#0f4f57]/20 bg-white px-3 py-2 text-sm font-medium text-[#0f4f57] hover:bg-[#0f4f57]/5"
              >
                Tomorrow
              </button>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={formatDateForInput(new Date())}
                  onChange={(e) => updateStartSchedule(e.target.value, bookingTime)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:ring-2 focus:ring-[#0f4f57]"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => updateStartSchedule(bookingDate, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-transparent focus:ring-2 focus:ring-[#0f4f57]"
                  required
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => updateStartSchedule(bookingDate, slot)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    bookingTime === slot
                      ? "border-[#0f4f57] bg-[#0f4f57] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#0f4f57]/50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-white p-3 text-sm text-gray-700">
              <p className="font-medium text-[#0c4148]">Appointment Summary</p>
              <p className="mt-1">
                Starts: {form.startTime ? new Date(form.startTime).toLocaleString() : "--"}
              </p>
              <p>
                Ends: {form.endTime ? new Date(form.endTime).toLocaleString() : "--"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                End time is auto-set using service duration ({service?.duration_minutes || 60} minutes).
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent resize-none"
              placeholder="Any special requests or notes..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0f4f57] text-white py-3 rounded-lg font-semibold hover:bg-[#0c4148] transition-colors disabled:opacity-50"
          >
            {submitting ? "Creating Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div></div>}>
      <NewBookingForm />
    </Suspense>
  );
}

