import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Bell,
  Clock,
  Syringe,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  getUserPetById,
  getUserPetCare,
  updateUserPetCare,
  type PetVaccinationItem,
  type PetVaccinationStatus,
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
  if (typeof age !== "number" || Number.isNaN(age) || age < 0) return null;
  return Math.round(age * 12);
}

function mergeVaccinations(existing: PetVaccinationItem[], templates: VaccineTemplate[]) {
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

function findUpcomingFeeding(feedingTimes: string[], now: Date) {
  let best: { timeLabel: string; minutesFromNow: number } | null = null;

  for (const item of feedingTimes) {
    const todayCandidate = parseTimeCandidate(item, now, 0);
    if (!todayCandidate) continue;
    const candidate = todayCandidate.getTime() >= now.getTime() ? todayCandidate : parseTimeCandidate(item, now, 1);
    if (!candidate) continue;

    const diff = minutesFromNow(candidate, now);
    if (!best || diff < best.minutesFromNow) best = { timeLabel: item, minutesFromNow: diff };
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

export function CarePlanPage() {
  const params = useParams();
  const petId = params.id as string;

  const [pet, setPet] = useState<PetSummary | null>(null);
  const [feedingTimes, setFeedingTimes] = useState<string[]>(["08:00", "18:00"]);
  const [vaccinations, setVaccinations] = useState<PetVaccinationItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderIntervalMinutes, setReminderIntervalMinutes] = useState(3);
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => setNowTick(Date.now()), 60000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!petId) return;

    const loadCare = async () => {
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
      const currentCare = careRes.success ? careRes.data : undefined;

      setFeedingTimes(
        currentCare?.feedingTimes && currentCare.feedingTimes.length > 0
          ? currentCare.feedingTimes
          : ["08:00", "18:00"],
      );
      setVaccinations(mergeVaccinations(currentCare?.vaccinations || [], templates));
      setNotes(currentCare?.notes || "");
      setLoading(false);
    };

    loadCare();
  }, [petId]);

  const ageInMonths = useMemo(() => toAgeInMonths(pet?.age), [pet?.age]);
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

  const completedVaccines = vaccinations.filter((item) => item.status === "done").length;

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
    setVaccinations((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1a3a2a] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:py-10">
      <Link
        href="/user/pet"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#78716c] transition-colors hover:text-[#1a3a2a]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pets
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-bold text-[#1c1917] md:text-4xl">
          {pet?.name || "Pet"}&apos;s Care Plan
        </h1>
        <p className="text-sm text-[#78716c] md:text-base">
          Track daily feeding and vaccination progress for {pet?.species || "your pet"}.
        </p>
      </div>

      <section className="rounded-2xl border border-[#fcd34d] bg-[#fffbeb] p-4 shadow-sm md:p-6">
        <div className="mb-5 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#f59e0b]" />
              <h2 className="text-lg font-semibold text-[#1c1917]">Smart Reminders</h2>
            </div>
            <p className="text-xs text-[#78716c] md:text-sm">
              Keep reminders enabled so pending care tasks stay visible while you manage the plan.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto">
            <label className="flex items-center gap-2 rounded-lg border border-[#fcd34d] bg-white px-3 py-2 text-sm font-medium text-[#1c1917]">
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-[#f59e0b]"
              />
              Enable reminders
            </label>

            <div className="relative">
              <select
                value={reminderIntervalMinutes}
                onChange={(e) => setReminderIntervalMinutes(Number(e.target.value))}
                disabled={!remindersEnabled}
                className="h-10 w-full appearance-none rounded-lg border border-[#fcd34d] bg-white pl-3 pr-8 text-sm font-medium text-[#1c1917] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <option value={3}>Every 3 min</option>
                <option value={5}>Every 5 min</option>
                <option value={10}>Every 10 min</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#f59e0b]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-[#fcd34d]/30 border-l-4 border-l-amber-400 bg-white/80 p-4 shadow-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#78716c]">
              Pending Vaccinations
            </p>
            <p className="text-2xl font-bold text-[#1c1917]">{pendingVaccinations.length}</p>
          </div>
          <div className="rounded-xl border border-[#fcd34d]/30 border-l-4 border-l-emerald-400 bg-white/80 p-4 shadow-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#78716c]">
              Feeding Status
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#1c1917]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              {upcomingFeeding ? "Schedule active" : "No feeding times"}
            </p>
          </div>
          <div className="rounded-xl border border-[#fcd34d]/30 border-l-4 border-l-blue-400 bg-white/80 p-4 shadow-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#78716c]">
              Next Feeding
            </p>
            <p className="mt-1 text-sm font-medium text-[#1c1917]">
              {upcomingFeeding ? (
                <>
                  <span className="text-lg font-bold">{upcomingFeeding.timeLabel}</span>
                  <span className="ml-1 text-[#78716c]">
                    ({formatRelativeMinutes(upcomingFeeding.minutesFromNow)})
                  </span>
                </>
              ) : (
                "No feeding time set"
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e7e5e4] bg-white p-4 shadow-sm md:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#1a3a2a]" />
            <h2 className="text-lg font-semibold text-[#1c1917]">Feeding Timetable</h2>
          </div>
          <button
            type="button"
            onClick={addFeedingTime}
            className="inline-flex items-center gap-1 rounded-full border border-[#e7e5e4] bg-stone-50 px-3 py-1.5 text-sm font-medium text-[#1a3a2a] transition-colors hover:bg-stone-100"
          >
            <Plus className="h-3.5 w-3.5" />
            Add time
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {feedingTimes.map((time, index) => (
            <div key={`feeding-${index}`} className="flex items-center gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => updateFeedingTime(index, e.target.value)}
                className="h-11 w-full rounded-xl border border-[#e7e5e4] bg-stone-50 px-4 text-sm font-medium text-[#1c1917] focus:border-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/10"
              />
              <button
                type="button"
                onClick={() => removeFeedingTime(index)}
                disabled={feedingTimes.length === 1}
                className="rounded-lg p-2 text-[#78716c] transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#e7e5e4] bg-white p-4 shadow-sm md:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-[#1a3a2a]" />
            <h2 className="text-lg font-semibold text-[#1c1917]">Vaccination Checklist</h2>
          </div>
          <button
            type="button"
            onClick={addVaccination}
            className="inline-flex items-center gap-1 rounded-full border border-[#e7e5e4] bg-stone-50 px-3 py-1.5 text-sm font-medium text-[#1a3a2a] transition-colors hover:bg-stone-100"
          >
            <Plus className="h-3.5 w-3.5" />
            Add vaccine
          </button>
        </div>

        <div className="mb-5">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-[#78716c]">
            <span>
              Completed vaccinations: {completedVaccines} / {vaccinations.length}
            </span>
            <span>
              {vaccinations.length === 0
                ? "0%"
                : `${Math.round((completedVaccines / vaccinations.length) * 100)}%`}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width:
                  vaccinations.length === 0
                    ? "0%"
                    : `${Math.round((completedVaccines / vaccinations.length) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          {vaccinations.map((item, index) => (
            <div key={`vaccine-${index}`} className="space-y-4 rounded-xl border border-[#e7e5e4] p-4">
              <div className="flex items-start gap-3">
                <input
                  type="text"
                  value={item.vaccine}
                  onChange={(e) => updateVaccination(index, "vaccine", e.target.value)}
                  placeholder="Vaccine name"
                  className="h-10 w-full rounded-lg border border-[#e7e5e4] bg-stone-50 px-3 text-sm font-semibold text-[#1c1917] focus:border-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/10"
                />
                <button
                  type="button"
                  onClick={() => removeVaccination(index)}
                  className="mt-0.5 rounded-lg p-2 text-[#78716c] transition-colors hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#78716c]">
                    Recommended By (months)
                  </label>
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
                    className="h-10 w-full rounded-lg border border-[#e7e5e4] bg-stone-50 px-3 text-sm text-[#1c1917] focus:border-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#78716c]">
                    Doses Taken
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={item.dosesTaken}
                    onChange={(e) =>
                      updateVaccination(index, "dosesTaken", Math.max(0, Number(e.target.value || 0)))
                    }
                    className="h-10 w-full rounded-lg border border-[#e7e5e4] bg-stone-50 px-3 text-sm text-[#1c1917] focus:border-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#78716c]">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateVaccination(index, "status", e.target.value as PetVaccinationStatus)
                      }
                      className="h-10 w-full appearance-none rounded-lg border border-[#e7e5e4] bg-stone-50 pl-3 pr-8 text-sm text-[#1c1917] focus:border-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/10"
                    >
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                      <option value="not_required">Not Required</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#78716c]" />
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                  getDueLabel(ageInMonths, item.recommendedByMonths) === "Due now"
                    ? "border-rose-100 bg-rose-50 text-rose-600"
                    : "border-emerald-100 bg-emerald-50 text-emerald-700"
                }`}
              >
                {getDueLabel(ageInMonths, item.recommendedByMonths) === "Due now" ? (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                )}
                <span>{getDueLabel(ageInMonths, item.recommendedByMonths)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#e7e5e4] bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#1a3a2a]" />
          <h2 className="text-lg font-semibold text-[#1c1917]">Care Notes</h2>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any care notes, food preferences, or reminders..."
          className="min-h-[120px] w-full resize-none rounded-xl border border-[#e7e5e4] bg-stone-50 p-4 text-sm text-[#1c1917] placeholder:text-stone-400 focus:border-[#1a3a2a] focus:outline-none focus:ring-2 focus:ring-[#1a3a2a]/10"
        />
      </section>

      <div className="pb-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a3a2a] px-8 py-3 font-semibold text-white shadow-lg shadow-[#1a3a2a]/20 transition-all hover:bg-[#0f2318] disabled:opacity-70 sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Care Plan"}
        </button>
      </div>
    </div>
  );
}
