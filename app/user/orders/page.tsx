"use client";

import { useEffect, useState } from "react";
import { getMyOrders, deleteOrder } from "@/lib/api/user/order";
import { addAppNotification } from "@/lib/notifications/app-notifications";
import { toast } from "sonner";
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-4 w-4" /> },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: <Package className="h-4 w-4" /> },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700", icon: <Truck className="h-4 w-4" /> },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-4 w-4" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: <XCircle className="h-4 w-4" /> },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getMyOrders();
    if (res.success && res.data) {
      setOrders(Array.isArray(res.data) ? res.data : []);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const handleCancel = async (data: any) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    const res = await deleteOrder(data);
    if (res.success) {
      addAppNotification({
        audience: "user",
        type: "order",
        title: "Order cancelled",
        message: "A pending order was cancelled.",
        link: "/user/orders",
      });
      toast.success("Order cancelled");
      fetchOrders();
    } else {
      toast.error(res.message);
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f4f57]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0c4148]">My Orders</h1>
          <p className="text-gray-500 mt-1">Track your purchases</p>
        </div>
        <Link
          href="/user/shop"
          className="bg-[#0f4f57] text-white px-4 py-2 rounded-lg hover:bg-[#0c4148] transition"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === status
                ? "bg-[#0f4f57] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No orders found</h3>
          <p className="text-gray-400 mt-1">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            return (
              <div key={order._id} className="bg-white rounded-xl shadow border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                    <span className="text-sm text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[#0f4f57]">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span className="text-gray-500">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <p className="text-sm text-gray-500 mb-3">
                    <span className="font-medium">Ship to:</span> {order.shippingAddress}
                  </p>
                )}

                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

