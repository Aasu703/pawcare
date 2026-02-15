"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/user/order";
import { toast } from "sonner";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

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

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }
    if (items.length === 0) {
      toast.error("No items in cart");
      return;
    }

    setLoading(true);
    const res = await createOrder({
      items,
      shippingAddress,
      notes: notes || undefined,
    });

    if (res.success) {
      toast.success("Order placed successfully!");
      router.push("/user/orders");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/user/shop" className="flex items-center gap-2 text-[#0f4f57] mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <h1 className="text-3xl font-bold text-[#0c4148] mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No items to checkout</p>
          <Link href="/user/shop" className="text-[#0f4f57] hover:underline mt-2 inline-block">
            Go to shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 font-bold text-lg">
                <span>Total</span>
                <span className="text-[#0f4f57]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address *
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f4f57]"
                  placeholder="Enter your full shipping address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f4f57]"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#f8d548] text-[#0c4148] py-3 rounded-lg font-bold text-lg hover:brightness-95 disabled:opacity-50 transition"
          >
            {loading ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
          </button>
        </div>
      )}
    </div>
  );
}

