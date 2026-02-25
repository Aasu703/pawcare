"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, ActivitySquare, Stethoscope, PawPrint, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl, resolveMediaUrl } from "@/lib/utils/media-url";

interface AssignedVet {
  _id: string;
  name?: string;
  clinicOrShopName?: string;
  businessName?: string;
}

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
  createdAt: string;
  assignedVetId?: string | { _id?: string };
  assignedVet?: AssignedVet;
}

interface PetCardProps {
  pet: Pet;
  getAssignedVetLabel: (pet: Pet) => string;
  onEdit: () => void;
  onDelete: () => void;
  onAssignVet: () => void;
  onCareClick: () => void;
  onAskVet: () => void;
  baseUrl: string;
}

export function PetCard({ 
  pet, 
  getAssignedVetLabel, 
  onEdit, 
  onDelete, 
  onAssignVet, 
  onCareClick,
  onAskVet,
  baseUrl 
}: PetCardProps) {
  const getAssignedVetId = () => {
    if (typeof pet.assignedVetId === 'string' && pet.assignedVetId) return pet.assignedVetId;
    if (pet.assignedVetId && typeof pet.assignedVetId === 'object' && pet.assignedVetId._id) return pet.assignedVetId._id;
    if (pet.assignedVet?._id) return pet.assignedVet._id;
    return '';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -5 }}
      key={pet._id}
      className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
        {pet.imageUrl ? (
          <img
            src={resolveMediaUrl(pet.imageUrl, baseUrl, 'image')}
            alt={pet.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
            <PawPrint className="w-12 h-12 text-white" />
          </div>
        )}
      </div>

      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">{pet.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {pet.species} • {pet.breed}
        </p>
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <span>Age: {pet.age}y</span>
          <span>Weight: {pet.weight}kg</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          {getAssignedVetLabel(pet)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <button
          onClick={onCareClick}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors hover:shadow-md"
        >
          <ActivitySquare className="w-4 h-4" />
          Care
        </button>
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors hover:shadow-md"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onAssignVet}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors hover:shadow-md"
        >
          <Stethoscope className="w-4 h-4" />
          Assign Vet
        </button>
        <button
          onClick={onAskVet}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors hover:shadow-md"
        >
          <Stethoscope className="w-4 h-4" />
          Ask Vet
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors hover:shadow-md"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </motion.div>
  );
}
