"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock3, Plus, Save, Syringe, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getUserPetById,
  getUserPetCare,
  PetCareData,
  PetVaccinationItem,
  PetVaccinationStatus,
  updateUserPetCare,
} from "@/lib/api/user/pet";

type PetSummary = {
  _id: string;
  name: string;
  species: string;
  age?: number;
};

type VaccineTemplate = {
  vaccine: string;
  recommendedByMonths: number;
};

const TIME_FORMAT = /^([01]\d|2[0-3]):([0-5]\d)$/;

const SPECIES_VACCINE_TEMPLATES: Record<string, VaccineTemplate[]> = {
  dog: [
    { vaccine: "DHPP", recommendedByMonths: 2 },
    { vaccine: "Rabies", recommendedByMonths: 3 },
    { vaccine: "Leptospirosis", recommendedByMonths: 3 },
    { vaccine: "Bordetella", recommendedByMonths: 4 },
  ],
  cat: [
    { vaccine: "FVRCP", recommendedByMonths: 2 },
    { vaccine: "Rabies", recommendedByMonths: 3 },
    { vaccine: "FeLV", recommendedByMonths: 2 },
  ],
  bird: [{ vaccine: "Polyomavirus", recommendedByMonths: 2 }],
  rabbit: [{ vaccine: "RHDV2", recommendedByMonths: 2 }],
  other: [{ vaccine: "Rabies", recommendedByMonths: 3 }],
};

function getTemplatesForSpecies(species?: string) {
  const key = (species || "").trim().toLowerCase();
  return SPECIES_VACCINE_TEMPLATES[key] || SPECIES_VACCINE_TEMPLATES.other;
}

function toAgeInMonths(age?: number) {
  if (typeof age !== "number" || Number.isNaN(age) || age < 0) {
    return null;
  }
  return Math.round(age * 12);
}

function mergeVaccinations(
  existing: PetVaccinationItem[],
  templates: VaccineTemplate[],
): PetVaccinationItem[] {
  const map = new Map<string, PetVaccinationItem>();

  for (const item of existing || []) {
    const name = (item.vaccine || "").trim();
    if (!name) continue;
    map.set(name.toLowerCase(), {
      vaccine: name,
      recommendedByMonths: item.recommendedByMonths,
      dosesTaken: Number(item.dosesTaken || 0),
      status: item.status || "pending",
    });
  }

  for (const template of templates) {
    const key = template.vaccine.toLowerCase();
    const existingItem = map.get(key);
    if (existingItem) {
      if (typeof existingItem.recommendedByMonths !== "number") {
        existingItem.recommendedByMonths = template.recommendedByMonths;
      }
      continue;
    }
    map.set(key, {
      vaccine: template.vaccine,
      recommendedByMonths: template.recommendedByMonths,
      dosesTaken: 0,
      status: "pending",
    });
  }

  return Array.from(map.values()).sort((a, b) => {
    const left = typeof a.recommendedByMonths === "number" ? a.recommendedByMonths : 999;
    const right = typeof b.recommendedByMonths === "number" ? b.recommendedByMonths : 999;
    return left - right;
  });
}

function getDueLabel(ageInMonths: number | null, recommendedByMonths?: number) {
  if (typeof recommendedByMonths !== "number") return "No schedule";
  if (ageInMonths === null) return `Recommended by ${recommendedByMonths} mo`;
  if (ageInMonths >= recommendedByMonths) return "Due now";
  return `Due in ${recommendedByMonths - ageInMonths} mo`;
}

export default function PetCarePage() {
  const params = useParams();
  const petId = params.id as string;

  const [pet, setPet] = useState<PetSummary | null>(null);
  const [feedingTimes, setFeedingTimes] = useState<string[]>(["08:00", "18:00"]);
  const [vaccinations, setVaccinations] = useState<PetVaccinationItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ageInMonths = useMemo(() => toAgeInMonths(pet?.age), [pet?.age]);

  useEffect(() => {
    if (!petId) return;
    const load = async () => {
      setLoading(true);
      const [petRes, careRes] = await Promise.all([getUserPetById(petId), getUserPetCare(petId)]);

      if (!petRes.success || !petRes.data) {
        toast.error(petRes.message || "Failed to load pet");
        setLoading(false);
        return;
      }

      const currentPet: PetSummary = {
        _id: petRes.data._id,
        name: petRes.data.name,
        species: petRes.data.species,
        age: typeof petRes.data.age === "number" ? petRes.data.age : undefined,
      };
      setPet(currentPet);

      const templates = getTemplatesForSpecies(currentPet.species);
      const currentCare: PetCareData | undefined = careRes.success ? careRes.data : undefined;

      setFeedingTimes(
        currentCare?.feedingTimes && currentCare.feedingTimes.length > 0
          ? currentCare.feedingTimes
          : ["08:00", "18:00"],
      );
      setVaccinations(mergeVaccinations(currentCare?.vaccinations || [], templates));
      setNotes(currentCare?.notes || "");
      setLoading(false);
    };

    load();
  }, [petId]);

  const updateFeedingTime = (index: number, value: string) => {
    setFeedingTimes((prev) => prev.map((time, i) => (i === index ? value : time)));
  };

  const addFeedingTime = () => {
    setFeedingTimes((prev) => (prev.length >= 12 ? prev : [...prev, ""]));
  };

  const removeFeedingTime = (index: number) => {
    setFeedingTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const addVaccination = () => {
    setVaccinations((prev) => [
      ...prev,
      { vaccine: "", recommendedByMonths: undefined, dosesTaken: 0, status: "pending" },
    ]);
  };

  const removeVaccination = (index: number) => {
    setVaccinations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVaccination = <K extends keyof PetVaccinationItem>(
    index: number,
    key: K,
    value: PetVaccinationItem[K],
  ) => {
    setVaccinations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };

  const handleSave = async () => {
    const normalizedTimes = feedingTimes.map((item) => item.trim()).filter(Boolean);
    if (normalizedTimes.length === 0) {
      toast.error("Add at least one feeding time");
      return;
    }
    if (normalizedTimes.some((item) => !TIME_FORMAT.test(item))) {
      toast.error("Feeding times must use HH:mm format");
      return;
    }

    const normalizedVaccinations = vaccinations.map((item) => ({
      vaccine: item.vaccine.trim(),
      recommendedByMonths:
        typeof item.recommendedByMonths === "number" ? item.recommendedByMonths : undefined,
      dosesTaken: Math.max(0, Number(item.dosesTaken || 0)),
      status: (item.status || "pending") as PetVaccinationStatus,
    }));

    if (normalizedVaccinations.some((item) => !item.vaccine)) {
      toast.error("Vaccine name cannot be empty");
      return;
    }

    const dedupe = new Set<string>();
    for (const item of normalizedVaccinations) {
      const key = item.vaccine.toLowerCase();
      if (dedupe.has(key)) {
        toast.error("Duplicate vaccine names are not allowed");
        return;
      }
      dedupe.add(key);
    }

    setSaving(true);
    const response = await updateUserPetCare(petId, {
      feedingTimes: normalizedTimes,
      vaccinations: normalizedVaccinations,
      notes: notes.trim(),
    });
    setSaving(false);

    if (!response.success) {
      toast.error(response.message || "Failed to update pet care");
      return;
    }

    toast.success("Care plan saved");
    const templates = getTemplatesForSpecies(pet?.species);
    setVaccinations(mergeVaccinations(response.data?.vaccinations || [], templates));
    setFeedingTimes(response.data?.feedingTimes || normalizedTimes);
    setNotes(response.data?.notes || notes.trim());
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
      </div>
    );
  }

  const completedVaccines = vaccinations.filter((item) => item.status === "done").length;

  return (
    <div className="space-y-6">
      <Link href="/user/pet" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-5 w-5" />
        Back to Pets
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-3xl font-bold text-gray-900">{pet?.name}&apos;s Care Plan</h1>
        <p className="mt-1 text-gray-500">
          Track daily feeding and vaccination progress for {pet?.species || "your pet"}.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-[#0f4f57]" />
            <h2 className="text-xl font-semibold text-gray-900">Feeding Timetable</h2>
          </div>
          <button
            type="button"
            onClick={addFeedingTime}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Add time
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {feedingTimes.map((time, index) => (
            <div key={`feeding-${index}`} className="flex items-center gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => updateFeedingTime(index, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-[#0f4f57] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeFeedingTime(index)}
                disabled={feedingTimes.length === 1}
                className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Remove feeding time"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-[#0f4f57]" />
            <h2 className="text-xl font-semibold text-gray-900">Vaccination Checklist</h2>
          </div>
          <button
            type="button"
            onClick={addVaccination}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Add vaccine
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-[#0f4f57]/5 px-4 py-3 text-sm text-[#0f4f57]">
          Completed vaccinations: <span className="font-semibold">{completedVaccines}</span> / {vaccinations.length}
        </div>

        <div className="space-y-3">
          {vaccinations.map((item, index) => (
            <div key={`vaccine-${index}`} className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={item.vaccine}
                  onChange={(e) => updateVaccination(index, "vaccine", e.target.value)}
                  placeholder="Vaccine name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-[#0f4f57] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeVaccination(index)}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2.5 text-gray-500 hover:bg-gray-50 sm:w-auto"
                  aria-label="Remove vaccination"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Recommended By (months)</label>
                  <input
                    type="number"
                    min={0}
                    value={item.recommendedByMonths ?? ""}
                    onChange={(e) =>
                      updateVaccination(
                        index,
                        "recommendedByMonths",
                        e.target.value === "" ? undefined : Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-[#0f4f57] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Doses Taken</label>
                  <input
                    type="number"
                    min={0}
                    value={item.dosesTaken}
                    onChange={(e) => updateVaccination(index, "dosesTaken", Math.max(0, Number(e.target.value || 0)))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-[#0f4f57] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Status (MCQ)</label>
                  <select
                    value={item.status}
                    onChange={(e) => updateVaccination(index, "status", e.target.value as PetVaccinationStatus)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-[#0f4f57] focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="done">Done</option>
                    <option value="not_required">Not Required</option>
                  </select>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {getDueLabel(ageInMonths, item.recommendedByMonths)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Care Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add any care notes, food preferences, or reminders..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#0f4f57] focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-[#0f4f57] px-6 py-3 font-semibold text-white hover:bg-[#0c4148] disabled:opacity-70"
      >
        <Save className="h-5 w-5" />
        {saving ? "Saving..." : "Save Care Plan"}
      </button>
    </div>
  );
}
