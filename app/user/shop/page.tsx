"use client";

import { useEffect, useState } from "react";
import { getAllProducts, getProductById } from "@/lib/api/public/product";
import { Inventory } from "@/lib/types/provider";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus, Search, Package } from "lucide-react";
import Link from "next/link";

interface CartItem {
  product: Inventory;
  quantity: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getAllProducts(1, 50);
    if (res.success && res.data) {
      setProducts(res.data.items || []);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const addToCart = (product: Inventory) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          toast.error("Maximum stock reached");
          return prev;
        }
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.product_name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.product._id !== productId);
    });
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((p) =>
    p.product_name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f4f57]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0c4148]">Pet Shop</h1>
          <p className="text-gray-500 mt-1">Browse products from our providers</p>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative flex items-center gap-2 bg-[#0f4f57] text-white px-4 py-2 rounded-lg hover:bg-[#0c4148] transition"
        >
          <ShoppingCart className="h-5 w-5" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#f8d548] text-[#0c4148] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4f57]"
        />
      </div>

      {/* Cart Panel */}
      {showCart && (
        <div className="mb-6 bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-semibold text-[#0c4148] mb-4">Shopping Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{item.product.product_name}</p>
                      <p className="text-sm text-gray-500">${item.product.price?.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item.product)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-20 text-right">
                        ${((item.product.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-lg font-bold">Total: ${cartTotal.toFixed(2)}</span>
                <Link
                  href={{
                    pathname: "/user/checkout",
                    query: { cart: JSON.stringify(cart.map(i => ({ productId: i.product._id, productName: i.product.product_name, quantity: i.quantity, unitPrice: i.product.price || 0 }))) },
                  }}
                  className="bg-[#f8d548] text-[#0c4148] px-6 py-2 rounded-lg font-semibold hover:brightness-95 transition"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No products found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-[#0f4f57]/10 to-[#0f4f57]/5 p-6 flex items-center justify-center">
                <Package className="h-16 w-16 text-[#0f4f57]/40" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#0c4148] mb-1">{product.product_name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                )}
                {product.category && (
                  <span className="inline-block text-xs bg-[#0f4f57]/10 text-[#0f4f57] px-2 py-0.5 rounded mb-2">
                    {product.category}
                  </span>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-[#0f4f57]">
                    ${product.price?.toFixed(2) || "0.00"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                  className="w-full mt-3 bg-[#0f4f57] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0c4148] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
