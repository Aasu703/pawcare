import type { VerificationStatus } from "./common";

// ─── Product / Inventory ────────────────────────────────────
export interface Product {
  _id: string;
  product_name: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string;
}

export interface InventoryItem {
  _id: string;
  itemName: string;
  quantity: number;
  unit?: string;
  minThreshold?: number;
  notes?: string;
  approvalStatus?: VerificationStatus;
  providerId?: string | { businessName?: string; email?: string };
}
