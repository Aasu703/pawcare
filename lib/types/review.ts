export interface Review {
  _id: string;
  id?: string;
  rating: number;
  comment?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}
