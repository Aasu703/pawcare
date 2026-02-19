"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServiceById, getServicesByProvider } from "@/lib/api/public/service";
import {
  Star,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  ArrowLeft,
  User,
  ShieldCheck,
  BadgeCheck,
  ClipboardList,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  const [providerServices, setProviderServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) loadData();
  }, [serviceId]);

  async function loadData() {
    setLoading(true);
    const serviceRes = await getServiceById(serviceId);

    if (serviceRes.success && serviceRes.data) {
      setService(serviceRes.data);

      const providerId = serviceRes.data.provider?._id || serviceRes.data.providerId;
      if (providerId) {
        const providerServicesRes = await getServicesByProvider(providerId);
        if (providerServicesRes.success && providerServicesRes.data) {
          setProviderServices(providerServicesRes.data.filter((s: any) => s._id !== serviceId));
        }
      }
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf9] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f59e0b] border-t-transparent"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#fffdf9] flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl border border-[#f0ddc0] bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you requested is unavailable.</p>
          <Link href="/user/services">
            <button className="rounded-xl bg-[#f59e0b] px-6 py-3 font-semibold text-white hover:bg-[#ef7f1a]">
              Back to Services
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const category = service.category || service.catergory || "general";
  const providerId = service.provider?._id || service.providerId || "";
  const providerName = service.provider?.name || service.provider?.businessName || "Vet Provider";
  const providerSubtitle = service.provider?.providerType
    ? `${service.provider.providerType} provider`
    : "provider";
  const categoryBadge =
    category === "vet"
      ? "bg-[#dbeafe] text-[#1d4ed8]"
      : category === "grooming"
      ? "bg-[#ffe8d5] text-[#b45309]"
      : category === "boarding"
      ? "bg-[#d9f2f1] text-[#0f766e]"
      : "bg-gray-100 text-gray-700";

  const includedItems = [
    "Provider verified by PawCare team",
    "Transparent pricing with no hidden fees",
    "In-app booking and schedule updates",
    "Post-service support and follow-up",
  ];

  return (
    <div
      className="min-h-screen bg-[#fffdf9] pb-12"
      style={{ fontFamily: '"Nunito", "Poppins", sans-serif' }}
    >
      <div className="border-b border-[#f0dfc6] bg-gradient-to-r from-[#fff6e5] to-[#ecfeff]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e8d8bc] bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-[#fff8ec]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to results
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#7a4d0b]">
            <ShieldCheck className="h-4 w-4 text-[#f59e0b]" />
            Trusted care provider
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 md:px-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-[#efdfc8] bg-white p-6 shadow-[0_18px_50px_rgba(17,24,39,0.08)] md:p-8"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${categoryBadge}`}>
                {category}
              </span>
              {(service.rating || 0) >= 4.5 && (
                <span className="rounded-full bg-[#fff1cc] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#b45309]">
                  Top Rated
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-[#111827] md:text-4xl">{service.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
              {service.description || "No description available for this service."}
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-[#fff8ec] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#a16207]">Duration</p>
                <p className="mt-1 inline-flex items-center gap-2 font-bold text-gray-900">
                  <Clock className="h-4 w-4 text-[#f59e0b]" />
                  {service.duration_minutes} min
                </p>
              </div>
              <div className="rounded-2xl bg-[#eff6ff] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1d4ed8]">Price</p>
                <p className="mt-1 inline-flex items-center gap-2 font-bold text-gray-900">
                  <DollarSign className="h-4 w-4 text-[#1d4ed8]" />${service.price}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f0fdfa] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">Rating</p>
                <p className="mt-1 inline-flex items-center gap-2 font-bold text-gray-900">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  {service.rating ? service.rating.toFixed(1) : "New"}
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="rounded-[28px] border border-[#efdfc8] bg-white p-6 md:p-8"
          >
            <h2 className="mb-4 text-2xl font-extrabold text-[#111827]">What&apos;s included</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {includedItems.map((item) => (
                <div key={item} className="inline-flex items-start gap-2 rounded-xl border border-[#f2e7d1] bg-[#fffef9] p-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {service.provider && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] border border-[#efdfc8] bg-white p-6 md:p-8"
            >
              <h2 className="mb-5 text-2xl font-extrabold text-[#111827]">Provider details</h2>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff3dc]">
                  <User className="h-7 w-7 text-[#b45309]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {service.provider.name || service.provider.businessName || "Provider"}
                  </h3>
                  {service.provider.address && (
                    <p className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-[#f59e0b]" />
                      {service.provider.address}
                    </p>
                  )}
                  {service.provider.phone && (
                    <p className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-[#f59e0b]" />
                      {service.provider.phone}
                    </p>
                  )}
                  {service.provider.email && (
                    <p className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-[#f59e0b]" />
                      {service.provider.email}
                    </p>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-[28px] border border-[#efdfc8] bg-white p-6 md:p-8"
          >
            <h2 className="mb-5 text-2xl font-extrabold text-[#111827]">Customer reviews</h2>
            {service.reviews && service.reviews.length > 0 ? (
              <div className="space-y-4">
                {service.reviews.map((review: any) => (
                  <article key={review._id} className="rounded-2xl border border-[#f2e7d1] bg-[#fffef9] p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-gray-900">{review.user?.name || "Anonymous"}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{review.comment}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet. Be the first to share your experience.</p>
            )}
          </motion.section>
        </div>

        <aside className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-24 rounded-[28px] border border-[#efdfc8] bg-white p-5 shadow-[0_18px_50px_rgba(17,24,39,0.08)]"
          >
            <h3 className="text-xl font-extrabold text-[#111827]">Book this service</h3>
            <p className="mt-1 text-sm text-gray-500">Fast confirmation from provider.</p>

            <div className="mt-4 space-y-2 rounded-2xl bg-[#faf7f1] p-4 text-sm">
              <p className="inline-flex items-center gap-2 text-gray-700">
                <ClipboardList className="h-4 w-4 text-[#f59e0b]" />
                {service.title}
              </p>
              <p className="inline-flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-[#f59e0b]" />
                {service.duration_minutes} min
              </p>
              <p className="inline-flex items-center gap-2 font-bold text-gray-900">
                <DollarSign className="h-4 w-4 text-[#16a34a]" />
                ${service.price}
              </p>
            </div>

            <Link href={`/user/bookings/new?serviceId=${service._id}`}>
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ef7f1a] py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(239,127,26,0.35)] hover:from-[#ef7f1a] hover:to-[#dd6b13]">
                <Calendar className="h-4 w-4" />
                Continue to Booking
              </button>
            </Link>

            {category === "vet" && providerId && (
              <Link
                href={`/user/vet-chat?participantId=${providerId}&participantRole=provider&participantName=${encodeURIComponent(
                  providerName,
                )}&participantSubtitle=${encodeURIComponent(providerSubtitle)}`}
              >
                <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8d8bc] bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-[#fff8ec]">
                  <Mail className="h-4 w-4" />
                  Chat with Vet
                </button>
              </Link>
            )}

            <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-gray-500">
              <HeartPulse className="h-4 w-4 text-[#f59e0b]" />
              Your pet&apos;s care details stay private and secure.
            </p>
          </motion.section>

          {providerServices.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-[28px] border border-[#efdfc8] bg-white p-5"
            >
              <h3 className="mb-4 text-lg font-extrabold text-[#111827]">More from this provider</h3>
              <div className="space-y-3">
                {providerServices.slice(0, 3).map((otherService: any) => (
                  <Link key={otherService._id} href={`/user/services/${otherService._id}`}>
                    <article className="rounded-xl border border-[#f2e7d1] bg-[#fffef9] p-3 transition-colors hover:bg-[#fff8ec]">
                      <p className="line-clamp-1 text-sm font-bold text-gray-900">{otherService.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-[#f59e0b]" />
                          {otherService.duration_minutes} min
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                          <DollarSign className="h-3.5 w-3.5 text-[#16a34a]" />${otherService.price}
                        </span>
                        <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </aside>
      </div>
    </div>
  );
}
