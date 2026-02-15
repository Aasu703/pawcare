import axios from "../axios";
import { API } from "../endpoints";

export interface CartItem {
  _id?: string; // Cart item ID
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  product?: any; // Enriched product details for display
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Get user's cart
export async function getUserCart(): Promise<{ success: boolean; message: string; data?: Cart }> {
  try {
    const response = await axios.get(API.CART.GET_MY);
    return { success: true, message: "Cart fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch cart" };
  }
}

// Add item to cart
export async function addToCart(data: { productId: string; quantity: number }): Promise<{ success: boolean; message: string; data?: Cart }> {
  try {
    const response = await axios.post(API.CART.ADD_ITEM, data);
    return { success: true, message: response.data.message || "Item added to cart", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to add item to cart" };
  }
}

// Update cart item quantity
export async function updateCartItem(itemId: string, data: { quantity: number }): Promise<{ success: boolean; message: string; data?: Cart }> {
  try {
    const response = await axios.put(API.CART.UPDATE_ITEM(itemId), data);
    return { success: true, message: response.data.message || "Cart item updated", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update cart item" };
  }
}

// Remove item from cart
export async function removeFromCart(itemId: string): Promise<{ success: boolean; message: string; data?: Cart }> {
  try {
    const response = await axios.delete(API.CART.REMOVE_ITEM(itemId));
    return { success: true, message: response.data.message || "Item removed from cart", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to remove item from cart" };
  }
}

// Clear entire cart
export async function clearCart(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.CART.CLEAR);
    return { success: true, message: response.data.message || "Cart cleared" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to clear cart" };
  }
}