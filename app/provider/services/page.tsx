"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProviderServices, createProviderService, updateProviderService, deleteProviderService } from "@/lib/api/provider/provider";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { canManageServices, isVetProvider } from "@/lib/provider-access";

export default function ProviderServicesPage() {
  const { user } = useAuth();
  const providerType = user?.providerType;
  const hasServiceAccess = canManageServices(providerType);
  const vetOnly = isVetProvider(providerType);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    duration_minutes: 0,
    catergory: "" as "" | "grooming" | "boarding" | "vet",
  });

  async function loadServices() {
    setLoading(true);
    const res = await getProviderServices();
    if (res.success && res.data) setServices(res.data);
    setLoading(false);
  }

  useEffect(() => { if (hasServiceAccess) loadServices(); else setLoading(false); }, [hasServiceAccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      price: form.price,
      duration_minutes: form.duration_minutes,
      category: (vetOnly ? "vet" : form.catergory) || undefined,
    };
    // Ensure providerId is attached so backend can validate the provider
    if (user?._id || user?.id) {
      (payload as any).providerId = user._id || user.id;
    }
    let res;
    if (editingId) {
      res = await updateProviderService(editingId, payload);
    } else {
      res = await createProviderService(payload as any);
    }
    if (res.success) {
      toast.success(editingId ? "Service updated!" : "Service created!");
      resetForm();
      loadServices();
    } else {
      toast.error(res.message);
    }
  };

  const handleEdit = (data: any) => {
    setEditingId(data._id);
    setForm({
      title: data.title ?? "",
      description: data.description ?? "",
      price: data.price ?? 0,
      duration_minutes: data.duration_minutes ?? 30,
      catergory: data.catergory ?? data.category ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this service?")) return;
    const res = await deleteProviderService(data);
    if (res.success) {
      toast.success("Service deleted");
      loadServices();
    } else {
      toast.error(res.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", description: "", price: 0, duration_minutes: 0, catergory: vetOnly ? "vet" : "" });
  };

  const serviceList = Array.isArray(services) ? services : [];

  if (!hasServiceAccess) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Services Not Available</h1>
        <p className="text-gray-500">
          Shop owners cannot create service bookings. Use Inventory to add products for users.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-500 mt-1">Manage the services you offer</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#0f4f57] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0c4148] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editingId ? "Edit Service" : "Add Service"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: +e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input type="number" value={form.duration_minutes ?? 30} onChange={(e) => setForm({ ...form, duration_minutes: +e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent" min="1" required />
                </div>
              </div>
              {vetOnly ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value="Vet"
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.catergory ?? ""} onChange={(e) => setForm({ ...form, catergory: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent">
                    <option value="">Select category</option>
                    <option value="grooming">Grooming</option>
                    <option value="boarding">Boarding</option>
                  </select>
                </div>
              )}
              <button type="submit"
                className="w-full bg-[#0f4f57] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0c4148] transition-colors">
                {editingId ? "Update Service" : "Create Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Services Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : serviceList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <p className="text-lg text-gray-500">No services yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first service to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {serviceList.map((s, idx) => (
                <tr key={s._id || s.id || `${s.title || "service"}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{s.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{s.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{s.catergory || s.category || "-"}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${s.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.duration_minutes} min</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(s)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                    </div>
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

