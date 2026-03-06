"use client";

import { useEffect, useMemo, useState } from "react";
import { PawPrint, UserRound, HeartPulse, CalendarDays, Send } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { canAccessVetFeatures } from "@/lib/provider-access";
import { getAssignedPetsForVet } from "@/lib/api/provider/pet";
import Link from "next/link";
import { addAppNotification } from "@/lib/notifications/app-notifications";

export default function AssignedPetsPage() {
  const { user } = useAuth();
  const hasVetAccess = canAccessVetFeatures(user?.providerType);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string>("");

  const selectedPet = useMemo(
    () => pets.find((pet) => String(pet?._id) === selectedPetId) || null,
    [pets, selectedPetId],
  );

  useEffect(() => {
    async function loadAssignedPets() {
      if (!hasVetAccess) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await getAssignedPetsForVet();
      if (response.success && response.data) {
        const nextPets = Array.isArray(response.data) ? response.data : [];
        setPets(nextPets);

        const providerId = String(user?._id || user?.id || "");
        for (const pet of nextPets) {
          const petId = String(pet?._id || "");
          if (!petId) continue;
          addAppNotification({
            audience: "provider",
            providerType: "vet",
            type: "appointment",
            title: "New pet assignment",
            message: `${pet?.name || "A pet"} has been assigned to you for care follow-up.`,
            link: "/provider/assigned-pets",
            dedupeKey: `vet-assigned-pet:${providerId}:${petId}:${pet?.assignedAt || pet?.updatedAt || "na"}`,
            pushToBrowser: true,
          });
        }

        if (nextPets[0]?._id) {
          setSelectedPetId(String(nextPets[0]._id));
        }
      } else {
        setError(response.message || "Failed to load assigned pets");
      }
      setLoading(false);
    }

    loadAssignedPets();
  }, [hasVetAccess, user?._id, user?.id]);

  if (!hasVetAccess) {
    return (
      <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-8 text-center">
        <PawPrint className="h-10 w-10 text-[var(--pc-text-muted)] mx-auto mb-3" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-foreground mb-2">Assigned Pets Not Available</h1>
        <p className="text-[var(--pc-text-muted)] text-sm">This page is only available to verified vet providers.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--pc-primary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[20px] border border-red-200 p-8 text-center">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-red-700 mb-2">Unable to load assigned pets</h1>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-10 text-center">
        <Image src="/images/pawcare.png" alt="No pets" width={160} height={160} className="mx-auto mb-4 opacity-60" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-foreground mb-2">No pets assigned yet</h1>
        <p className="text-[var(--pc-text-muted)] text-sm">Assigned pets from users will appear here for one-by-one follow-up.</p>
      </div>
    );
  }

  const getCatImage = (name: string) => {
    const hash = (name || "").length % 3;
    return hash === 0 ? "/images/cat.png" : hash === 1 ? "/images/kittiy.png" : "/images/meow.png";
  };

  const speciesEmoji = (species: string) => {
    const s = (species || "").toLowerCase();
    if (s.includes("cat") || s.includes("kitten")) return "🐈";
    if (s.includes("dog")) return "🐕";
    if (s.includes("rabbit") || s.includes("bunny")) return "🐇";
    if (s.includes("bird")) return "🐦";
    return "🐾";
  };

  const isCat = (species: string) => {
    const s = (species || "").toLowerCase();
    return s.includes("cat") || s.includes("kitten");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[var(--pc-primary-light)] flex items-center justify-center text-xl">🐾</div>
          <div>
            <h1 className="font-[var(--font-display)] text-2xl font-bold text-foreground">Assigned Pets</h1>
            <p className="text-sm text-[var(--pc-text-muted)]">Review and care for each pet assigned to you</p>
          </div>
        </div>
        <span className="bg-[var(--pc-teal-light)] text-[var(--pc-teal)] rounded-full px-4 py-1.5 font-semibold text-sm">{pets.length} Pet{pets.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Pet List */}
        <div className="space-y-3">
          {pets.map((pet) => {
            const isActive = String(pet?._id) === selectedPetId;
            return (
              <button
                key={String(pet?._id)}
                onClick={() => setSelectedPetId(String(pet?._id))}
                className={`w-full text-left rounded-[16px] border p-4 transition-all duration-200 flex gap-3 items-center ${
                  isActive
                    ? "border-[var(--pc-primary)] bg-[var(--pc-primary-light)]/30 shadow-sm"
                    : "border-[var(--pc-border)] bg-white hover:border-[var(--pc-primary)] hover:shadow-sm"
                }`}
              >
                <div className="w-[48px] h-[48px] rounded-[12px] overflow-hidden flex-shrink-0 relative">
                  {isCat(pet?.species) ? (
                    <Image src={getCatImage(pet?.name)} alt={pet?.species || "Pet"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--pc-cream)] flex items-center justify-center text-xl">{speciesEmoji(pet?.species)}</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{pet?.name || "Unnamed pet"}</p>
                  <p className="text-xs text-[var(--pc-text-muted)] capitalize">{pet?.species || "Unknown"}{pet?.breed ? ` · ${pet.breed}` : ""}</p>
                  <span className="text-xs text-green-500 font-medium">● Active</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT — Pet Detail */}
        <div className="lg:col-span-2">
          {selectedPet ? (
            <div className="bg-white rounded-[24px] border border-[var(--pc-border)] overflow-hidden">
              {/* Banner */}
              <div className="h-[140px] relative overflow-hidden">
                {isCat(selectedPet?.species) ? (
                  <>
                    <Image src={getCatImage(selectedPet?.name)} alt="" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-white/60" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--pc-primary-light)] to-[var(--pc-teal-light)]" />
                )}
              </div>

              {/* Avatar overlapping */}
              <div className="w-[72px] h-[72px] rounded-full border-4 border-white shadow-md -mt-9 ml-5 overflow-hidden relative z-10 bg-[var(--pc-cream)]">
                {isCat(selectedPet?.species) ? (
                  <Image src={getCatImage(selectedPet?.name)} alt={selectedPet?.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{speciesEmoji(selectedPet?.species)}</div>
                )}
              </div>

              <div className="px-5 pb-6">
                <h2 className="font-[var(--font-display)] text-xl font-semibold text-foreground mt-2">{selectedPet?.name || "Pet profile"}</h2>
                <p className="text-sm text-[var(--pc-text-muted)] capitalize mb-4">
                  {selectedPet?.species || "Unknown"}{selectedPet?.breed ? ` · ${selectedPet.breed}` : ""}
                </p>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-[var(--pc-cream)] rounded-[16px] p-4">
                    <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] mb-1 flex items-center gap-1.5">🎂 Age</p>
                    <p className="font-semibold text-sm text-foreground">{selectedPet?.age ? `${selectedPet.age} years` : "N/A"}</p>
                  </div>
                  <div className="bg-[var(--pc-cream)] rounded-[16px] p-4">
                    <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] mb-1 flex items-center gap-1.5">⚖️ Weight</p>
                    <p className="font-semibold text-sm text-foreground">{selectedPet?.weight ? `${selectedPet.weight} kg` : "N/A"}</p>
                  </div>
                </div>

                {/* Owner */}
                <div className="bg-[var(--pc-cream)] rounded-[16px] p-4 mb-3">
                  <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] mb-1 flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5" /> Owner
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {selectedPet?.owner?.name || selectedPet?.user?.name || selectedPet?.owner?.email || "Not available"}
                  </p>
                </div>

                {/* Care Notes */}
                <div className="bg-[var(--pc-cream)] rounded-[16px] p-4 mb-3">
                  <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] mb-1 flex items-center gap-1.5">
                    <HeartPulse className="h-3.5 w-3.5" /> Care Notes
                  </p>
                  <p className="text-sm text-[var(--pc-text-muted)] whitespace-pre-line">
                    {selectedPet?.care?.notes || selectedPet?.carePlan?.notes || "No care notes added yet."}
                  </p>
                </div>

                {/* Assigned On */}
                <div className="bg-[var(--pc-cream)] rounded-[16px] p-4 mb-4">
                  <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)] mb-1 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> Assigned On
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedPet?.assignedAt
                      ? new Date(selectedPet.assignedAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })
                      : selectedPet?.updatedAt
                        ? new Date(selectedPet.updatedAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })
                        : "Not available"}
                  </p>
                </div>

                {/* Send Care Advice button */}
                {selectedPet?.owner?._id && (
                  <Link
                    href={`/provider/messages?participantId=${selectedPet.owner._id}&participantRole=user&participantName=${encodeURIComponent(selectedPet.owner.name || "Pet Owner")}`}
                    className="bg-[var(--pc-primary)] text-white rounded-[14px] px-6 py-3 font-semibold flex items-center gap-2 w-full justify-center hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200"
                  >
                    💌 Send Care Advice
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-[var(--pc-border)] py-20 text-center">
              <Image src="/images/pawcare.png" alt="Select a pet" width={100} height={100} className="mx-auto mb-4 opacity-40" />
              <p className="text-[var(--pc-text-muted)] text-sm">Select an assigned pet to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
