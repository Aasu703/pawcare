"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
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
  experience?: string;
  clinicOrShopName?: string;
  panNumber?: string;
  createdAt?: string;
};

export default function ProviderAccountsTable() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);

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

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm mt-6">
      <h2 className="text-xl font-semibold mb-4">Provider Account Verification</h2>
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
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Verification Details</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No pending provider submissions
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider._id} className="border-b last:border-0 align-top">
                    <td className="py-4">
                      <div className="font-medium">{provider.businessName}</div>
                      <div className="text-sm text-muted-foreground">{provider.email}</div>
                    </td>
                    <td className="py-4 capitalize">{provider.providerType === "babysitter" ? "groomer" : provider.providerType}</td>
                    <td className="py-4 text-sm">
                      <div><span className="font-medium">Clinic/Shop:</span> {provider.clinicOrShopName || "-"}</div>
                      <div><span className="font-medium">Experience:</span> {provider.experience || "-"}</div>
                      <div><span className="font-medium">Certification:</span> {provider.certification || "-"}</div>
                      <div><span className="font-medium">PAN:</span> {provider.panNumber || "-"}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprove(provider._id)}
                          className="rounded-lg p-2 hover:bg-green-50"
                          title="Approve"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </button>
                        <button
                          onClick={() => onReject(provider._id)}
                          className="rounded-lg p-2 hover:bg-red-50"
                          title="Reject"
                        >
                          <XCircle className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
