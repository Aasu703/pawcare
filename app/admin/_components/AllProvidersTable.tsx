"use client";

import { useEffect, useState } from "react";
import { ExternalLink, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import {
  handleGetAllProviders,
  handleApproveProvider,
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

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AllProvidersTable() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadProviders = async () => {
    setLoading(true);
    const result = await handleGetAllProviders();
    if (result.success) {
      const data = result.data || {};
      const items = Array.isArray((data as any).items)
        ? (data as any).items
        : Array.isArray(data)
        ? data
        : [];
      setProviders(items);
    } else {
      setProviders([]);
      toast.error(result.message || "Failed to load providers");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const onApprove = async (id: string) => {
    const result = await handleApproveProvider(id);
    if (result.success) {
      toast.success(result.message || "Provider approved");
      loadProviders();
    } else {
      toast.error(result.message || "Failed to approve provider");
    }
  };

  const onReject = async (id: string) => {
    const result = await handleRejectProvider(id);
    if (result.success) {
      toast.success(result.message || "Provider rejected");
      loadProviders();
    } else {
      toast.error(result.message || "Failed to reject provider");
    }
  };

  const filtered = (providers || []).filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      p.businessName?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.providerType?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-[Fraunces] text-xl font-semibold text-[var(--pc-text)] flex items-center gap-2">
          All Providers
          <span className="rounded-full bg-[var(--pc-cream)] border border-[var(--pc-border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--pc-text-muted)]">
            {providers.length}
          </span>
        </h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pc-text-muted)]" />
          <input
            className="w-full rounded-[10px] border border-[var(--pc-border)] bg-[var(--pc-cream)] py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-[var(--pc-primary)] focus:bg-white"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[var(--pc-border)] overflow-hidden">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--pc-primary)] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--pc-cream)] border-b border-[var(--pc-border)]">
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Business</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Email</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Type</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Status</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Submitted</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Location</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-[var(--pc-text-muted)]">
                      No providers found
                    </td>
                  </tr>
                ) : (
                  filtered.map((provider) => {
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

                    return (
                      <tr
                        key={provider._id}
                        className="border-b border-[var(--pc-border)] last:border-0 hover:bg-[var(--pc-cream)] transition-colors"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-[var(--pc-text)]">
                          {provider.businessName}
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--pc-text-muted)]">
                          {provider.email}
                        </td>
                        <td className="px-5 py-4">
                          <TypeBadge type={provider.providerType} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={provider.status} />
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--pc-text-muted)]">
                          {formatDate(provider.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          {hasPinnedLocation ? (
                            <a
                              href={mapUrl || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--pc-teal)] hover:underline"
                            >
                              <MapPin className="h-3.5 w-3.5" />
                              📍 View on Map
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-sm text-[var(--pc-text-muted)]">— Not set</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {provider.status === "pending" ? (
                            <div className="flex items-center gap-2">
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
                          ) : (
                            <span className="text-xs text-[var(--pc-text-muted)]">—</span>
                          )}
                          {provider.status === "pending" && needsPinnedLocation && !hasPinnedLocation && (
                            <p className="mt-1.5 text-xs text-red-600">Map pin required</p>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
