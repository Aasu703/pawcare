"use client";

import { useEffect, useState } from "react";
import { CheckCircle, ExternalLink, MapPin, Search, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "react-toastify";
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
    <div className="rounded-xl border bg-card p-6 shadow-sm mt-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Providers</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Business</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Submitted</th>
                <th className="pb-3 font-medium">Verification</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
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
                    <tr key={provider._id} className="border-b last:border-0 align-top">
                    <td className="py-4">
                      <div className="font-medium">{provider.businessName}</div>
                      <div className="text-sm text-muted-foreground">{provider.email}</div>
                    </td>
                    <td className="py-4 text-muted-foreground">{provider.email}</td>
                    <td className="py-4 capitalize">{provider.providerType || "-"}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${{
                          approved: "bg-green-100 text-green-700",
                          rejected: "bg-red-100 text-red-700",
                          pending: "bg-yellow-100 text-yellow-700",
                        }[provider.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {provider.status?.charAt(0).toUpperCase() + (provider.status?.slice(1) || "")}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-4 text-sm">
                      {provider.pawcareVerified && (provider.providerType === "shop" || provider.providerType === "vet") ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {provider.providerType === "shop" ? "PawCare Verified Shop" : "PawCare Verified Vet"}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {provider.locationVerified ? "Location verified" : "Not verified"}
                        </span>
                      )}
                      {mapUrl ? (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#0f4f57] hover:underline"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          View Pin
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <p className="mt-2 text-xs text-red-600">No map pin</p>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        {provider.status === "pending" && (
                          <>
                            <button
                              onClick={() => onApprove(provider._id)}
                              disabled={needsPinnedLocation && !hasPinnedLocation}
                              className="rounded-lg p-2 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </button>
                            <button onClick={() => onReject(provider._id)} className="rounded-lg p-2 hover:bg-red-50" title="Reject">
                              <XCircle className="h-5 w-5 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                      {provider.status === "pending" && needsPinnedLocation && !hasPinnedLocation ? (
                        <p className="mt-2 text-xs text-red-600">Map pin required before approval.</p>
                      ) : null}
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
  );
}
