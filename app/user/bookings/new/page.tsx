"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { getServiceById } from "@/lib/api/public/service";
import { getUserPets } from "@/lib/api/user/pet";
import { createBooking } from "@/lib/api/user/booking";
import { Service } from "@/lib/types/service";
import { Pet } from "@/lib/types/pet";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

function NewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const normalizedServiceId = serviceId && serviceId !== "undefined" ? serviceId : undefined;
  const { user } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    petId: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    setLoading(true);
    const [serviceRes, petsRes] = await Promise.all([
      normalizedServiceId ? getServiceById(normalizedServiceId) : Promise.resolve({ success: false as const, message: "", data: undefined }),
      getUserPets(),
    ]);

    if (serviceRes.success && serviceRes.data) setService(serviceRes.data);
    if (petsRes.success && petsRes.data) setPets(petsRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startTime || !form.endTime) {
      toast.error("Please select start and end times");
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
    <div>
      <Link href="/user/services" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-5 w-5" />
        Back to Services
      </Link>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Booking</h1>
        <p className="text-gray-500 mb-8">Fill in the details to book a service for your pet</p>

        {/* Service Info */}
        {service && (
          <div className="bg-[#0f4f57]/5 border border-[#0f4f57]/20 rounded-xl p-5 mb-8">
            <h3 className="font-semibold text-gray-900 text-lg">{service.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            <div className="flex gap-4 mt-3 text-sm text-gray-500">
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

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
              required
            />
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
