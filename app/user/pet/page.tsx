'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, PawPrint } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
      <div className="min-h-screen bg-[var(--pc-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-[3px] border-[var(--pc-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--pc-text-muted)]">Loading your pets…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--pc-cream)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-14 h-14 rounded-[16px] bg-red-50 flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground mb-2">Error Loading Pets</h2>
          <p className="text-sm text-[var(--pc-text-muted)] mb-6">{error}</p>
          <button
            onClick={fetchPets}
            className="bg-[var(--pc-primary)] text-white rounded-[12px] px-5 py-2.5 font-semibold text-sm hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--pc-cream)] text-foreground">
      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-b-[32px] bg-gradient-to-br from-[var(--pc-teal-dark)] to-[var(--pc-teal)] text-white px-6 py-8">
        <Image src="/images/pawcare.png" alt="" width={160} height={160} className="absolute -right-4 -bottom-6 opacity-10 rotate-12 pointer-events-none select-none" />

        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-[10px] bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-[var(--font-display)] text-2xl font-bold">My Pets</h1>
              <p className="text-white/70 text-sm mt-0.5">{pets.length} furry friend{pets.length !== 1 ? "s" : ""} registered</p>
            </div>
          </div>
          <Link
            href="/user/pet/add"
            className="flex items-center gap-2 bg-[var(--pc-primary)] text-white rounded-[12px] px-5 py-2.5 font-semibold text-sm hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Pet
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {pets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-[24px] border border-[var(--pc-border)]"
          >
            <Image src="/images/pawcare.png" alt="No pets yet" width={120} height={120} className="mx-auto mb-5 opacity-50" />
            <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground mb-2">No Pets Yet</h2>
            <p className="text-sm text-[var(--pc-text-muted)] mb-6 max-w-md mx-auto">
              Start building your pet family! Add your first furry friend to keep track of their health, appointments, and more.
            </p>
            <Link
              href="/user/pet/add"
              className="inline-flex items-center gap-2 bg-[var(--pc-primary)] text-white rounded-[12px] px-6 py-3 font-semibold text-sm hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Your First Pet
            </Link>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* Assign Vet Dialog */}
      <Dialog open={Boolean(assignPet)} onOpenChange={(open) => (!open ? closeAssignDialog() : null)}>
        <DialogContent className="sm:max-w-md rounded-[20px] p-0 overflow-hidden border-none">
          {/* Dialog header */}
          <div className="px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle className="font-[var(--font-display)] text-lg font-bold">Assign Verified Vet</DialogTitle>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6 space-y-4">
            <p className="text-sm text-[var(--pc-text-muted)]">
              Assign a PawCare-verified vet for <span className="font-semibold text-foreground">{assignPet?.name}</span>. The selected vet can review assigned pets one by one.
            </p>

            <Select value={selectedVetId} onValueChange={setSelectedVetId}>
              <SelectTrigger className="rounded-[12px] border-[1.5px] border-[var(--pc-border)] bg-[var(--pc-cream)] h-11">
                <SelectValue placeholder="Choose a verified vet" />
              </SelectTrigger>
              <SelectContent className="rounded-[12px]">
                <SelectItem value="unassigned">No vet assigned</SelectItem>
                {verifiedVets.map((vet) => (
                  <SelectItem key={vet._id} value={vet._id}>
                    {vet.clinicOrShopName || vet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {loadingVets && <p className="text-xs text-[var(--pc-text-muted)]">Loading verified vets…</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeAssignDialog}
                className="border-[1.5px] border-[var(--pc-border)] text-[var(--pc-text-muted)] rounded-[12px] px-5 py-2.5 font-semibold text-sm bg-transparent hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)] hover:bg-[var(--pc-primary-light)] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignVet}
                disabled={assigningVet}
                className="bg-[var(--pc-primary)] text-white rounded-[12px] px-5 py-2.5 font-semibold text-sm hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              >
                {assigningVet ? 'Saving…' : 'Save Assignment'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
