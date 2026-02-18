"use client";

import { useState, useEffect } from "react";
import { getAllServices } from "@/lib/api/public/service";
import {
  Search,
  Clock,
  DollarSign,
  Tag,
  ChevronRight,
  Star,
  Activity,
  Sparkles,
  Map,
  List,
  SortAsc,
  ShieldCheck,
  PillBottle,
  Scissors,
  Home,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import ProviderNearbyShopsMap from "@/components/ProviderNearbyShopsMap";

type SortType = "newest" | "price-low" | "price-high" | "rating";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    serviceType: "all",
    dateFrom: "",
    dateTo: "",
    petType: "all",
    priceRange: "all",
  });
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<SortType>("newest");

  async function loadServices() {
    setLoading(true);
    const res = await getAllServices();
    if (res.success && res.data) {
      setServices(res.data);
      setFiltered(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    let result = services;
    if (filters.location) {
      result = result.filter(
        (s) =>
          s.provider?.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
          s.provider?.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
          s.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
          false
      );
    }
    if (filters.serviceType !== "all") {
      result = result.filter((s) => (s.category || s.catergory) === filters.serviceType);
    }
    if (filters.priceRange !== "all") {
      const [minStr, maxStr] = filters.priceRange.split("-");
      const min = parseInt(minStr);
      const max = maxStr === "+" ? Infinity : parseInt(maxStr);
      result = result.filter((s) => s.price >= min && (max === Infinity || s.price <= max));
    }

    result = result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    setFiltered(result);
  }, [filters, services, sortBy]);

  const categoryStyles: Record<string, { chip: string; panel: string; icon: any }> = {
    grooming: {
      chip: "bg-[#ffe8d5] text-[#b45309]",
      panel: "from-[#fff7ed] to-[#ffe8d5]",
      icon: Scissors,
    },
    boarding: {
      chip: "bg-[#d9f2f1] text-[#0f766e]",
      panel: "from-[#f0fdfa] to-[#d9f2f1]",
      icon: Home,
    },
    vet: {
      chip: "bg-[#dbeafe] text-[#1d4ed8]",
      panel: "from-[#eff6ff] to-[#dbeafe]",
      icon: ShieldCheck,
    },
  };

  const quickNeeds = [
    { label: "All Services", value: "all", icon: Tag },
    { label: "Vet Visits", value: "vet", icon: PillBottle },
    { label: "Grooming", value: "grooming", icon: Scissors },
    { label: "Boarding", value: "boarding", icon: Home },
  ];

  return (
    <div
      className="min-h-screen bg-[#fffdf9] px-4 py-6 md:px-8 md:py-8"
      style={{ fontFamily: '"Nunito", "Poppins", sans-serif' }}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-[#f2ddbc] bg-gradient-to-r from-[#fff4de] via-[#fff9ef] to-[#ecfeff] px-5 py-3 text-sm font-semibold text-[#7a4d0b]"
        >
          Free cancellation on selected bookings. Verified pet care providers only.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-5 rounded-[28px] border border-[#f0dfc6] bg-white p-6 shadow-[0_20px_70px_rgba(245,158,11,0.12)] md:grid-cols-[2fr,1fr]"
        >
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#fff0d7] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#b45309]">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted pet care
            </p>
            <h1 className="text-3xl font-extrabold text-[#111827] md:text-5xl">
              Book care your pet
              <span className="text-[#f59e0b]"> actually enjoys</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 md:text-lg">
              Explore grooming, veterinary checkups, and boarding from verified providers in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#fff8ec] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#a16207]">Providers</p>
              <p className="mt-2 text-2xl font-extrabold text-[#111827]">300+</p>
            </div>
            <div className="rounded-2xl bg-[#f0fdfa] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0f766e]">Happy Pets</p>
              <p className="mt-2 text-2xl font-extrabold text-[#111827]">50K+</p>
            </div>
            <div className="rounded-2xl bg-[#eff6ff] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1d4ed8]">Avg Rating</p>
              <p className="mt-2 text-2xl font-extrabold text-[#111827]">4.8</p>
            </div>
            <div className="rounded-2xl bg-[#fff1f2] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#be123c]">Support</p>
              <p className="mt-2 text-2xl font-extrabold text-[#111827]">24/7</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <SearchBar onSearch={setFilters} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 className="text-xl font-extrabold text-[#111827] md:text-2xl">Shop by need</h2>
            <p className="text-sm text-gray-500">Choose a care type to narrow down options quickly.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickNeeds.map((item) => {
              const Icon = item.icon;
              const active = filters.serviceType === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setFilters((prev) => ({ ...prev, serviceType: item.value }))}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "border-[#f59e0b] bg-[#f59e0b] text-white shadow-[0_10px_24px_rgba(245,158,11,0.35)]"
                      : "border-[#eadcc8] bg-white text-gray-700 hover:bg-[#fff6ea]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#efe2cc] bg-white p-3"
        >
          <div className="inline-flex rounded-xl bg-[#f8f6f2] p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                viewMode === "list" ? "bg-white text-[#111827] shadow-sm" : "text-gray-500"
              }`}
            >
              <List className="h-4 w-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                viewMode === "map" ? "bg-white text-[#111827] shadow-sm" : "text-gray-500"
              }`}
            >
              <Map className="h-4 w-4" />
              Map View
            </button>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="h-10 rounded-xl border border-[#efe2cc] bg-white px-3 text-sm font-medium text-gray-700 outline-none focus:border-[#f59e0b]"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f59e0b] border-t-transparent"></div>
              <p className="text-gray-500 font-medium">Loading services...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#e8d8bc] bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff4de]">
              <Search className="h-8 w-8 text-[#f59e0b]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">No services found</h3>
            <p className="text-gray-500">Try changing filters and search again.</p>
          </div>
        ) : viewMode === "map" ? (
          <div className="rounded-3xl border border-[#e8d8bc] bg-white p-4 md:p-6">
            <ProviderNearbyShopsMap address={filters.location || undefined} mode="vet-hospital" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filtered.map((service, index) => {
                const category = service.category || service.catergory || "general";
                const style = categoryStyles[category] || {
                  chip: "bg-gray-100 text-gray-700",
                  panel: "from-[#f8fafc] to-[#eef2f7]",
                  icon: Tag,
                };
                const Icon = style.icon;

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    key={service._id}
                    className="group overflow-hidden rounded-3xl border border-[#eee1cb] bg-white transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,24,39,0.12)]"
                  >
                    <div className={`bg-gradient-to-r ${style.panel} p-5`}>
                      <div className="flex items-start justify-between">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
                          <Icon className="h-6 w-6 text-[#b45309]" />
                        </div>
                        <div className="flex gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${style.chip}`}>
                            {category}
                          </span>
                          {(service.rating || 0) >= 4.5 && (
                            <span className="rounded-full bg-[#fff4de] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#b45309]">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-1 line-clamp-1 text-xl font-extrabold text-[#111827] group-hover:text-[#f59e0b]">
                        {service.title}
                      </h3>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (service.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                          {service.rating ? `${service.rating.toFixed(1)} rating` : "No rating yet"}
                        </span>
                      </div>

                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {service.description || "No description available for this service."}
                      </p>

                      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#faf7f1] p-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-[#f59e0b]" />
                          {service.duration_minutes} min
                        </div>
                        <div className="flex items-center justify-end gap-2 text-gray-700">
                          <DollarSign className="h-4 w-4 text-[#16a34a]" />
                          <span className="font-bold">${service.price}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/user/services/${service._id}`}>
                          <button className="w-full rounded-xl border border-[#e8d8bc] bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#fff7ed]">
                            View Details
                          </button>
                        </Link>
                        <Link href={`/user/bookings/new?serviceId=${service._id}`}>
                          <button className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ef7f1a] py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(239,127,26,0.35)] transition-all hover:from-[#ef7f1a] hover:to-[#dd6b13]">
                            Book Now
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
