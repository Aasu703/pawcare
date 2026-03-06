"use client";

import { useState, useEffect } from "react";
import { getAllServices, deleteService } from "@/lib/api/admin/service";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllServices(1, 100);
      setServices(res.data?.services || res.data || res.services || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService(data);
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--pc-primary)] border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Approval Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No services found</td></tr>
              ) : services.map((s) => {
                const statusColor =
                  s.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  s.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800';
                
                return (
                  <tr key={s._id} className="hover:bg-muted">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">{s.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {typeof s.providerId === "object" ? (s.providerId as any).businessName || (s.providerId as any).email : s.providerId || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{s.catergory || "-"}</td>
                    <td className="px-6 py-4 text-sm font-medium">${s.price}</td>
                    <td className="px-6 py-4 text-sm">{s.duration_minutes} min</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
                        {s.approvalStatus === 'approved' ? 'Approved' :
                         s.approvalStatus === 'rejected' ? 'Rejected' :
                         'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(s._id)} className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

