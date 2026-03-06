"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, FileText, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  handleApproveProvider,
  handleGetProvidersByStatus,
  handleRejectProvider,
} from "@/lib/actions/admin/provider-action";

type Provider = {
  _id: string;
  businessName: string;
  email: string;
  phone?: string;
  providerType?: "shop" | "vet" | "babysitter";
  status: "pending" | "approved" | "rejected";
  certification?: string;
  certificationDocumentUrl?: string;
  experience?: string;
  clinicOrShopName?: string;
  panNumber?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  locationVerified?: boolean;
  pawcareVerified?: boolean;
  createdAt?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateText(text: string, maxLen: number) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "…";
}

function TypeBadge({ type }: { type?: string }) {
  const cfg: Record<string, { label: string; bg: string; text: string }> = {
    vet: { label: "🏥 Vet", bg: "bg-[var(--pc-teal-light)]", text: "text-[var(--pc-teal)]" },
    shop: { label: "🛒 Shop", bg: "bg-[var(--pc-primary-light)]", text: "text-[var(--pc-primary)]" },
    babysitter: { label: "✂️ Groomer", bg: "bg-purple-50", text: "text-purple-600" },
  };
  const c = cfg[type || ""] ?? { label: type || "—", bg: "bg-gray-50", text: "text-gray-500" };
  return (
    <span className={`${c.bg} ${c.text} rounded-full px-3 py-1 text-xs font-semibold`}>
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    approved: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    rejected: { bg: "bg-red-50", text: "text-red-500", border: "border-red-200" },
  };
  const c = cfg[status] ?? { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" };
  return (
    <span className={`${c.bg} ${c.text} border ${c.border} rounded-full px-3 py-1 text-xs font-semibold capitalize`}>
      {status}
    </span>
  );
}

export default function ProviderAccountsTable() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandedExpIds, setExpandedExpIds] = useState<Set<string>>(new Set());

  const loadProviders = async () => {
    setLoading(true);
    const result = await handleGetProvidersByStatus("pending");
    if (result.success) {
      setProviders(Array.isArray(result.data) ? result.data : []);
    } else {
      setProviders([]);
      toast.error(result.message || "Failed to load providers");
    }
    setLoading(false);
  };

  useEffect(() => {
    const run = async () => {
      await loadProviders();
    };
    run();
  }, []);

  const onApprove = async (id: string) => {
    const result = await handleApproveProvider(id);
    if (result.success) {
      toast.success(result.message);
      loadProviders();
    } else {
      toast.error(result.message);
    }
  };

  const onReject = async (id: string) => {
    const result = await handleRejectProvider(id);
    if (result.success) {
      toast.success(result.message);
      loadProviders();
    } else {
      toast.error(result.message);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExperience = (id: string) => {
    setExpandedExpIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mb-8">
      <h2 className="font-[Fraunces] text-xl font-semibold text-[var(--pc-text)] mb-4 flex items-center gap-2">
        Provider Account Verification
        {providers.length > 0 && (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
            {providers.length}
          </span>
        )}
      </h2>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--pc-primary)] border-t-transparent" />
        </div>
      ) : providers.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-8 text-center text-sm text-[var(--pc-text-muted)]">
          No pending provider submissions
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => {
            const isExpanded = expandedIds.has(provider._id);
            const latitude = provider.location?.latitude;
            const longitude = provider.location?.longitude;
            const hasPinnedLocation =
              typeof latitude === "number" &&
              Number.isFinite(latitude) &&
              typeof longitude === "number" &&
              Number.isFinite(longitude);
            const needsPinnedLocation =
              provider.providerType === "shop" || provider.providerType === "vet";
            const mapUrl = hasPinnedLocation
              ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`
              : null;
            const expIsExpanded = expandedExpIds.has(provider._id);

            return (
              <div
                key={provider._id}
                className="bg-white rounded-[20px] border border-[var(--pc-border)] shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-[var(--pc-cream)] transition-colors"
                  onClick={() => toggleExpand(provider._id)}
                >
                  {/* Avatar */}
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-[var(--pc-primary-light)]">
                    <span className="font-[Fraunces] text-sm font-semibold text-[var(--pc-primary)]">
                      {getInitials(provider.businessName || "?")}
                    </span>
                  </div>

                  {/* Business Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--pc-text)] truncate">
                      {provider.businessName}
                    </p>
                    <p className="text-xs text-[var(--pc-text-muted)] truncate">
                      {provider.email}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="hidden sm:flex items-center gap-2">
                    <TypeBadge type={provider.providerType} />
                    <StatusBadge status={provider.status} />
                  </div>

                  {/* Submitted date */}
                  <span className="hidden md:block text-xs text-[var(--pc-text-muted)] whitespace-nowrap">
                    {formatDate(provider.createdAt)}
                  </span>

                  {/* Expand toggle */}
                  <ChevronDown
                    className={`h-4 w-4 text-[var(--pc-text-muted)] transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />

                  {/* Actions */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onApprove(provider._id)}
                      disabled={needsPinnedLocation && !hasPinnedLocation}
                      className="rounded-[10px] border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 transition-all hover:border-green-600 hover:bg-green-600 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => onReject(provider._id)}
                      className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white active:scale-95"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>

                {/* Mobile-only badges */}
                <div className="flex sm:hidden items-center gap-2 px-6 pb-3">
                  <TypeBadge type={provider.providerType} />
                  <StatusBadge status={provider.status} />
                  <span className="ml-auto text-xs text-[var(--pc-text-muted)]">
                    {formatDate(provider.createdAt)}
                  </span>
                </div>

                {needsPinnedLocation && !hasPinnedLocation && (
                  <div className="mx-6 mb-3 rounded-[10px] bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
                    📍 Pin is required before map verification approval.
                  </div>
                )}

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="border-t border-[var(--pc-border)] bg-[var(--pc-cream)] p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Clinic / Shop Name */}
                      <div className="bg-white rounded-[16px] border border-[var(--pc-border)] p-4">
                        <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] font-semibold mb-1">
                          🏢 Clinic/Shop Name
                        </p>
                        <p className="text-sm text-[var(--pc-text)] font-medium">
                          {provider.clinicOrShopName || <span className="text-[var(--pc-text-muted)]">Not provided</span>}
                        </p>
                      </div>

                      {/* Experience */}
                      <div className="bg-white rounded-[16px] border border-[var(--pc-border)] p-4 sm:col-span-2 lg:col-span-1">
                        <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] font-semibold mb-1">
                          📋 Experience
                        </p>
                        {provider.experience ? (
                          <>
                            {expIsExpanded ? (
                              <div className="max-h-[200px] overflow-y-auto text-sm text-[var(--pc-text)] font-medium whitespace-pre-wrap">
                                {provider.experience}
                              </div>
                            ) : (
                              <p className="text-sm text-[var(--pc-text)] font-medium line-clamp-3">
                                {truncateText(provider.experience, 150)}
                              </p>
                            )}
                            {provider.experience.length > 150 && (
                              <button
                                onClick={() => toggleExperience(provider._id)}
                                className="mt-1 text-xs font-semibold text-[var(--pc-teal)] hover:underline"
                              >
                                {expIsExpanded ? "Show less" : "Read more"}
                              </button>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-[var(--pc-text-muted)]">Not provided</p>
                        )}
                      </div>

                      {/* Certification */}
                      <div className="bg-white rounded-[16px] border border-[var(--pc-border)] p-4">
                        <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] font-semibold mb-1">
                          🏅 Certification
                        </p>
                        <p className="text-sm text-[var(--pc-text)] font-medium">
                          {provider.certification
                            ? provider.certification.split("\n")[0]
                            : <span className="text-[var(--pc-text-muted)]">Not provided</span>}
                        </p>
                        {provider.certificationDocumentUrl && (
                          <a
                            href={provider.certificationDocumentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-xs font-semibold text-[var(--pc-teal)] hover:underline"
                          >
                            View Certificate File →
                          </a>
                        )}
                      </div>

                      {/* PAN Number */}
                      <div className="bg-white rounded-[16px] border border-[var(--pc-border)] p-4">
                        <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] font-semibold mb-1">
                          🪪 PAN Number
                        </p>
                        <p className="text-sm text-[var(--pc-text)] font-medium">
                          {provider.panNumber || <span className="text-[var(--pc-text-muted)]">Not provided</span>}
                        </p>
                      </div>

                      {/* Pinned Location */}
                      <div className="bg-white rounded-[16px] border border-[var(--pc-border)] p-4">
                        <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] font-semibold mb-1">
                          📍 Pinned Location
                        </p>
                        {hasPinnedLocation ? (
                          <>
                            <p className="text-sm text-[var(--pc-text)] font-medium">
                              Lat: {latitude?.toFixed(3)} · Lng: {longitude?.toFixed(3)}
                            </p>
                            {provider.location?.address && (
                              <p className="text-xs text-[var(--pc-text-muted)] mt-0.5">
                                {provider.location.address}
                              </p>
                            )}
                            <a
                              href={mapUrl || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--pc-teal)] hover:underline"
                            >
                              Open in Maps →
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </>
                        ) : (
                          <p className="text-sm text-[var(--pc-text-muted)]">Not pinned</p>
                        )}
                      </div>
                    </div>

                    {/* Certificate file preview row */}
                    {provider.certificationDocumentUrl && (
                      <div className="mt-4 flex items-center gap-3 bg-white rounded-[12px] border border-[var(--pc-border)] p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--pc-primary-light)]">
                          <FileText className="h-4 w-4 text-[var(--pc-primary)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--pc-text)] truncate">
                          Certificate Document
                        </span>
                        <a
                          href={provider.certificationDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto text-xs font-semibold text-[var(--pc-teal)] hover:underline"
                        >
                          View File
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
