"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  handleGetAllProviders,
  handleCreateProvider,
  handleUpdateProvider,
  handleDeleteProvider,
} from "@/lib/actions/admin/provider-action";
import ProviderModal from "./ProviderModal";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

interface Provider {
  _id: string;
  businessName: string;
  email: string;
  phone?: string;
  specialty?: string;
  address?: string;
  isActive?: boolean;
  providerType?: "shop" | "vet" | "babysitter";
  status?: "pending" | "approved" | "rejected";
}

export default function ProvidersTable() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const fetchProviders = async () => {
    setLoading(true);
    const result = await handleGetAllProviders();
    if (result.success) {
      setProviders(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleCreate = () => {
    setSelectedProvider(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this provider?")) return;

    const result = await handleDeleteProvider(id);
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

  const filteredProviders = providers.filter(
    (provider) =>
      provider.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.specialty &&
        provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <h2 className="text-xl font-semibold">Providers Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border bg-background py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Add Provider
          </button>
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
                <th className="pb-3 font-medium">Specialty</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No providers found
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => (
                  <tr key={provider._id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{provider.businessName}</td>
                    <td className="py-4 text-muted-foreground">{provider.email}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          specialtyColors[provider.specialty?.toLowerCase() || "general"] ||
                          specialtyColors.general
                        }`}
                      >
                        {provider.specialty || "General"}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {provider.phone || "-"}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          provider.isActive !== false
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {provider.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(provider)}
                          className="rounded-lg p-2 hover:bg-muted"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(provider._id)}
                          className="rounded-lg p-2 hover:bg-muted"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Modal */}
      <ProviderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        provider={selectedProvider}
        mode={modalMode}
      />
    </div>
  );
}

