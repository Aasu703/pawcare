export interface Review {
  _id: string;
  id?: string;
  rating: number;
  comment?: string;
  userId?: string;
  providerId?: string;
  productId?: string;
  reviewType?: "provider" | "product" | "general";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
  providerId?: string;
  productId?: string;
  reviewType?: "provider" | "product" | "general";
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}
