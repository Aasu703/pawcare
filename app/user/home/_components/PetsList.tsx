"use client";

import { motion } from "framer-motion";
import { PawPrint, Plus, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
  createdAt: string;
}

interface PetsListProps {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  baseUrl: string;
}

export function PetsList({ pets, loading, error, onRefetch, baseUrl }: PetsListProps) {
  const router = useRouter();

  const resolveMediaUrl = (url: string | undefined) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${baseUrl}${url}`;
  };

  return (
    <section>
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Your Pets</h2>
          <p className="text-muted-foreground">Manage profiles and health records</p>
        </div>
        <Link href="/user/pet">
          <button className="group flex items-center gap-2 text-primary font-semibold hover:text-[var(--pc-primary-hover)] transition-colors">
            View All Pets
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-64 rounded-3xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button onClick={onRefetch} className="text-sm underline text-red-700">Try Again</button>
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-dashed border-border rounded-[2rem] p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <PawPrint className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">No Pets Yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Start by adding your first pet to track their health and happiness.</p>
          <Link href="/user/pet/add">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-[var(--pc-primary-hover)] transition-colors shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5" />
              Add Pet
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.slice(0, 3).map((pet, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={pet._id}
              onClick={() => router.push(`/user/pet/${pet._id}/edit`)}
              className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />

              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                  {pet.imageUrl ? (
                    <img
                      src={resolveMediaUrl(pet.imageUrl)}
                      alt={pet.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <PawPrint className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{pet.name}</h3>
                  <p className="text-primary font-medium mb-2">{pet.breed}</p>
                  <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="px-2 py-1 rounded-lg bg-muted">{pet.age} yrs</span>
                    <span className="px-2 py-1 rounded-lg bg-muted">{pet.weight} kg</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                <button onClick={(e) => { e.stopPropagation(); router.push(`/user/pet/${pet._id}/edit`); }} className="py-2.5 rounded-xl bg-muted hover:bg-muted text-foreground font-semibold text-sm transition-colors">
                  Edit Profile
                </button>
                <button onClick={(e) => { e.stopPropagation(); router.push('/user/pet'); }} className="py-2.5 rounded-xl bg-primary text-white hover:bg-[var(--pc-primary-hover)] font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  Details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
          {pets.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
            >
              <p className="text-primary font-semibold text-lg mb-2">+{pets.length - 3} more pets</p>
              <Link href="/user/pet" className="text-sm text-muted-foreground hover:text-foreground">
                View all pets
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
