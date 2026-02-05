export interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  image?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetFormData {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  image?: File | string;
}

export interface CreatePetRequest {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  image?: string;
}

export interface UpdatePetRequest extends CreatePetRequest {
  _id: string;
}

export interface PetStats {
  totalPets: number;
  recentPets: Pet[];
}