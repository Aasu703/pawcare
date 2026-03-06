// ─── Health Record ──────────────────────────────────────────
export type RecordType =
  | "vaccination"
  | "checkup"
  | "surgery"
  | "medication"
  | "other";

export interface HealthRecord {
  _id: string;
  petId?: string | { _id?: string; name?: string };
  recordType: RecordType | string;
  title?: string;
  description?: string;
  date: string;
  nextDueDate?: string;
  createdAt?: string;
}
