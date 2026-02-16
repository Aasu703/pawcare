"use client";

import { useEffect, useState } from "react";
import { getAllProducts, getProductById } from "@/lib/api/public/product";
import { getUserCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeFromCartAPI, clearCart, CartItem } from "@/lib/api/user/cart";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus, Search, Package } from "lucide-react";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
    loadCartFromBackend();
  }, []);

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

  const addToCart = async (product: any) => {
    setCartLoading(true);
    const res = await addToCartAPI({
      productId: product._id,
      quantity: 1
    });

    if (res.success && res.data) {
      // Update cart with backend response, but we need to enrich with product details for display
      const enrichedItems = res.data.items?.map((item: CartItem) => {
        const productDetails = products.find(p => p._id === item.productId);
        return {
          ...item,
          product: productDetails || { product_name: item.productName, price: item.unitPrice }
        };
      }) || [];
      setCart(enrichedItems);
      toast.success(`${product.product_name} added to cart`);
    } else {
      toast.error(res.message);
    }
    setCartLoading(false);
  };

  const removeFromCart = async (productId: string) => {
    setCartLoading(true);
    // Find the cart item with this productId
    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem && cartItem._id) {
      const res = await removeFromCartAPI(cartItem._id);
      if (res.success && res.data) {
        // Update cart with backend response
        const enrichedItems = res.data.items?.map((item: CartItem) => {
          const productDetails = products.find(p => p._id === item.productId);
          return {
            ...item,
            product: productDetails || { product_name: item.productName, price: item.unitPrice }
          };
        }) || [];
        setCart(enrichedItems);
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
    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem && cartItem._id) {
      const res = await updateCartItem(cartItem._id, { quantity: newQuantity });
      if (res.success && res.data) {
        // Update cart with backend response
        const enrichedItems = res.data.items?.map((item: CartItem) => {
          const productDetails = products.find(p => p._id === item.productId);
          return {
            ...item,
            product: productDetails || { product_name: item.productName, price: item.unitPrice }
          };
        }) || [];
        setCart(enrichedItems);
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

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * item.quantity,
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#0c4148]">Shopping Cart</h2>
            {cart.length > 0 && (
              <button
                onClick={clearCartItems}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear Cart
              </button>
            )}
          </div>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{item.product?.product_name || item.productName}</p>
                      <p className="text-sm text-gray-500">${(item.product?.price || item.unitPrice)?.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item.product || { _id: item.productId, product_name: item.productName, price: item.unitPrice })}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-20 text-right">
                        ${((item.product?.price || item.unitPrice || 0) * item.quantity).toFixed(2)}
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
                    query: { cart: JSON.stringify(cart.map(i => ({ productId: i.productId, productName: i.product?.product_name || i.productName, quantity: i.quantity, unitPrice: i.product?.price || i.unitPrice }))) },
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

