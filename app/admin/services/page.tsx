"use client";

import { useState, useEffect } from "react";
import { getAllServices, deleteService } from "@/lib/api/admin/service";
import { Service } from "@/lib/types/service";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllServices(1, 100);
      setServices(res.data || res.services || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      toast.success("Service deleted");
      load();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all services across providers</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No services found</td></tr>
              ) : services.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-gray-400 truncate max-w-xs">{s.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {typeof s.providerId === "object" ? (s.providerId as any).businessName || (s.providerId as any).email : s.providerId || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{s.catergory || "-"}</td>
                  <td className="px-6 py-4 text-sm font-medium">${s.price}</td>
                  <td className="px-6 py-4 text-sm">{s.duration_minutes} min</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(s._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
