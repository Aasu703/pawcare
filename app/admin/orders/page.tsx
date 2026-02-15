"use client";

import { useEffect, useState } from "react";
import { getAllOrders, updateOrder, deleteOrder } from "@/lib/api/admin/order";
import { toast } from "sonner";
import { ShoppingCart, Trash2, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];
const statusConfig: Record<string, { color: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-700" },
  processing: { color: "bg-blue-100 text-blue-700" },
  shipped: { color: "bg-purple-100 text-purple-700" },
  delivered: { color: "bg-green-100 text-green-700" },
  cancelled: { color: "bg-red-100 text-red-700" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllOrders(page, 20);
    if (res.success && res.data) {
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id: any, status: any) => {
    const res = await updateOrder(id, { status: status as any });
    if (res.success) {
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this order?")) return;
    const res = await deleteOrder(id);
    if (res.success) {
      toast.success("Order deleted");
      fetchOrders();
    } else {
      toast.error(res.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono">{order._id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm">
                    {order.items?.length || 0} item(s)
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">${order.totalAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`text-xs font-medium px-3 py-1 rounded-full border-0 cursor-pointer ${statusConfig[order.status]?.color || ""}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded text-sm bg-white border disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded text-sm bg-white border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

