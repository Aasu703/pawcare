"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, ActivitySquare, Stethoscope, PawPrint, ShieldCheck, MoreVertical, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl, resolveMediaUrl } from "@/lib/utils/media-url";
import { useState } from "react";

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
  const [showMenu, setShowMenu] = useState(false);
  
  const getAssignedVetId = () => {
    if (typeof pet.assignedVetId === 'string' && pet.assignedVetId) return pet.assignedVetId;
    if (pet.assignedVetId && typeof pet.assignedVetId === 'object' && pet.assignedVetId._id) return pet.assignedVetId._id;
    if (pet.assignedVet?._id) return pet.assignedVet._id;
    return '';
  };

  const hasAssignedVet = !!getAssignedVetId();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative bg-gradient-to-br from-white via-white to-slate-50 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative p-5 flex gap-5">
        {/* Pet Image */}
        <motion.div 
          className="flex-shrink-0"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-emerald-300 transition-colors duration-300 shadow-md">
            {pet.imageUrl ? (
              <img
                src={resolveMediaUrl(pet.imageUrl, baseUrl, 'image')}
                alt={pet.name}
                width={112}
                height={112}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <PawPrint className="w-14 h-14 text-white" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Pet Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {pet.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {pet.species} • {pet.breed}
                </p>
              </div>
            </div>

            {/* Pet Stats */}
            <div className="flex gap-3 flex-wrap pt-1">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-200">
                <span className="text-xs text-blue-700 font-medium">Age:</span>
                <span className="text-xs text-blue-600 font-semibold">{pet.age}y</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 rounded-full border border-orange-200">
                <span className="text-xs text-orange-700 font-medium">Weight:</span>
                <span className="text-xs text-orange-600 font-semibold">{pet.weight}kg</span>
              </div>
            </div>

            {/* Assigned Vet Badge */}
            <div className="pt-1">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                hasAssignedVet 
                  ? 'bg-amber-50 border-amber-200 text-amber-700' 
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {getAssignedVetLabel(pet)}
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex gap-2 pt-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCareClick}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
            >
              <Heart className="w-3.5 h-3.5" />
              Care
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </motion.button>
            
            {/* More Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 group-hover:bg-emerald-100 group-hover:text-emerald-700"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </motion.button>

              {/* Dropdown Menu */}
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden min-w-max"
                >
                  <button
                    onClick={() => {
                      onAssignVet();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors text-left"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    Assign Vet
                  </button>
                  <button
                    onClick={() => {
                      onAskVet();
                      setShowMenu(false);
                    }}
                    disabled={!hasAssignedVet}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors ${
                      hasAssignedVet
                        ? 'text-gray-700 hover:bg-cyan-50 hover:text-cyan-700'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    Ask Vet
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
