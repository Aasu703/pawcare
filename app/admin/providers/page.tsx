"use client";

import { useEffect, useState } from "react";
import { ProviderAccountsTable, AllProvidersTable, ProvidersTable } from "../_components";
import {
  handleGetProvidersByStatus,
  handleGetAllProviders,
} from "@/lib/actions/admin/provider-action";
import { handleGetAllProviderServices } from "@/lib/actions/admin/provider-service-action";

export default function ProvidersPage() {
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    const load = async () => {
      const [pendingRes, allRes, servicesRes] = await Promise.all([
        handleGetProvidersByStatus("pending"),
        handleGetAllProviders(),
        handleGetAllProviderServices(),
      ]);
      const pendingCount = pendingRes.success
        ? (Array.isArray(pendingRes.data) ? pendingRes.data : []).length
        : 0;
      const allItems = allRes.success
        ? Array.isArray((allRes.data as any)?.items)
          ? (allRes.data as any).items
          : Array.isArray(allRes.data)
          ? allRes.data
          : []
        : [];
      const serviceItems = servicesRes.success
        ? Array.isArray((servicesRes.data as any)?.items)
          ? (servicesRes.data as any).items
          : Array.isArray(servicesRes.data)
          ? servicesRes.data
          : []
        : [];
      const approvedCount =
        allItems.filter((p: any) => p.status === "approved").length +
        serviceItems.filter((s: any) => s.verificationStatus === "approved").length;
      const rejectedCount =
        allItems.filter((p: any) => p.status === "rejected").length +
        serviceItems.filter((s: any) => s.verificationStatus === "rejected").length;
      setCounts({ pending: pendingCount, approved: approvedCount, rejected: rejectedCount });
    };
    load();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--pc-primary-light)] text-2xl">
              🛡️
            </div>
            <div>
              <h1 className="font-[Fraunces] text-2xl font-semibold text-[var(--pc-text)]">
                Provider Verifications
              </h1>
              <p className="text-sm text-[var(--pc-text-muted)]">
                Review and approve provider applications
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600">
              {counts.pending} Pending
            </span>
            <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-600">
              {counts.approved} Approved
            </span>
            <span className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-500">
              {counts.rejected} Rejected
            </span>
          </div>
        </div>
      </div>

      <ProviderAccountsTable />
      <AllProvidersTable />
      <ProvidersTable />
    </div>
  );
}

