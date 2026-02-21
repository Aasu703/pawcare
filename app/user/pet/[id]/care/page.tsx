"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BellRing,
  Clock3,
  Plus,
  Save,
  Syringe,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getUserPetById,
  getUserPetCare,
  PetCareData,
  PetVaccinationItem,
  PetVaccinationStatus,
  updateUserPetCare,
} from "@/lib/api/user/pet";
import { addAppNotification } from "@/lib/notifications/app-notifications";

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
const REMINDER_INTERVAL_OPTIONS = [2, 3, 5, 10] as const;
const FEEDING_PENDING_WINDOW_MINUTES = 30;

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

type FeedingReminder = {
  timeLabel: string;
  minutesFromNow: number;
};

function parseTimeCandidate(timeLabel: string, now: Date, dayOffset = 0) {
  const value = timeLabel.trim();
  if (!TIME_FORMAT.test(value)) return null;
  const [hourPart, minutePart] = value.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + dayOffset,
    hour,
    minute,
    0,
    0,
  );
}

function minutesFromNow(target: Date, now: Date) {
  return Math.round((target.getTime() - now.getTime()) / 60000);
}

function findUpcomingFeeding(feedingTimes: string[], now: Date): FeedingReminder | null {
  let best: FeedingReminder | null = null;

  for (const item of feedingTimes) {
    const todayCandidate = parseTimeCandidate(item, now, 0);
    if (!todayCandidate) continue;
    const candidate =
      todayCandidate.getTime() >= now.getTime()
        ? todayCandidate
        : parseTimeCandidate(item, now, 1);
    if (!candidate) continue;

    const diff = minutesFromNow(candidate, now);
    if (!best || diff < best.minutesFromNow) {
      best = { timeLabel: item, minutesFromNow: diff };
    }
  }

  return best;
}

function findPendingFeeding(
  feedingTimes: string[],
  now: Date,
  windowMinutes: number,
): FeedingReminder | null {
  let best: FeedingReminder | null = null;

  for (const item of feedingTimes) {
    const candidate = parseTimeCandidate(item, now, 0);
    if (!candidate) continue;

    const diff = minutesFromNow(candidate, now);
    if (Math.abs(diff) > windowMinutes) continue;
    if (!best || Math.abs(diff) < Math.abs(best.minutesFromNow)) {
      best = { timeLabel: item, minutesFromNow: diff };
    }
  }

  return best;
}

function formatRelativeMinutes(diff: number) {
  const absoluteMinutes = Math.abs(diff);
  if (absoluteMinutes >= 60) {
    const hours = Math.floor(absoluteMinutes / 60);
    const minutes = absoluteMinutes % 60;
    const durationLabel = `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    return diff >= 0 ? `in ${durationLabel}` : `${durationLabel} ago`;
  }

  return diff >= 0 ? `in ${absoluteMinutes} min` : `${absoluteMinutes} min ago`;
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
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderIntervalMinutes, setReminderIntervalMinutes] = useState<number>(3);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const ageInMonths = useMemo(() => toAgeInMonths(pet?.age), [pet?.age]);

  useEffect(() => {
    const timerId = window.setInterval(() => setNowTick(Date.now()), 60000);
    return () => window.clearInterval(timerId);
  }, []);

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

  const pendingVaccinations = useMemo(() => {
    return vaccinations.filter((item) => {
      if ((item.status || "pending") !== "pending") return false;
      if (typeof item.recommendedByMonths !== "number") return true;
      if (ageInMonths === null) return true;
      return ageInMonths >= item.recommendedByMonths;
    });
  }, [vaccinations, ageInMonths]);

  const upcomingFeeding = useMemo(() => {
    return findUpcomingFeeding(feedingTimes, new Date(nowTick));
  }, [feedingTimes, nowTick]);

  const pendingFeedingNow = useMemo(() => {
    return findPendingFeeding(
      feedingTimes,
      new Date(nowTick),
      FEEDING_PENDING_WINDOW_MINUTES,
    );
  }, [feedingTimes, nowTick]);

  const buildReminderPayload = useCallback(() => {
    const now = new Date();
    const messages: string[] = [];
    const pendingVaccinationNames = pendingVaccinations
      .map((item) => item.vaccine.trim())
      .filter(Boolean);

    if (pendingVaccinationNames.length > 0) {
      const preview = pendingVaccinationNames.slice(0, 2).join(", ");
      const extraCount = pendingVaccinationNames.length - Math.min(2, pendingVaccinationNames.length);
      const suffix = extraCount > 0 ? ` +${extraCount} more` : "";
      messages.push(`Pending vaccinations: ${preview}${suffix}.`);
    }

    const pendingFood = findPendingFeeding(
      feedingTimes,
      now,
      FEEDING_PENDING_WINDOW_MINUTES,
    );
    if (pendingFood) {
      messages.push(
        pendingFood.minutesFromNow >= 0
          ? `Food reminder: feed at ${pendingFood.timeLabel} (${formatRelativeMinutes(
              pendingFood.minutesFromNow,
            )}).`
          : `Food reminder: feeding at ${pendingFood.timeLabel} is pending (${formatRelativeMinutes(
              pendingFood.minutesFromNow,
            )}).`,
      );
    }

    const fingerprint = [
      pendingVaccinationNames.join("|"),
      pendingFood
        ? `${pendingFood.timeLabel}:${pendingFood.minutesFromNow}`
        : "no-pending-food",
    ].join("::");

    return { messages, fingerprint };
  }, [feedingTimes, pendingVaccinations]);

  const triggerCareReminder = useCallback(
    (mode: "auto" | "manual") => {
      const { messages, fingerprint } = buildReminderPayload();
      if (messages.length === 0) {
        if (mode === "manual") {
          toast.success("No pending vaccination or feeding task right now.");
        }
        return;
      }

      const petName = pet?.name || "Pet";
      const title = `${petName} care reminder`;
      const message = messages.join(" ");

      toast.info(title, {
        description: message,
        duration: 5000,
      });

      const slot = Math.floor(
        Date.now() / (Math.max(1, reminderIntervalMinutes) * 60 * 1000),
      );
      addAppNotification({
        audience: "user",
        type: "general",
        title,
        message,
        link: `/user/pet/${petId}/care`,
        dedupeKey:
          mode === "auto"
            ? `pet-care:auto:${petId}:${slot}:${fingerprint}`
            : `pet-care:manual:${petId}:${Date.now()}`,
        pushToBrowser: true,
      });
    },
    [buildReminderPayload, pet?.name, petId, reminderIntervalMinutes],
  );

  useEffect(() => {
    if (!petId || loading || !remindersEnabled) return;

    const intervalId = window.setInterval(() => {
      triggerCareReminder("auto");
    }, Math.max(1, reminderIntervalMinutes) * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [
    loading,
    petId,
    reminderIntervalMinutes,
    remindersEnabled,
    triggerCareReminder,
  ]);

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

      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <BellRing className="h-5 w-5 text-amber-600" />
              Smart Reminders
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Get reminders every few minutes when vaccination or feeding tasks are pending.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="h-4 w-4 accent-[#0f4f57]"
              />
              Enable reminders
            </label>
            <select
              value={reminderIntervalMinutes}
              onChange={(e) => setReminderIntervalMinutes(Number(e.target.value))}
              disabled={!remindersEnabled}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#0f4f57] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {REMINDER_INTERVAL_OPTIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  Every {minutes} min
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => triggerCareReminder("manual")}
              className="rounded-lg border border-[#0f4f57]/30 bg-white px-3 py-2 text-sm font-medium text-[#0f4f57] hover:bg-[#0f4f57]/5"
            >
              Send test reminder
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Pending Vaccinations
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {pendingVaccinations.length}
            </p>
          </div>
          <div className="rounded-xl border border-white bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Feeding Status
            </p>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {pendingFeedingNow
                ? `Pending at ${pendingFeedingNow.timeLabel}`
                : "No pending feeding now"}
            </p>
          </div>
          <div className="rounded-xl border border-white bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Next Feeding
            </p>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {upcomingFeeding
                ? `${upcomingFeeding.timeLabel} (${formatRelativeMinutes(
                    upcomingFeeding.minutesFromNow,
                  )})`
                : "No feeding time set"}
            </p>
          </div>
        </div>
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
