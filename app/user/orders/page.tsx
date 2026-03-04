"use client";

import { useEffect, useState } from "react";
import { getMyOrders, deleteOrder } from "@/lib/api/user/order";
import { createReview, getMyReviews } from "@/lib/api/user/review";
import { getProductById } from "@/lib/api/public/product";
import { addAppNotification } from "@/lib/notifications/app-notifications";
import { toast } from "sonner";
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, Star, X } from "lucide-react";
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
  const [productReviewMap, setProductReviewMap] = useState<Record<string, any>>({});
  const [productProviderMap, setProductProviderMap] = useState<Record<string, string>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const getEntityId = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value?._id) return getEntityId(value._id);
    if (value?.id) return getEntityId(value.id);
    if (typeof value?.toHexString === "function") return value.toHexString();
    if (typeof value?.toString === "function") {
      const stringified = value.toString();
      return stringified === "[object Object]" ? "" : stringified;
    }
    return "";
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const loadProviderMapForOrders = async (ordersList: any[]) => {
    const productIds = Array.from(
      new Set(
        ordersList
          .flatMap((order) => (Array.isArray(order?.items) ? order.items : []))
          .map((item) => getEntityId(item?.productId))
          .filter(Boolean),
      ),
    );

    if (!productIds.length) {
      setProductProviderMap({});
      return;
    }

    const entries = await Promise.all(
      productIds.map(async (productId) => {
        const productRes = await getProductById(productId);
        if (productRes.success && productRes.data) {
          const providerId = getEntityId(productRes.data?.providerId || productRes.data?.provider?._id);
          return [productId, providerId] as const;
        }
        return [productId, ""] as const;
      }),
    );

    setProductProviderMap(
      Object.fromEntries(entries.filter(([, providerId]) => Boolean(providerId))),
    );
  };

  const fetchOrders = async () => {
    setLoading(true);
    const [ordersRes, reviewsRes] = await Promise.all([getMyOrders(), getMyReviews()]);

    if (ordersRes.success && ordersRes.data) {
      const ordersList = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      setOrders(ordersList);
      await loadProviderMapForOrders(ordersList);
    } else {
      toast.error(ordersRes.message);
    }

    if (reviewsRes.success && reviewsRes.data) {
      const nextMap = (Array.isArray(reviewsRes.data) ? reviewsRes.data : []).reduce(
        (acc: Record<string, any>, review: any) => {
          const productId = getEntityId(review?.productId);
          if (productId) {
            acc[productId] = review;
          }
          return acc;
        },
        {},
      );
      setProductReviewMap(nextMap);
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

  const openReviewModal = (item: any) => {
    setSelectedItem(item);
    setReviewForm({ rating: 5, comment: "" });
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedItem(null);
    setReviewForm({ rating: 5, comment: "" });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const productId = getEntityId(selectedItem?.productId);
    if (!productId) {
      toast.error("Product details are missing");
      return;
    }

    const providerId = productProviderMap[productId];
    if (!providerId) {
      toast.error("Provider details are not available for this product");
      return;
    }
    const payload: Record<string, any> = {
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim() || undefined,
      productId,
      providerId,
      reviewType: "product",
    };

    setSubmittingReview(true);
    const res = await createReview(payload);
    if (res.success) {
      toast.success("Thanks for rating your purchase");
      setProductReviewMap((prev) => ({
        ...prev,
        [productId]: res.data ?? { ...payload, _id: `temp-${productId}` },
      }));
      closeReviewModal();
    } else {
      toast.error(res.message);
    }
    setSubmittingReview(false);
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--pc-teal)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--pc-teal-dark)]">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track your purchases</p>
        </div>
        <Link
          href="/user/shop"
          className="bg-[var(--pc-teal)] text-white px-4 py-2 rounded-lg hover:bg-[var(--pc-teal-dark)] transition"
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
          <p className="text-muted-foreground mt-1">Start shopping to see your orders here</p>
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
                    <span className="text-sm text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--pc-teal)]">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="rounded-lg border border-gray-100 p-3">
                      <div className="flex justify-between text-sm">
                        <span>
                          {item.productName} x {item.quantity}
                        </span>
                        <span className="text-muted-foreground">
                          ${(Number(item.price ?? item.unitPrice ?? 0) * Number(item.quantity ?? 0)).toFixed(2)}
                        </span>
                      </div>

                      {order.status === "delivered" && (
                        <div className="mt-2">
                          {(() => {
                            const productId = getEntityId(item.productId);
                            const hasReview = Boolean(productReviewMap[productId]);
                            const canRate = Boolean(productProviderMap[productId]);

                            if (hasReview) {
                              return (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                  <Star className="h-3.5 w-3.5 fill-current" />
                                  Rated
                                </span>
                              );
                            }

                            return (
                              <button
                                onClick={() => openReviewModal(item)}
                                disabled={!canRate}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                              >
                                <Star className="h-4 w-4" />
                                {canRate ? "Rate Provider" : "Provider unavailable"}
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <p className="text-sm text-muted-foreground mb-3">
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

      {isReviewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Rate Provider</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedItem?.productName || "Share your shopping experience"}
                </p>
              </div>
              <button onClick={closeReviewModal} className="text-muted-foreground hover:text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                      className="rounded p-0.5"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Comment (optional)</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border px-3 py-2.5 focus:border-transparent focus:ring-2 focus:ring-[var(--pc-teal)]"
                  placeholder="Tell us what went well (or not)"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full rounded-lg bg-[var(--pc-teal)] py-2.5 font-semibold text-white hover:bg-[var(--pc-teal-dark)] disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Rating"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

