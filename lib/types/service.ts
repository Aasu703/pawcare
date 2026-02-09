export interface Service {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  price: number;
  duration_minutes: number;
  catergory?: "grooming" | "boarding" | "vet";
  availability?: string[];
  providerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceRequest {
  title: string;
  description?: string;
  price: number;
  duration_minutes: number;
  catergory?: "grooming" | "boarding" | "vet";
  availability?: string[];
  providerId?: string;
}

export interface UpdateServiceRequest {
  title?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  catergory?: "grooming" | "boarding" | "vet";
  availability?: string[];
  providerId?: string;
}
