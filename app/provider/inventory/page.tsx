"use client";

import { useState, useEffect } from "react";
import { getInventoryByProvider, createInventory, updateInventory, deleteInventory } from "@/lib/api/provider/provider";
import { Plus, Pencil, Trash2, X, Package, Minus } from "lucide-react";
import Image from "next/image";
import { addAppNotification } from "@/lib/notifications/app-notifications";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { canManageInventory } from "@/lib/provider-access";

export default function ProviderInventoryPage() {
  const { user } = useAuth();
  const providerType = user?.providerType;
  const hasInventoryAccess = canManageInventory(providerType);
  const [items, setItems] = useState<any[]>([]);
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

  const providerId = user?._id || user?.id || "";

  async function loadItems() {
    setLoading(true);
    const res = await getInventoryByProvider(providerId);
    if (res.success && res.data) {
      const nextItems = Array.isArray(res.data) ? res.data : [];
      setItems(nextItems);

      for (const item of nextItems) {
        const quantity = Number(item?.quantity || 0);
        if (quantity <= 5) {
          addAppNotification({
            audience: "provider",
            providerType: "shop",
            type: "order",
            title: quantity === 0 ? "Out of stock item" : "Low stock alert",
            message: `${item?.product_name || "Product"} has ${
              quantity === 0 ? "no remaining stock" : `${quantity} units left`
            }.`,
            link: "/provider/inventory",
            dedupeKey: `shop-stock-alert:${item?._id || item?.id}:${quantity}`,
            pushToBrowser: true,
          });
        }
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!hasInventoryAccess) {
      setLoading(false);
      return;
    }
    if (providerId) loadItems();
  }, [providerId, hasInventoryAccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingId) {
      res = await updateInventory(editingId, form);
    } else {
      res = await createInventory({ ...form, providerId });
    }
    if (res.success) {
      addAppNotification({
        audience: "provider",
        providerType: "shop",
        type: "general",
        title: editingId ? "Inventory item updated" : "Inventory item added",
        message: `${form.product_name || "Product"} ${
          editingId ? "updated" : "added"
        } successfully.`,
        link: "/provider/inventory",
      });
      toast.success(editingId ? "Item updated!" : res.message || "Item added!");
      resetForm();
      loadItems();
    } else {
      toast.error(res.message);
    }
  };

  const handleEdit = (data: any) => {
    setEditingId(data._id);
    setForm({
      product_name: data.product_name,
      description: data.description || "",
      quantity: data.quantity || 0,
      price: data.price || 0,
      category: data.category || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this inventory item?")) return;
    const res = await deleteInventory(data);
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

  const CATEGORIES = [
    { value: "food", label: "🍖 Food" },
    { value: "medicine", label: "💊 Medicine" },
    { value: "toys", label: "🎾 Toys" },
    { value: "grooming", label: "✂️ Grooming" },
    { value: "accessories", label: "🏠 Accessories" },
    { value: "other", label: "Other" },
  ];

  if (!hasInventoryAccess) {
    return (
      <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-8 text-center">
        <Package className="h-10 w-10 text-[var(--pc-text-muted)] mx-auto mb-3" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-foreground mb-2">Inventory Not Available</h1>
        <p className="text-[var(--pc-text-muted)] text-sm">
          Only shop owners can manage products. Vet and groomer providers should use Services and Bookings.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-[var(--pc-text-muted)] text-sm mt-1">Track your supplies and equipment</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[var(--pc-primary)] text-white px-5 py-2.5 rounded-[12px] font-semibold text-sm hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] w-full max-w-[520px] mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="relative px-6 pt-6 pb-8 overflow-hidden" style={{ background: "linear-gradient(135deg, #E8855A, #C96A3F)" }}>
              <div className="absolute -top-[30px] -right-[30px] w-[120px] h-[120px] bg-white/10 rounded-full" />
              <div className="absolute -bottom-[20px] left-[40px] w-[80px] h-[80px] bg-white/[0.08] rounded-full" />
              <button type="button" onClick={resetForm} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors">
                <X className="h-4 w-4 text-white" />
              </button>
              <div className="relative z-10">
                <span className="text-2xl mb-2 block">🛒</span>
                <h2 className="font-[var(--font-display)] text-xl text-white font-semibold">{editingId ? "Edit Inventory Item" : "Add Inventory Item"}</h2>
                <p className="text-sm text-white/70 mt-1">Fill in product details below</p>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
              {/* Product Name */}
              <div>
                <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Product Name</label>
                <input type="text" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} placeholder="e.g. Premium Dog Food" className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]" required />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief description of this product" className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 resize-none placeholder:text-[var(--pc-text-muted)]" />
              </div>

              {/* Quantity + Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Quantity</label>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setForm({ ...form, quantity: Math.max(0, form.quantity - 1) })} className="w-8 h-8 rounded-[8px] bg-[var(--pc-cream)] border border-[var(--pc-border)] font-semibold text-foreground hover:bg-[var(--pc-primary-light)] hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)] transition-all flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} className="flex-1 border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-3 py-2.5 text-sm text-center focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="0" required />
                    <button type="button" onClick={() => setForm({ ...form, quantity: form.quantity + 1 })} className="w-8 h-8 rounded-[8px] bg-[var(--pc-cream)] border border-[var(--pc-border)] font-semibold text-foreground hover:bg-[var(--pc-primary-light)] hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)] transition-all flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Price ($)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-2.5 text-sm focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="0" />
                </div>
              </div>

              {/* Category pills */}
              <div>
                <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.value} type="button" onClick={() => setForm({ ...form, category: cat.value })}
                      className={`border rounded-full px-3 py-1.5 text-sm cursor-pointer transition-all duration-200 ${form.category === cat.value ? "bg-[var(--pc-primary)] text-white border-[var(--pc-primary)]" : "border-[var(--pc-border)] text-foreground hover:border-[var(--pc-primary)] hover:bg-[var(--pc-primary-light)]"}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-[var(--pc-border)] -mx-6 px-6 pt-4 mt-1 flex gap-3">
                <button type="button" onClick={resetForm} className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] py-2.5 text-sm font-semibold text-[var(--pc-text-muted)] hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)] hover:bg-[var(--pc-primary-light)] transition-all duration-200">Cancel</button>
                <button type="submit" className="w-full bg-[var(--pc-primary)] text-white rounded-[12px] py-2.5 text-sm font-semibold hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200">
                  {editingId ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Inventory Grid ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--pc-primary)] border-t-transparent"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[20px] border border-[var(--pc-border)]">
          <Image src="/images/pawcare.png" alt="No inventory" width={120} height={120} className="mx-auto mb-4 opacity-60" />
          <p className="font-[var(--font-display)] text-lg font-semibold text-foreground">No inventory items yet</p>
          <p className="text-sm text-[var(--pc-text-muted)] mt-1">Start tracking your supplies</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const statusColor =
              item.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
              item.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-amber-100 text-amber-800';

            return (
              <div key={item._id} className="bg-white rounded-[20px] border border-[var(--pc-border)] p-5 hover:shadow-md hover:border-[var(--pc-primary)]/30 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.product_name}</h3>
                    {item.description && <p className="text-xs text-[var(--pc-text-muted)] mt-0.5 line-clamp-2">{item.description}</p>}
                    <p className="text-2xl font-bold text-[var(--pc-primary)] mt-2">
                      {item.quantity ?? 0} <span className="text-sm font-normal text-[var(--pc-text-muted)]">units</span>
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(item)} className="rounded-full p-2 bg-[var(--pc-cream)] hover:bg-[var(--pc-primary-light)] hover:text-[var(--pc-primary)] transition-all"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(item._id)} className="rounded-full p-2 bg-[var(--pc-cream)] hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                {item.price ? <p className="text-sm font-semibold text-[var(--pc-teal)] mt-2">${item.price}</p> : null}
                {item.category && (
                  <span className="inline-block mt-2 text-xs bg-[var(--pc-cream)] text-[var(--pc-text-muted)] rounded-full px-2.5 py-0.5 border border-[var(--pc-border)]">{item.category}</span>
                )}
                <div className="mt-3 pt-3 border-t border-[var(--pc-border)]">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
                    {item.approvalStatus === 'approved' ? 'Approved' :
                     item.approvalStatus === 'rejected' ? 'Rejected' :
                     'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

