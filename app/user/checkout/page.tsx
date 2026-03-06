"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/user/order";
import { addAppNotification } from "@/lib/notifications/app-notifications";
import { toast } from "sonner";
import { ArrowLeft, ShoppingBag, MapPin } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ShippingLocationPicker = dynamic(
  () => import("@/components/ShippingLocationPicker"),
  { ssr: false, loading: () => <div className="h-[280px] rounded-xl border border-border bg-muted animate-pulse" /> }
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleLocationSelect = useCallback((address: string, _lat: number, _lng: number) => {
    setShippingAddress(address);
  }, []);

  useEffect(() => {
    const cartParam = searchParams.get("cart");
    if (cartParam) {
      try {
        setItems(JSON.parse(cartParam));
      } catch {
        toast.error("Invalid cart data");
      }
    }
  }, [searchParams]);

  // Normalize items: coerce prices and quantities to numbers and fill expected fields
  const normalizedItems = items.map((item) => ({
    ...item,
    productId: item.productId ?? item.id ?? "",
    productName: item.productName ?? item.name ?? "",
    unitPrice: Number(item.unitPrice ?? item.price ?? 0),
    quantity: Number(item.quantity ?? item.qty ?? 0),
  }));

  const validItems = normalizedItems.filter(
    (item) => Number.isFinite(item.unitPrice) && item.unitPrice >= 0 && Number.isFinite(item.quantity) && item.quantity > 0
  );

  const total = validItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }
    if (validItems.length === 0) {
      toast.error("No valid items in cart");
      return;
    }
    // Check for invalid items
    if (items.length !== validItems.length) {
      toast.error("Some items have invalid price or quantity.");
      return;
    }

    setLoading(true);
    // Map to backend shape: price (number) instead of unitPrice
    const payloadItems = validItems.map((it) => ({
      productId: it.productId,
      productName: it.productName,
      quantity: it.quantity,
      price: it.unitPrice,
    }));

    const res = await createOrder({
      items: payloadItems,
      totalAmount: Number(total),
      shippingAddress,
      notes: notes || undefined,
    });

    if (res.success) {
      addAppNotification({
        audience: "user",
        type: "order",
        title: "Order placed",
        message: `Your order totaling $${total.toFixed(2)} has been placed successfully.`,
        link: "/user/orders",
        dedupeKey: `order-created:${res.data?._id || new Date().toISOString()}`,
        pushToBrowser: true,
      });
      // Notify the provider about the new order
      addAppNotification({
        audience: "provider",
        type: "order",
        title: "New order received",
        message: `A new order totaling $${total.toFixed(2)} has been placed and is awaiting processing.`,
        link: "/provider/orders",
        dedupeKey: `provider-new-order:${res.data?._id || new Date().toISOString()}`,
        pushToBrowser: true,
      });
      toast.success("Order placed successfully!");
      router.push("/user/orders");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/user/shop" className="flex items-center gap-2 text-[var(--pc-teal)] mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <h1 className="text-3xl font-bold text-[var(--pc-teal-dark)] mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No items to checkout</p>
          <Link href="/user/shop" className="text-[var(--pc-teal)] hover:underline mt-2 inline-block">
            Go to shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {normalizedItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 font-bold text-lg">
                <span>Total</span>
                <span className="text-[var(--pc-teal)]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Shipping Address *
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--pc-teal)]"
                  placeholder="Enter your full shipping address"
                />
                <button
                  type="button"
                  onClick={() => setShowMap((v) => !v)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--pc-teal)] hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {showMap ? "Hide map" : "Pick from map"}
                </button>
                {showMap && (
                  <div className="mt-3">
                    <ShippingLocationPicker onLocationSelect={handleLocationSelect} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--pc-teal)]"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[var(--pc-primary)] text-[var(--pc-teal-dark)] py-3 rounded-lg font-bold text-lg hover:brightness-95 disabled:opacity-50 transition"
          >
            {loading ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
          </button>
        </div>
      )}
    </div>
  );
}

