import type { BookingStatus } from "./common";

// ─── Booking ────────────────────────────────────────────────
export interface Booking {
  _id: string;
  status: BookingStatus | string;
  startTime: string;
  endTime?: string;
  price?: number;
  notes?: string;
  serviceId?: string | { _id?: string; title?: string };
  userId?: string | { _id?: string; Firstname?: string; Lastname?: string };
  petId?: string | { _id?: string; name?: string };
  provider?: { businessName?: string };
  providerId?: string;
  service?: { title?: string };
  pet?: { name?: string };
  createdAt?: string;
}
