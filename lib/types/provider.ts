export interface Provider {
  _id: string;
  id?: string;
  businessName: string;
  address: string;
  phone?: string;
  email: string;
  rating?: number;
  role: "provider";
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProviderRequest {
  businessName: string;
  address: string;
  phone?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginProviderRequest {
  email: string;
  password: string;
}

export interface Feedback {
  _id: string;
  id?: string;
  feedback: string;
  providerId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeedbackRequest {
  feedback: string;
  providerId: string;
}

export interface UpdateFeedbackRequest {
  feedback?: string;
}

export interface Inventory {
  _id: string;
  id?: string;
  product_name: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
  providerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryRequest {
  product_name: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
  providerId: string;
}

export interface UpdateInventoryRequest {
  product_name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
}
