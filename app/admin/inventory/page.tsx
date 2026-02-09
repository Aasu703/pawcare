"use client";

import { useState, useEffect } from "react";
import { getAllInventory, deleteInventory } from "@/lib/api/admin/inventory";
import { Inventory } from "@/lib/types/provider";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AdminInventoryPage() {
  const [items, setItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllInventory(1, 100);
      setItems(res.data || res.inventory || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inventory item?")) return;
    try {
      await deleteInventory(id);
      toast.success("Item deleted");
      load();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const isLow = (item: Inventory) => item.minThreshold && item.quantity <= item.minThreshold;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">View all provider inventory across the platform</p>
      </div>

      {/* Low stock summary */}
      {items.filter(isLow).length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">Low Stock Items</p>
            <p className="text-sm text-amber-600">{items.filter(isLow).length} items are below their minimum threshold</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No inventory items found</td></tr>
              ) : items.map((item) => (
                <tr key={item._id} className={`hover:bg-gray-50 ${isLow(item) ? "bg-amber-50/50" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{item.itemName}</div>
                    {item.notes && <div className="text-xs text-gray-400">{item.notes}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {typeof item.providerId === "object" ? (item.providerId as any).businessName || (item.providerId as any).email : item.providerId || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.minThreshold || "-"}</td>
                  <td className="px-6 py-4">
                    {isLow(item) ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Low</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">OK</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
