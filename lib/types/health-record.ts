export interface HealthRecord {
  _id: string;
  id?: string;
  recordType: string;
  title: string;
  description?: string;
  date: string;
  nextDueDate?: string;
  attachmentsCount?: number;
  petId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHealthRecordRequest {
  recordType: string;
  title: string;
  description?: string;
  date: string;
  nextDueDate?: string;
  petId: string;
}

export interface UpdateHealthRecordRequest {
  recordType?: string;
  title?: string;
  description?: string;
  date?: string;
  nextDueDate?: string;
}

export interface Attachment {
  _id: string;
  id?: string;
  fileName: string;
  fileUrl: string;
  healthRecordId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttachmentRequest {
  fileName: string;
  fileUrl: string;
  healthRecordId: string;
}

export interface UpdateAttachmentRequest {
  fileName?: string;
  fileUrl?: string;
}
