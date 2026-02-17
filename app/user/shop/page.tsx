"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "@/lib/api/public/product";
import {
  getUserCart,
  addToCart as addToCartAPI,
  updateCartItem,
  removeFromCart as removeFromCartAPI,
  clearCart,
  CartItem,
} from "@/lib/api/user/cart";
import { toast } from "sonner";
import {
  ArrowRight,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type Product = {
  _id: string;
  product_name: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
};

type SortMode = "featured" | "price-low" | "price-high" | "name";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");

  const enrichCartItems = (items: CartItem[] = []) =>
    items.map((item) => {
      const productDetails = products.find((p) => p._id === item.productId);
      return {
        ...item,
        product: productDetails || { product_name: item.productName, price: item.unitPrice },
      };
    });

  const loadCartFromBackend = async () => {
    setCartLoading(true);
    const res = await getUserCart();
    if (res.success && res.data) {
      setCart(res.data.items || []);
    }
    setCartLoading(false);
  };

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

  const addToCart = async (product: Product | { _id: string; product_name: string; price?: number }) => {
    setCartLoading(true);
    const res = await addToCartAPI({
      productId: product._id,
      quantity: 1,
    });

    if (res.success && res.data) {
      setCart(enrichCartItems(res.data.items || []));
      toast.success(`${product.product_name} added to cart`);
    } else {
      toast.error(res.message);
    }
    setCartLoading(false);
  };

  const removeFromCart = async (productId: string) => {
    setCartLoading(true);
    const cartItem = cart.find((item) => item.productId === productId);
    if (cartItem && cartItem._id) {
      const res = await removeFromCartAPI(cartItem._id);
      if (res.success && res.data) {
        setCart(enrichCartItems(res.data.items || []));
        toast.success("Item removed from cart");
      } else {
        toast.error(res.message);
      }
    }
    setCartLoading(false);
  };

  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setCartLoading(true);
    const cartItem = cart.find((item) => item.productId === productId);
    if (cartItem && cartItem._id) {
      const res = await updateCartItem(cartItem._id, { quantity: newQuantity });
      if (res.success && res.data) {
        setCart(enrichCartItems(res.data.items || []));
      } else {
        toast.error(res.message);
      }
    }
    setCartLoading(false);
  };

  const clearCartItems = async () => {
    setCartLoading(true);
    const res = await clearCart();
    if (res.success) {
      setCart([]);
      toast.success("Cart cleared");
    } else {
      toast.error(res.message);
    }
    setCartLoading(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let result = products.filter((p) => {
      const matchSearch =
        p.product_name.toLowerCase().includes(normalizedSearch) ||
        p.description?.toLowerCase().includes(normalizedSearch) ||
        p.category?.toLowerCase().includes(normalizedSearch) ||
        false;
      const matchCategory = activeCategory === "all" || p.category === activeCategory;
      return matchSearch && matchCategory;
    });

    if (sortMode === "price-low") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortMode === "price-high") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortMode === "name") {
      result = [...result].sort((a, b) => a.product_name.localeCompare(b.product_name));
    }

    return result;
  }, [products, search, activeCategory, sortMode]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProducts();
      void loadCartFromBackend();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#0f4f57]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl bg-gradient-to-r from-[#0f4f57] via-[#15636d] to-[#0c4148] p-6 text-white shadow-lg shadow-[#0f4f57]/20">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            Curated Products
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Pet Shop</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85">
            Browse trusted products from providers and build your order quickly.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold">
              {products.length} products
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold">
              {categories.length - 1} categories
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold">
              {cartCount} items in cart
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-500">Shopping Cart</p>
          <p className="mt-1 text-3xl font-bold text-[#0c4148]">{cartCount}</p>
          <p className="text-sm text-gray-500">items selected</p>
          <p className="mt-4 text-xl font-bold text-[#0f4f57]">${cartTotal.toFixed(2)}</p>
          <button
            onClick={() => setShowCart((prev) => !prev)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f4f57] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c4148]"
          >
            <ShoppingCart className="h-4 w-4" />
            {showCart ? "Hide Cart" : "View Cart"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#0f4f57] focus:ring-2 focus:ring-[#0f4f57]/15"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSortMode("featured")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                sortMode === "featured" ? "bg-[#0f4f57] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setSortMode("price-low")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                sortMode === "price-low" ? "bg-[#0f4f57] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Price Low
            </button>
            <button
              onClick={() => setSortMode("price-high")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                sortMode === "price-high" ? "bg-[#0f4f57] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Price High
            </button>
            <button
              onClick={() => setSortMode("name")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                sortMode === "name" ? "bg-[#0f4f57] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Name
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeCategory === category
                  ? "bg-[#0f4f57] text-white"
                  : "bg-[#0f4f57]/10 text-[#0f4f57] hover:bg-[#0f4f57]/20"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </button>
          ))}
        </div>
      </section>

      {showCart && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#0c4148]">Shopping Cart</h2>
              <p className="text-sm text-gray-500">{cartCount} item(s) selected</p>
            </div>
            {cart.length > 0 && (
              <button onClick={clearCartItems} className="text-sm font-semibold text-red-600 hover:text-red-700">
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => {
                  const unit = item.product?.price || item.unitPrice || 0;
                  const maxQuantity = item.product?.quantity as number | undefined;
                  const canIncrease = maxQuantity === undefined || item.quantity < maxQuantity;

                  return (
                    <div key={item.productId} className="rounded-xl border border-gray-200 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#0c4148]">{item.product?.product_name || item.productName}</p>
                          <p className="text-xs text-gray-500">${unit.toFixed(2)} each</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              canIncrease
                                ? updateCartQuantity(item.productId, item.quantity + 1)
                                : toast.error("No more stock available")
                            }
                            className="rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="ml-1 rounded-md bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="ml-2 w-20 text-right text-sm font-bold text-[#0c4148]">
                            ${(unit * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <span className="text-lg font-bold text-[#0c4148]">Total: ${cartTotal.toFixed(2)}</span>
                <Link
                  href={{
                    pathname: "/user/checkout",
                    query: {
                      cart: JSON.stringify(
                        cart.map((i) => ({
                          productId: i.productId,
                          productName: i.product?.product_name || i.productName,
                          quantity: i.quantity,
                          unitPrice: i.product?.price || i.unitPrice,
                        })),
                      ),
                    },
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#f8d548] px-6 py-2.5 text-sm font-bold text-[#0c4148] transition hover:brightness-95"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </section>
      )}

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">Try changing category, search text, or sort mode.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const outOfStock = (product.quantity || 0) <= 0;

            return (
              <article
                key={product._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#0f4f57]/10 via-[#0f4f57]/5 to-transparent">
                  <Package className="h-14 w-14 text-[#0f4f57]/40" />
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-base font-semibold text-[#0c4148]">{product.product_name}</h3>
                    {product.category && (
                      <span className="rounded-full bg-[#0f4f57]/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-[#0f4f57]">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="line-clamp-2 text-sm text-gray-500">{product.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#0f4f57]">${product.price?.toFixed(2) || "0.00"}</span>
                    <span
                      className={`text-xs font-semibold ${outOfStock ? "text-red-500" : "text-emerald-600"}`}
                    >
                      {outOfStock ? "Out of stock" : `${product.quantity} in stock`}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={outOfStock || cartLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f4f57] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c4148] disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {outOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
