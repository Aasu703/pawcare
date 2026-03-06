// ─── Pet ────────────────────────────────────────────────────
export interface AssignedVet {
  _id: string;
  name?: string;
  clinicOrShopName?: string;
  businessName?: string;
}

export interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
  createdAt?: string;
  assignedVetId?: string | { _id?: string };
  assignedVet?: AssignedVet;
  owner?: { _id: string; name?: string; Firstname?: string; Lastname?: string };
}
