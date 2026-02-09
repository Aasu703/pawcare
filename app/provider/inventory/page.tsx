"use client";

import { useState, useEffect } from "react";
import { getInventoryByProvider, createInventory, updateInventory, deleteInventory } from "@/lib/api/provider/provider";
import { Inventory } from "@/lib/types/provider";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { toast } from "sonner";

function getProviderId(): string {
  if (typeof window === "undefined") return "";
  try {
    const cookie = document.cookie.split("; ").find((c) => c.startsWith("user_data="));
    if (cookie) {
      const data = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
      return data._id || data.id || "";
    }
  } catch { /* empty */ }
  return "";
}

export default function ProviderInventoryPage() {
  const [items, setItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    product_name: "",
    description: "",
    quantity: 0,
    price: 0,
    category: "",
  });

  const providerId = getProviderId();

  useEffect(() => { if (providerId) loadItems(); }, [providerId]);

  const loadItems = async () => {
    setLoading(true);
    const res = await getInventoryByProvider(providerId);
    if (res.success && res.data) setItems(res.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingId) {
      res = await updateInventory(editingId, form);
    } else {
      res = await createInventory({ ...form, providerId });
    }
    if (res.success) {
      toast.success(editingId ? "Item updated!" : "Item added!");
      resetForm();
      loadItems();
    } else {
      toast.error(res.message);
    }
  };

  const handleEdit = (item: Inventory) => {
    setEditingId(item._id);
    setForm({
      product_name: item.product_name,
      description: item.description || "",
      quantity: item.quantity || 0,
      price: item.price || 0,
      category: item.category || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inventory item?")) return;
    const res = await deleteInventory(id);
    if (res.success) {
      toast.success("Item deleted");
      loadItems();
    } else {
      toast.error(res.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ product_name: "", description: "", quantity: 0, price: 0, category: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">Track your supplies and equipment</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#0f4f57] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0c4148] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editingId ? "Edit Item" : "Add Item"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent" min="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. food, medicine, equipment"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent" />
              </div>
              <button type="submit"
                className="w-full bg-[#0f4f57] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0c4148] transition-colors">
                {editingId ? "Update Item" : "Add Item"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg text-gray-500">No inventory items yet</p>
          <p className="text-sm text-gray-400 mt-1">Start tracking your supplies</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                  <p className="text-2xl font-bold text-[#0f4f57] mt-2">
                    {item.quantity ?? 0} <span className="text-sm font-normal text-gray-400">units</span>
                  </p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {item.price ? <p className="text-xs text-gray-400 mt-2">${item.price}</p> : null}
              {item.category && <p className="text-xs text-gray-400 mt-1">Category: {item.category}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
