"use client";

import { useEffect, useMemo, useState } from "react";
import { PawPrint, UserRound, HeartPulse, CalendarDays } from "lucide-react";
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
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Assigned Pets Not Available</h1>
        <p className="text-muted-foreground">This page is only available to verified vet providers.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--pc-teal)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-2">Unable to load assigned pets</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-10 text-center">
        <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h1 className="text-2xl font-bold text-foreground mb-2">No pets assigned yet</h1>
        <p className="text-muted-foreground">Assigned pets from users will appear here for one-by-one follow-up.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--pc-teal-dark)]">Assigned Pets</h1>
        <p className="text-muted-foreground mt-1">Review and look after each assigned pet one by one.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-border rounded-xl p-4 space-y-3">
          {pets.map((pet) => {
            const isActive = String(pet?._id) === selectedPetId;
            return (
              <button
                key={String(pet?._id)}
                onClick={() => setSelectedPetId(String(pet?._id))}
                className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                  isActive ? "border-[var(--pc-teal)] bg-[var(--pc-teal)]/5" : "border-border hover:bg-muted"
                }`}
              >
                <p className="font-semibold text-foreground">{pet?.name || "Unnamed pet"}</p>
                <p className="text-xs text-muted-foreground capitalize">{pet?.species || "Unknown species"}</p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-6">
          {selectedPet ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedPet?.name || "Pet profile"}</h2>
                <p className="text-sm text-muted-foreground capitalize">
                  {(selectedPet?.species || "unknown")} {selectedPet?.breed ? `• ${selectedPet.breed}` : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-semibold text-foreground">{selectedPet?.age ? `${selectedPet.age} years` : "N/A"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-muted-foreground">Weight</p>
                  <p className="font-semibold text-foreground">{selectedPet?.weight ? `${selectedPet.weight} kg` : "N/A"}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <UserRound className="h-4 w-4" />
                  <span className="font-medium">Owner</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedPet?.owner?.name || selectedPet?.user?.name || selectedPet?.owner?.email || "Not available"}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <HeartPulse className="h-4 w-4" />
                  <span className="font-medium">Care Notes</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedPet?.care?.notes || selectedPet?.carePlan?.notes || "No care notes added yet."}
                </p>
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 text-foreground mb-1">
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-medium">Assigned On</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedPet?.assignedAt
                    ? new Date(selectedPet.assignedAt).toLocaleString()
                    : selectedPet?.updatedAt
                      ? new Date(selectedPet.updatedAt).toLocaleString()
                      : "Not available"}
                </p>
              </div>

              {selectedPet?.owner?._id && (
                <div className="pt-1">
                  <Link
                    href={`/provider/messages?participantId=${selectedPet.owner._id}&participantRole=user&participantName=${encodeURIComponent(selectedPet.owner.name || "Pet Owner")}`}
                    className="inline-flex items-center rounded-lg bg-[var(--pc-teal)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--pc-teal-dark)]"
                  >
                    Send Care Advice
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Select an assigned pet to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
