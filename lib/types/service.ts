import type { VerificationStatus } from "./common";

// ─── Service ────────────────────────────────────────────────
export interface Service {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  /** Backend sometimes returns the misspelled field "catergory" */
  catergory?: string;
  price?: number;
  duration_minutes?: number;
  approvalStatus?: VerificationStatus;
  providerId?: string | { businessName?: string; email?: string };
  createdAt?: string;
  provider?: {
    address?: string;
    location?: string | { address?: string };
  };
  petType?: string;
}
