"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
import {
  handleGetAllPets,
  handleCreatePet,
  handleUpdatePet,
  handleDeletePet,
} from "@/lib/actions/admin/pet-action";
import PetModal from "./PetModal";

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  owner?: {
    _id: string;
    name: string;
  };
}

export default function PetsTable() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const fetchPets = async () => {
    setLoading(true);
    const result = await handleGetAllPets();
    if (result.success) {
      setPets(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleCreate = () => {
    setSelectedPet(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEdit = (data: any) => {
    setSelectedPet(data);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Are you sure you want to delete this pet?")) return;

    const result = await handleDeletePet(data);
    if (result.success) {
      toast.success(result.message);
      fetchPets();
    } else {
      toast.error(result.message);
    }
  };

  const handleSubmit = async (data: any) => {
    let result;
    if (modalMode === "create") {
      result = await handleCreatePet(data);
    } else if (selectedPet) {
      result = await handleUpdatePet(selectedPet._id, data);
    }

    if (result?.success) {
      toast.success(result.message);
      setModalOpen(false);
      fetchPets();
    } else {
      toast.error(result?.message || "Operation failed");
    }
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const speciesColors: Record<string, string> = {
    dog: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-primary",
    cat: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    bird: "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400",
    rabbit: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
    other: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Pets Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border bg-background py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Add Pet
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Species</th>
                <th className="pb-3 font-medium">Breed</th>
                <th className="pb-3 font-medium">Age</th>
                <th className="pb-3 font-medium">Owner</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No pets found
                  </td>
                </tr>
              ) : (
                filteredPets.map((pet) => (
                  <tr key={pet._id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{pet.name}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          speciesColors[pet.species.toLowerCase()] || speciesColors.other
                        }`}
                      >
                        {pet.species}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {pet.breed || "-"}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {pet.age ? `${pet.age} yrs` : "-"}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {pet.owner?.name || "-"}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pet)}
                          className="rounded-lg p-2 hover:bg-muted"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(pet._id)}
                          className="rounded-lg p-2 hover:bg-muted"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <PetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        pet={selectedPet}
        mode={modalMode}
      />
    </div>
  );
}


