'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ArrowLeft, PawPrint, ActivitySquare, Stethoscope, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { assignVetToUserPet, deleteUserPet, getUserPets, getVerifiedVets, type VerifiedVetOption } from '@/lib/api/user/pet';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiBaseUrl, resolveMediaUrl } from '@/lib/utils/media-url';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AssignedVet = {
  _id: string;
  name?: string;
  clinicOrShopName?: string;
  businessName?: string;
};

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

export default function PetListPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [verifiedVets, setVerifiedVets] = useState<VerifiedVetOption[]>([]);
  const [loadingVets, setLoadingVets] = useState(false);
  const [assignPet, setAssignPet] = useState<Pet | null>(null);
  const [selectedVetId, setSelectedVetId] = useState('unassigned');
  const [assigningVet, setAssigningVet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const baseUrl = getApiBaseUrl();

  useEffect(() => {
    fetchPets();
    fetchVerifiedVets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getUserPets();

      if (response.success && response.data) {
        setPets(response.data as Pet[]);
      } else {
        setError(response.message || 'Failed to fetch pets');
      }
    } catch (fetchError) {
      console.error('Error fetching pets:', fetchError);
      setError('An error occurred while fetching pets');
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifiedVets = async () => {
    try {
      setLoadingVets(true);
      const response = await getVerifiedVets();
      if (response.success && response.data) {
        setVerifiedVets(response.data);
      }
    } finally {
      setLoadingVets(false);
    }
  };

  const getAssignedVetId = (pet: Pet) => {
    if (typeof pet.assignedVetId === 'string' && pet.assignedVetId) return pet.assignedVetId;
    if (pet.assignedVetId && typeof pet.assignedVetId === 'object' && pet.assignedVetId._id) return pet.assignedVetId._id;
    if (pet.assignedVet?._id) return pet.assignedVet._id;
    return '';
  };

  const getAssignedVetLabel = (pet: Pet) => {
    const assignedVetId = getAssignedVetId(pet);
    if (!assignedVetId) return 'No vet assigned';

    const matched = verifiedVets.find((vet) => vet._id === assignedVetId);
    if (matched) return matched.clinicOrShopName || matched.name;

    return pet.assignedVet?.clinicOrShopName || pet.assignedVet?.name || pet.assignedVet?.businessName || 'Assigned vet';
  };

  const openAssignDialog = (pet: Pet) => {
    const assignedVetId = getAssignedVetId(pet);
    setAssignPet(pet);
    setSelectedVetId(assignedVetId || 'unassigned');
  };

  const closeAssignDialog = () => {
    setAssignPet(null);
    setSelectedVetId('unassigned');
    setAssigningVet(false);
  };

  const handleAssignVet = async () => {
    if (!assignPet) return;

    try {
      setAssigningVet(true);
      const vetId = selectedVetId === 'unassigned' ? null : selectedVetId;
      const response = await assignVetToUserPet(assignPet._id, vetId);

      if (!response.success) {
        alert(response.message || 'Failed to assign vet');
        return;
      }

      const selectedVet = vetId ? verifiedVets.find((vet) => vet._id === vetId) : undefined;
      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet._id === assignPet._id
            ? {
                ...pet,
                assignedVetId: vetId || '',
                assignedVet: selectedVet
                  ? {
                      _id: selectedVet._id,
                      name: selectedVet.name,
                      clinicOrShopName: selectedVet.clinicOrShopName,
                      businessName: selectedVet.name,
                    }
                  : undefined,
              }
            : pet,
        ),
      );

      closeAssignDialog();
    } catch (assignError) {
      console.error('Error assigning vet:', assignError);
      alert('An error occurred while assigning vet');
      setAssigningVet(false);
    }
  };

  const handleDeletePet = async (data: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      const response = await deleteUserPet(data);

      if (response.success) {
        setPets((prevPets) => prevPets.filter((pet) => pet._id !== data));
      } else {
        alert(response.message || 'Failed to delete pet');
      }
    } catch (deleteError) {
      console.error('Error deleting pet:', deleteError);
      alert('An error occurred while deleting the pet');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your pets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Pets</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPets}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 text-gray-900 overflow-hidden relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-96 h-96 bg-green-300/20 rounded-full blur-3xl top-20 left-10"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-10 right-10"
        />
      </div>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b border-gray-200 backdrop-blur-xl bg-white/80"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Pets</h1>
          <Link
            href="/user/pet/add"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add Pet</span>
          </Link>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {pets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
              <PawPrint className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Pets Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your pet family! Add your first furry friend to keep track of their health, appointments, and more.
            </p>
            <Link
              href="/user/pet/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Pet
            </Link>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {pets.map((pet) => (
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
                      onClick={() => router.push(`/user/pet/${pet._id}/care`)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors hover:shadow-md"
                    >
                      <ActivitySquare className="w-4 h-4" />
                      Care
                    </button>
                    <button
                      onClick={() => router.push(`/user/pet/${pet._id}/edit`)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors hover:shadow-md"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => openAssignDialog(pet)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors hover:shadow-md"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Assign Vet
                    </button>
                    <button
                      onClick={() => {
                        const assignedVetId = getAssignedVetId(pet);
                        if (!assignedVetId) {
                          alert("Assign a verified vet first.");
                          return;
                        }
                        const participantName = encodeURIComponent(getAssignedVetLabel(pet));
                        router.push(`/user/vet-chat?participantId=${assignedVetId}&participantRole=provider&participantName=${participantName}`);
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors hover:shadow-md"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Ask Vet
                    </button>
                    <button
                      onClick={() => handleDeletePet(pet._id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors hover:shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Dialog open={Boolean(assignPet)} onOpenChange={(open) => (!open ? closeAssignDialog() : null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Verified Vet</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Assign a PawCare-verified vet for {assignPet?.name}. The selected vet can review assigned pets one by one.
            </p>

            <Select value={selectedVetId} onValueChange={setSelectedVetId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a verified vet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">No vet assigned</SelectItem>
                {verifiedVets.map((vet) => (
                  <SelectItem key={vet._id} value={vet._id}>
                    {vet.clinicOrShopName || vet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {loadingVets && <p className="text-xs text-gray-500">Loading verified vets...</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeAssignDialog}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignVet}
                disabled={assigningVet}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
              >
                {assigningVet ? 'Saving...' : 'Save Assignment'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
