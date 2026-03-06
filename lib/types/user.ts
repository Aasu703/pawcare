import type { UserRole } from "./common";

// ─── User ───────────────────────────────────────────────────
export interface User {
  _id: string;
  Firstname: string;
  Lastname: string;
  email: string;
  username?: string;
  role: UserRole;
  phone?: string;
  phoneNumber?: string;
  imageUrl?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
