// ─── Paginated Response ─────────────────────────────────────
export interface PaginatedResponse<T> {
  items?: T[];
  data?: T[];
  total?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
}

// ─── API Action Result (re-export) ──────────────────────────
export type { ActionResult } from "../actions/_shared";
