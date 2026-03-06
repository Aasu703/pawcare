// ─── Message ────────────────────────────────────────────────
export interface Message {
  _id: string;
  userId?: string | { _id?: string; Firstname?: string };
  content?: string;
  createdAt?: string;
}
