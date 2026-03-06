"use client";

import { useEffect, useState } from "react";
import { getProviderOrders, updateProviderOrderStatus } from "@/lib/api/provider/order";
import { addAppNotification } from "@/lib/notifications/app-notifications";
import { toast } from "sonner";
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { canManageOrders } from "@/lib/provider-access";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-4 w-4" /> },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: <Package className="h-4 w-4" /> },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700", icon: <Truck className="h-4 w-4" /> },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-4 w-4" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: <XCircle className="h-4 w-4" /> },
};

const NEXT_STATUS: Record<string, string> = {
  pending: "processing",
  processing: "shipped",
  shipped: "delivered",
};

const NEXT_STATUS_LABEL: Record<string, string> = {
  pending: "Accept & Process",
  processing: "Mark as Shipped",
  shipped: "Mark as Delivered",
};

export default function ProviderOrdersPage() {
  const { user } = useAuth();
  const hasOrderAccess = canManageOrders(user?.providerType);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getProviderOrders();
    if (res.success && res.data) {
      setOrders(Array.isArray(res.data) ? res.data : []);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hasOrderAccess) fetchOrders();
    else setLoading(false);
  }, [hasOrderAccess]);

  const handleStatusUpdate = async (orderId: string, nextStatus: string) => {
    setUpdating(orderId);
    const res = await updateProviderOrderStatus(orderId, nextStatus);
    if (res.success) {
      addAppNotification({
        audience: "provider",
        providerType: user?.providerType ?? undefined,
        type: "order",
        title: "Order updated",
        message: `Order marked as ${nextStatus}.`,
        link: "/provider/orders",
      });
      toast.success(`Order marked as ${nextStatus}`);
      fetchOrders();
    } else {
      toast.error(res.message);
    }
    setUpdating(null);
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (!hasOrderAccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Order management is available for shop providers.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--pc-teal)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--pc-teal-dark)]">Customer Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and fulfill customer orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === status
                ? "bg-[var(--pc-teal)] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No orders found</h3>
          <p className="text-muted-foreground mt-1">Orders from customers will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const nextStatus = NEXT_STATUS[order.status];
            const nextLabel = NEXT_STATUS_LABEL[order.status];
            return (
              <div key={order._id} className="bg-white rounded-xl shadow border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--pc-teal)]">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>

                {/* Customer info */}
                {order.userId && (
                  <div className="mb-3 text-sm text-muted-foreground">
                    Customer: <span className="font-medium text-foreground">{order.userId?.name || order.userId?.email || "—"}</span>
                  </div>
                )}

                {/* Order items */}
                <div className="space-y-2 mb-4">
                  {(Array.isArray(order.items) ? order.items : []).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span>{item.productName || "Product"}</span>
                      <span className="text-muted-foreground">
                        {item.quantity} × ${Number(item.price || item.unitPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping address */}
                {order.shippingAddress && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4 bg-muted/50 rounded-lg p-3">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{order.shippingAddress}</span>
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div className="text-sm text-muted-foreground mb-4 bg-muted/50 rounded-lg p-3">
                    <span className="font-medium">Notes:</span> {order.notes}
                  </div>
                )}

                {/* Status tracking */}
                <OrderTracker currentStatus={order.status} />

                {/* Action buttons */}
                {nextStatus && order.status !== "cancelled" && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleStatusUpdate(order._id, nextStatus)}
                      disabled={updating === order._id}
                      className="bg-[var(--pc-teal)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--pc-teal-dark)] transition disabled:opacity-50"
                    >
                      {updating === order._id ? "Updating..." : nextLabel}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderTracker({ currentStatus }: { currentStatus: string }) {
  const steps = ["pending", "processing", "shipped", "delivered"];
  const isCancelled = currentStatus === "cancelled";
  const currentIndex = steps.indexOf(currentStatus);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
        <XCircle className="h-4 w-4" />
        This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-4">
      {steps.map((step, idx) => {
        const reached = idx <= currentIndex;
        const config = statusConfig[step];
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  reached
                    ? "bg-[var(--pc-teal)] text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${reached ? "text-[var(--pc-teal-dark)]" : "text-muted-foreground"}`}>
                {config.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 -mt-4 ${
                  idx < currentIndex ? "bg-[var(--pc-teal)]" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
