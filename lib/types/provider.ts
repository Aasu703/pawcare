export interface Provider {
  _id: string;
  id?: string;
  businessName: string;
  address: string;
  phone?: string;
  email: string;
  rating?: number;
  role: "provider";
  providerType?: "shop" | "vet" | "babysitter";
  status?: "pending" | "approved" | "rejected";
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
  providerType?: "shop" | "vet" | "babysitter";
}

export interface LoginProviderRequest {
  email: string;
  password: string;
}

export interface Feedback {
  _id: string;
  id?: string;
  feedback: string;
  comment?: string; // alias for feedback?
  rating?: number;
  serviceId?: string | { title: string }; // populated
  providerId?: string | { businessName: string }; // populated
  userId?: string | { Firstname: string }; // populated
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
  itemName?: string; // specific to admin view?
  description?: string;
  quantity: number;
  price?: number;
  category?: string;
  providerId?: string | Provider;
  createdAt?: string;
  updatedAt?: string;
  minThreshold?: number;
  unit?: string;
  notes?: string;
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
