// ─── Identifiers & Roles ────────────────────────────────────
export type AuthRole = "user" | "provider";
export type UserRole = "user" | "provider" | "admin";
export type ProviderType = "vet" | "shop" | "babysitter";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
