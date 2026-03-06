// ─── Review / Feedback ──────────────────────────────────────
export interface Review {
  _id: string;
  userId?: string | { _id?: string; Firstname?: string };
  providerId?: string | { _id?: string; businessName?: string };
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface Feedback {
  _id: string;
  userId?: string | { _id?: string; Firstname?: string };
  providerId?: string | { _id?: string; businessName?: string };
  serviceId?: string | { _id?: string; title?: string };
  rating?: number;
  comment?: string;
  createdAt?: string;
}
