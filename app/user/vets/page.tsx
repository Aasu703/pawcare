"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  MapPin,
  Clock,
  Stethoscope,
  Scissors,
  Home as HomeIcon,
  ChevronRight,
  Loader2,
  Award,
  BadgeCheck,
  Banknote,
} from "lucide-react";
import {
  getVerifiedProviderLocations,
  type VerifiedProviderLocation,
} from "@/lib/api/public/provider";
import { API_CONFIG } from "@/lib/api/config";

type Category = "vet" | "shop" | "all";

export default function VetsPage() {
  const [providers, setProviders] = useState<VerifiedProviderLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("vet");

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    setLoading(true);
    const res = await getVerifiedProviderLocations();
    if (res.success && res.data) {
      setProviders(res.data);
    }
    setLoading(false);
  }

  const filtered = providers.filter((p) => {
    const matchesCategory =
      category === "all" || p.providerType === category;
    const matchesSearch =
      !search ||
      p.businessName.toLowerCase().includes(search.toLowerCase()) ||
      (p.degree ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.clinicOrShopName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { key: Category; label: string; icon: React.ReactNode }[] =
    [
      {
        key: "vet",
        label: "Veterinary",
        icon: <Stethoscope className="w-4 h-4" />,
      },
      {
        key: "shop",
        label: "Grooming & Boarding",
        icon: <Scissors className="w-4 h-4" />,
      },
      {
        key: "all",
        label: "All Providers",
        icon: <HomeIcon className="w-4 h-4" />,
      },
    ];

  const resultCount = filtered.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero header */}
      <div className="relative bg-linear-to-br from-[#0c4148] via-[#1E8F84] to-[#56C2B7] rounded-2xl p-8 pb-12 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-white/15 rounded-lg">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-200">
              PawCare Providers
            </span>
          </div>
          <h1 className="text-3xl font-black mb-1.5 tracking-tight">
            Find Trusted Care
          </h1>
          <p className="text-teal-100 text-sm max-w-md">
            Browse verified veterinarians, groomers, and boarding services for
            your beloved pets.
          </p>

          {/* Search bar */}
          <div className="mt-5 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-teal-200" />
            <input
              type="text"
              placeholder="Search by name, degree, clinic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-teal-200/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category tabs + result count */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                category === cat.key
                  ? "bg-[#1E8F84] text-white shadow-md shadow-teal-200/40"
                  : "bg-white text-stone-500 border border-stone-200 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
        {!loading && (
          <span className="text-xs font-semibold text-stone-400">
            {resultCount} provider{resultCount !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* Provider Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <div className="p-4 bg-teal-50 rounded-full mb-4">
            <Loader2 className="w-7 h-7 animate-spin text-teal-500" />
          </div>
          <p className="text-sm font-medium">Loading providers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <div className="p-4 bg-stone-100 rounded-full mb-4">
            <Stethoscope className="w-10 h-10 opacity-30" />
          </div>
          <p className="text-base font-bold text-stone-500">
            No providers found
          </p>
          <p className="text-sm">Try adjusting your search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((provider) => (
            <ProviderCard key={provider._id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProviderCard({ provider }: { provider: VerifiedProviderLocation }) {
  const imageUrl = provider.profileImageUrl
    ? provider.profileImageUrl.startsWith("http")
      ? provider.profileImageUrl
      : API_CONFIG.getImageUrl(provider.profileImageUrl)
    : null;

  return (
    <Link href={`/user/vets/${provider._id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-teal-200 shadow-sm hover:shadow-lg hover:shadow-teal-100/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="h-40 bg-linear-to-br from-teal-50 to-cyan-100 relative flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={provider.businessName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              {provider.providerType === "vet" ? (
                <Stethoscope className="w-10 h-10 text-teal-300" />
              ) : (
                <Scissors className="w-10 h-10 text-teal-300" />
              )}
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#1E8F84]">
              {provider.providerType === "vet" ? "Veterinary" : "Shop"}
            </span>
          </div>
          {/* Rating overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold">
              {(provider.rating ?? 0).toFixed(1)}
            </span>
            {(provider.ratingCount ?? 0) > 0 && (
              <span className="text-[10px] text-white/70">
                ({provider.ratingCount})
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-base text-stone-900 group-hover:text-[#1E8F84] transition-colors mb-0.5 truncate">
            {provider.businessName}
          </h3>

          {provider.degree && (
            <p className="text-xs font-semibold text-[#1E8F84] mb-0.5 truncate">
              {provider.degree}
            </p>
          )}

          {provider.certification && (
            <p className="text-[11px] text-teal-600/80 mb-2 truncate">
              {provider.certification}
            </p>
          )}

          {/* Tag chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {provider.experience && (
              <span className="inline-flex items-center gap-1 bg-teal-50 text-[#1E8F84] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                <Award className="w-3 h-3" />
                {provider.experience}
              </span>
            )}
            {provider.appointmentFee != null &&
              provider.appointmentFee > 0 && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  <Banknote className="w-3 h-3" />
                  LKR {provider.appointmentFee}
                </span>
              )}
          </div>

          {/* Working hours & location */}
          <div className="space-y-1 mb-3">
            {provider.workingHours && (
              <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">{provider.workingHours}</span>
              </span>
            )}
            {provider.location?.address && (
              <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{provider.location.address}</span>
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-sm font-bold text-[#1E8F84] group-hover:text-[#0c4148]">
              View Profile
            </span>
            <ChevronRight className="w-4 h-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
