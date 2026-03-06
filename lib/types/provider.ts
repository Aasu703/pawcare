import type { ProviderType, VerificationStatus } from "./common";

// ─── Provider ───────────────────────────────────────────────
export interface ProviderLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface Provider {
  _id: string;
  businessName: string;
  email: string;
  phone?: string;
  providerType?: ProviderType;
  status?: VerificationStatus;
  certification?: string;
  certificationDocumentUrl?: string;
  experience?: string;
  clinicOrShopName?: string;
  panNumber?: string;
  address?: string;
  location?: ProviderLocation;
  locationVerified?: boolean;
  pawcareVerified?: boolean;
  isActive?: boolean;
  profileImageUrl?: string;
  createdAt?: string;
}

// ─── Provider Service (admin verification) ──────────────────
export interface ProviderService {
  _id: string;
  userId?: {
    _id: string;
    email: string;
    Firstname?: string;
    Lastname?: string;
  };
  serviceType?: string;
  verificationStatus?: VerificationStatus;
  documents?: string[];
  registrationNumber?: string;
  bio?: string;
  experience?: string;
  createdAt?: string;
}
