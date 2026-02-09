export interface Booking {
  _id: string;
  id?: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price?: number;
  notes?: string;
  serviceId?: string;
  userId?: string;
  petId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  startTime: string;
  endTime: string;
  serviceId?: string;
  petId?: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  startTime?: string;
  endTime?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  price?: number;
  notes?: string;
  serviceId?: string;
  petId?: string;
}
