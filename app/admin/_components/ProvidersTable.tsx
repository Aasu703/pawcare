"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
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
  documents: string[];
  registrationNumber?: string;
  bio?: string;
  experience?: string;
  createdAt: string;
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
      // backend may return a paged object { items, total, page, ... }
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

  const handleCreate = () => {
    // Provider services are created by providers, not admins
  };

  const handleEdit = (provider: ProviderService) => {
    // Provider services are edited by providers, not admins
  };

  const handleDelete = async (id: string) => {
    // Provider services are not deleted by admins
  };

  const handleApprove = async (id: string) => {
    const result = await handleApproveProviderService(id);
    if (result.success) {
      toast.success(result.message);
      fetchProviders();
    } else {
      toast.error(result.message);
    }
  };

  const handleReject = async (id: string) => {
    const result = await handleRejectProviderService(id);
    if (result.success) {
      toast.success(result.message);
      fetchProviders();
    } else {
      toast.error(result.message);
    }
  };

  const handleSubmit = async (data: FormData) => {
    let result;
    if (modalMode === "create") {
      result = await handleCreateProvider(data);
    } else if (selectedProvider) {
      result = await handleUpdateProvider(selectedProvider._id, data);
    }

    if (result?.success) {
      toast.success(result.message);
      setModalOpen(false);
      fetchProviders();
    } else {
      toast.error(result?.message || "Operation failed");
    }
  };

  const filteredProviders = (providers || []).filter(
    (provider) =>
      (provider.userId?.Firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       provider.userId?.Lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       provider.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       provider.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       provider.verificationStatus?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const specialtyColors: Record<string, string> = {
    general: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
    grooming: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
    veterinary: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    training: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    boarding: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    daycare: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-primary",
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Provider Service Verifications</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search provider services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border bg-background py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Service Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Submitted</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No provider services found
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => (
                  <tr key={provider._id} className="border-b last:border-0">
                    <td className="py-4 font-medium">
                      {provider.userId.Firstname && provider.userId.Lastname 
                        ? `${provider.userId.Firstname} ${provider.userId.Lastname}`
                        : provider.userId.email}
                    </td>
                    <td className="py-4 text-muted-foreground">{provider.userId.email}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        provider.serviceType === "vet" ? "bg-blue-100 text-blue-700" :
                        provider.serviceType === "shop" ? "bg-purple-100 text-purple-700" :
                        provider.serviceType === "babysitter" ? "bg-pink-100 text-pink-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {provider.serviceType}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          provider.verificationStatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : provider.verificationStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {provider.verificationStatus.charAt(0).toUpperCase() + provider.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-1">
                        {provider.verificationStatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(provider._id)}
                              className="rounded-lg p-2 hover:bg-green-50"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </button>
                            <button
                              onClick={() => handleReject(provider._id)}
                              className="rounded-lg p-2 hover:bg-red-50"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </button>
                          </>
                        )}
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

