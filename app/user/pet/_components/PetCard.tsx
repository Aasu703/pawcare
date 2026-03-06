"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, Stethoscope, PawPrint, ShieldCheck, MoreVertical, Heart, HeartPulse } from "lucide-react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils/media-url";
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

const speciesImage = (species: string, name: string) => {
  const lower = (species || "").toLowerCase();
  if (lower === "cat" || lower === "kitten") {
    const images = ["/images/cat.png", "/images/kittiy.png", "/images/meow.png"];
    return images[name.length % images.length];
  }
  return null;
};

const speciesEmoji = (species: string) => {
  const lower = (species || "").toLowerCase();
  if (lower === "dog" || lower === "puppy") return "🐕";
  if (lower === "cat" || lower === "kitten") return "🐈";
  if (lower === "bird" || lower === "parrot") return "🐦";
  if (lower === "rabbit" || lower === "bunny") return "🐇";
  if (lower === "fish") return "🐟";
  if (lower === "hamster") return "🐹";
  return "🐾";
};

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
  const catImg = speciesImage(pet.species, pet.name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative bg-white border border-[var(--pc-border)] rounded-[20px] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[var(--pc-primary)]/40 transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative h-[180px] overflow-hidden bg-[var(--pc-cream)]">
        {pet.imageUrl ? (
          <img
            src={resolveMediaUrl(pet.imageUrl, baseUrl, 'image')}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : catImg ? (
          <Image src={catImg} alt={pet.species} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--pc-primary-light)] to-[var(--pc-teal-light)] flex items-center justify-center">
            <span className="text-5xl">{speciesEmoji(pet.species)}</span>
          </div>
        )}

        {/* Species badge top-left */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-[10px] text-[var(--pc-teal-dark)] capitalize shadow-sm">
          {speciesEmoji(pet.species)} {pet.species}
        </span>

        {/* Edit button top-right (hover only) */}
        <button
          onClick={onEdit}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-sm"
        >
          <Edit className="w-3.5 h-3.5 text-[var(--pc-text-muted)]" />
        </button>

        {/* White overlap curve */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-t-[20px]" />
      </div>

      {/* Card Body */}
      <div className="px-4 pb-4 -mt-1">
        <h3 className="font-[var(--font-display)] text-lg font-bold text-foreground truncate">{pet.name}</h3>
        <p className="text-xs text-[var(--pc-text-muted)] capitalize mb-3">{pet.breed || "Unknown breed"}</p>

        {/* Stats row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-[var(--pc-teal-light)] text-[var(--pc-teal)] rounded-[10px] px-2.5 py-1 text-xs font-semibold">
            🎂 {pet.age}y
          </span>
          <span className="inline-flex items-center gap-1 bg-[var(--pc-primary-light)] text-[var(--pc-primary)] rounded-[10px] px-2.5 py-1 text-xs font-semibold">
            ⚖️ {pet.weight}kg
          </span>
        </div>

        {/* Vet assignment */}
        <button
          onClick={onAssignVet}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-[10px] border text-xs font-medium transition-all duration-200 mb-3 ${
            hasAssignedVet
              ? "bg-[var(--pc-cream)] border-[var(--pc-border)] text-foreground hover:border-[var(--pc-primary)]"
              : "bg-[var(--pc-cream)] border-dashed border-[var(--pc-border)] text-[var(--pc-text-muted)] hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{getAssignedVetLabel(pet)}</span>
        </button>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCareClick}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--pc-primary-light)] text-[var(--pc-primary)] text-xs font-semibold rounded-[10px] hover:bg-[var(--pc-primary)] hover:text-white transition-all duration-200"
          >
            <Heart className="w-3.5 h-3.5" />
            Care Plan
          </button>
          <button
            onClick={() => {
              onAskVet();
            }}
            disabled={!hasAssignedVet}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--pc-teal-light)] text-[var(--pc-teal)] text-xs font-semibold rounded-[10px] hover:bg-[var(--pc-teal)] hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--pc-teal-light)] disabled:hover:text-[var(--pc-teal)]"
          >
            <HeartPulse className="w-3.5 h-3.5" />
            Ask Vet
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-[34px] h-[34px] flex items-center justify-center border border-[var(--pc-border)] rounded-[10px] bg-white text-[var(--pc-text-muted)] hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)] transition-all duration-200"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute bottom-full right-0 mb-1 bg-white border border-[var(--pc-border)] rounded-[12px] shadow-xl z-50 overflow-hidden min-w-[140px]"
              >
                <button
                  onClick={() => { onAssignVet(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-[var(--pc-cream)] transition-colors text-left"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Assign Vet
                </button>
                <button
                  onClick={() => { onEdit(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-[var(--pc-cream)] transition-colors text-left"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Pet
                </button>
                <div className="border-t border-[var(--pc-border)]" />
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
