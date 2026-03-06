"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import {
  handleGetAllProviderServices,
  handleApproveProviderService,
  handleRejectProviderService,
} from "@/lib/actions/admin/provider-service-action";

interface ProviderService {
  _id: string;
  userId: {
    _id: string;
    email: string;
    Firstname?: string;
    Lastname?: string;
  };
  serviceType: string;
  verificationStatus: "pending" | "approved" | "rejected";
  documents: any[];
  registrationNumber?: string;
  bio?: string;
  experience?: string;
  createdAt: string;
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

function ServiceTypeBadge({ type }: { type: string }) {
  const cfg: Record<string, { bg: string; text: string }> = {
    vet: { bg: "bg-[var(--pc-teal-light)]", text: "text-[var(--pc-teal)]" },
    shop: { bg: "bg-[var(--pc-primary-light)]", text: "text-[var(--pc-primary)]" },
    babysitter: { bg: "bg-purple-50", text: "text-purple-600" },
  };
  const c = cfg[type] ?? { bg: "bg-gray-50", text: "text-gray-500" };
  return (
    <span className={`${c.bg} ${c.text} rounded-full px-3 py-1 text-xs font-semibold capitalize`}>
      {type}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProvidersTable() {
  const [providers, setProviders] = useState<ProviderService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProviders = async () => {
    setLoading(true);
    const result = await handleGetAllProviderServices();
    if (result.success) {
      const data = result.data || {};
      const items = Array.isArray((data as any).items) ? (data as any).items : Array.isArray(data) ? data : [];
      setProviders(items);
    } else {
      toast.error(result.message);
      setProviders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleApprove = async (data: any) => {
    const result = await handleApproveProviderService(data);
    if (result.success) {
      toast.success(result.message);
      fetchProviders();
    } else {
      toast.error(result.message);
    }
  };

  const handleReject = async (data: any) => {
    const result = await handleRejectProviderService(data);
    if (result.success) {
      toast.success(result.message);
      fetchProviders();
    } else {
      toast.error(result.message);
    }
  };

  const filteredProviders = (providers || []).filter(
    (provider) =>
      provider.userId?.Firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.userId?.Lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.verificationStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-[Fraunces] text-xl font-semibold text-[var(--pc-text)] flex items-center gap-2">
          Provider Service Verifications
          <span className="rounded-full bg-[var(--pc-cream)] border border-[var(--pc-border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--pc-text-muted)]">
            {providers.length}
          </span>
        </h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pc-text-muted)]" />
          <input
            type="text"
            placeholder="Search provider services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-[10px] border border-[var(--pc-border)] bg-[var(--pc-cream)] py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-[var(--pc-primary)] focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[20px] border border-[var(--pc-border)] overflow-hidden">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--pc-primary)] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--pc-cream)] border-b border-[var(--pc-border)]">
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Provider</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Email</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Service Type</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Status</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Submitted</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-[var(--pc-text-muted)]">
                      No provider services found
                    </td>
                  </tr>
                ) : (
                  filteredProviders.map((provider) => (
                    <tr
                      key={provider._id}
                      className="border-b border-[var(--pc-border)] last:border-0 hover:bg-[var(--pc-cream)] transition-colors"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-[var(--pc-text)]">
                        {provider.userId.Firstname && provider.userId.Lastname
                          ? `${provider.userId.Firstname} ${provider.userId.Lastname}`
                          : provider.userId.email}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--pc-text-muted)]">
                        {provider.userId.email}
                      </td>
                      <td className="px-5 py-4">
                        <ServiceTypeBadge type={provider.serviceType} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={provider.verificationStatus} />
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--pc-text-muted)]">
                        {formatDate(provider.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        {provider.verificationStatus === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(provider._id)}
                              className="rounded-[10px] border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 transition-all hover:border-green-600 hover:bg-green-600 hover:text-white active:scale-95"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(provider._id)}
                              className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white active:scale-95"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--pc-text-muted)]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


