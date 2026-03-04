'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, PawPrint } from 'lucide-react';
import Link from 'next/link';
import { assignVetToUserPet, deleteUserPet, getUserPets, getVerifiedVets, type VerifiedVetOption } from '@/lib/api/user/pet';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/utils/media-url';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PetCard } from './_components/PetCard';

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
      <div className="min-h-screen bg-gradient-to-br from-[var(--pc-cream)] via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your pets...</p>
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
          <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Pets</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-[var(--pc-cream)] via-white to-green-100 text-foreground overflow-hidden relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-96 h-96 bg-green-300/20 rounded-full blur-3xl top-20 left-10"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-96 h-96 bg-[var(--pc-teal)]/10 rounded-full blur-3xl bottom-10 right-10"
        />
      </div>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 border-b border-border backdrop-blur-xl bg-white/80"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground hover:text-[var(--pc-teal)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-foreground">My Pets</h1>
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
            <h2 className="text-2xl font-bold text-foreground mb-4">No Pets Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
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
            className="grid grid-cols-1 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {pets.map((pet) => (
                <PetCard
                  key={pet._id}
                  pet={pet}
                  getAssignedVetLabel={getAssignedVetLabel}
                  onEdit={() => router.push(`/user/pet/${pet._id}/edit`)}
                  onDelete={() => handleDeletePet(pet._id)}
                  onAssignVet={() => openAssignDialog(pet)}
                  onCareClick={() => router.push(`/user/pet/${pet._id}/care`)}
                  onAskVet={() => {
                    const assignedVetId = getAssignedVetId(pet);
                    if (!assignedVetId) {
                      alert("Assign a verified vet first.");
                      return;
                    }
                    const participantName = encodeURIComponent(getAssignedVetLabel(pet));
                    router.push(`/user/vet-chat?participantId=${assignedVetId}&participantRole=provider&participantName=${participantName}`);
                  }}
                  baseUrl={baseUrl}
                />
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
            <p className="text-sm text-muted-foreground">
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

            {loadingVets && <p className="text-xs text-muted-foreground">Loading verified vets...</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeAssignDialog}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted"
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
