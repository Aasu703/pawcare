export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  _id: string;
  id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress?: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: string;
  notes?: string;
}
