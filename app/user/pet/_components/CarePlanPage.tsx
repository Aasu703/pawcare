import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Minus,
  Check,
  AlertTriangle,
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

/* ── Helpers for feeding timetable ── */
function getMealPeriod(time: string) {
  const hour = parseInt(time.split(":")[0], 10);
  if (isNaN(hour)) return { label: "Meal", icon: "🍽️", color: "text-amber-500" };
  if (hour >= 5 && hour <= 11) return { label: "Morning", icon: "🌅", color: "text-amber-500" };
  if (hour >= 12 && hour <= 16) return { label: "Afternoon", icon: "☀️", color: "text-yellow-500" };
  if (hour >= 17 && hour <= 20) return { label: "Evening", icon: "🌆", color: "text-[var(--pc-teal)]" };
  return { label: "Night", icon: "🌙", color: "text-indigo-400" };
}

function formatTime12(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return { display: time, period: "" };
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return { display: `${String(h12).padStart(2, "0")}:${m}`, period: ampm };
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

  /* ── Format upcoming feeding time ── */
  const nextFeedingFormatted = useMemo(() => {
    if (!upcomingFeeding) return null;
    return formatTime12(upcomingFeeding.timeLabel);
  }, [upcomingFeeding]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--pc-primary)] border-t-transparent"></div>
      </div>
    );
  }

  const petName = pet?.name || "Pet";

  return (
    <div
      className="min-h-screen bg-[var(--pc-cream)] px-4 py-6 md:py-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><text y='30' font-size='20' opacity='0.03'>🐾</text></svg>")`,
      }}
    >
      <div className="mx-auto w-full max-w-5xl">

        {/* ═══════ SECTION 1 — HERO BANNER ═══════ */}
        <div
          className="animate-[fadeUp_0.4s_ease_forwards] relative mb-6 flex min-h-[140px] items-center gap-5 overflow-hidden rounded-[28px] p-6"
          style={{ background: "linear-gradient(135deg, #FFF0EA 0%, #EFF6EE 60%, #E6F4F2 100%)" }}
        >
          {/* Decorative cat image */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[180px] select-none">
            <Image
              src="/images/kittiy.png"
              fill
              className="object-contain object-right-bottom opacity-40"
              alt=""
            />
          </div>

          {/* Scattered paw prints */}
          <span className="pointer-events-none absolute right-[140px] top-3 select-none text-xs opacity-[0.08] rotate-[15deg]">🐾</span>
          <span className="pointer-events-none absolute right-[60px] top-6 select-none text-lg opacity-[0.07] -rotate-[20deg]">🐾</span>
          <span className="pointer-events-none absolute right-[100px] top-[70px] select-none text-sm opacity-[0.06] rotate-[40deg]">🐾</span>
          <span className="pointer-events-none absolute right-[30px] top-[90px] select-none text-xs opacity-[0.09] -rotate-[10deg]">🐾</span>

          {/* Left content */}
          <div className="relative z-10 flex-1">
            <Link
              href="/user/pet"
              className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-sm text-[var(--pc-text-muted)] transition-colors hover:text-[var(--pc-primary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Pets
            </Link>

            <h1 className="text-3xl font-bold text-[var(--pc-text)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
              {petName}&apos;s Care Plan 🐾
            </h1>
            <p className="mt-1 text-sm text-[var(--pc-text-muted)]">
              Track daily feeding and vaccination progress for {pet?.species || "your pet"}.
            </p>

            {/* Status pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                💉 {pendingVaccinations.length} pending vaccine{pendingVaccinations.length !== 1 ? "s" : ""}
              </span>
              <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                🍽️ {upcomingFeeding ? "Schedule active" : "No schedule"}
              </span>
              {nextFeedingFormatted && (
                <span className="rounded-full border border-[var(--pc-primary)]/20 bg-[var(--pc-primary-light)] px-3 py-1.5 text-xs font-semibold text-[var(--pc-primary)]">
                  ⏰ Next: {nextFeedingFormatted.display} {nextFeedingFormatted.period}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ═══════ SECTION 2 — SMART REMINDERS ═══════ */}
        <div
          className="animate-[fadeUp_0.4s_ease_forwards] relative mb-6 overflow-hidden rounded-[24px] border border-amber-200 p-5"
          style={{ background: "linear-gradient(135deg, #FFFBEB, #FFF7E6)", animationDelay: "100ms" }}
        >
          {/* Decorative bell */}
          <span className="pointer-events-none absolute right-3 top-3 select-none text-4xl opacity-10">🔔</span>

          {/* Header row */}
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-amber-800" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                  Smart Reminders
                </h2>
              </div>
              <p className="text-sm text-amber-700/70">
                Keep reminders enabled so pending care tasks stay visible while you manage the plan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Pill toggle */}
              <button
                type="button"
                onClick={() => setRemindersEnabled(!remindersEnabled)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  remindersEnabled
                    ? "border-amber-400 bg-amber-400 text-white"
                    : "border-amber-200 bg-white text-amber-700 hover:border-amber-400"
                }`}
              >
                {remindersEnabled ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Reminders On
                  </>
                ) : (
                  "Enable Reminders"
                )}
              </button>

              {/* Interval dropdown */}
              <div className="relative">
                <select
                  value={reminderIntervalMinutes}
                  onChange={(e) => setReminderIntervalMinutes(Number(e.target.value))}
                  disabled={!remindersEnabled}
                  className="cursor-pointer appearance-none rounded-full border border-amber-200 bg-white py-2 pl-4 pr-8 text-sm font-semibold text-amber-700 outline-none transition-colors focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value={3}>Every 3 min</option>
                  <option value={5}>Every 5 min</option>
                  <option value={10}>Every 10 min</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Card 1 — Pending Vaccinations */}
            <div className="rounded-[16px] border border-amber-100 bg-white p-4 text-center shadow-sm">
              <div className="mb-1 text-2xl">💉</div>
              <p className="text-3xl font-bold text-amber-600" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                {pendingVaccinations.length}
              </p>
              <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Pending Vaccines</p>
            </div>

            {/* Card 2 — Feeding Status */}
            <div className="rounded-[16px] border border-amber-100 bg-white p-4 text-center shadow-sm">
              <div className="mb-1 text-2xl">🍽️</div>
              <p className={`text-lg font-bold ${upcomingFeeding ? "text-green-600" : "text-[var(--pc-text-muted)]"}`} style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                {upcomingFeeding ? "Active" : "Inactive"}
              </p>
              <div className="mt-0.5 flex items-center justify-center gap-1.5">
                <span className={`inline-block h-2 w-2 rounded-full ${upcomingFeeding ? "bg-green-400" : "bg-gray-300"}`} />
                <p className="text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Feeding Status</p>
              </div>
            </div>

            {/* Card 3 — Next Feeding */}
            <div className="rounded-[16px] border border-amber-100 bg-white p-4 text-center shadow-sm">
              <div className="mb-1 text-2xl">⏰</div>
              {nextFeedingFormatted ? (
                <>
                  <p style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                    <span className="text-2xl font-bold text-[var(--pc-primary)]">{nextFeedingFormatted.display}</span>
                    <span className="ml-0.5 text-sm text-[var(--pc-text-muted)]">{nextFeedingFormatted.period}</span>
                  </p>
                  <p className="text-xs text-[var(--pc-text-muted)]">
                    ({formatRelativeMinutes(upcomingFeeding!.minutesFromNow)})
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-[var(--pc-text-muted)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                  No time set
                </p>
              )}
              <p className="mt-0.5 text-xs uppercase tracking-wider text-[var(--pc-text-muted)]">Next Feeding</p>
            </div>
          </div>
        </div>

        {/* ═══════ SECTION 3 — FEEDING TIMETABLE ═══════ */}
        <div
          className="animate-[fadeUp_0.4s_ease_forwards] mb-6 rounded-[24px] border border-[var(--pc-border)] bg-white p-6 shadow-sm"
          style={{ animationDelay: "200ms" }}
        >
          {/* Section header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--pc-primary-light)] text-xl">
                🍽️
              </div>
              <h2 className="ml-3 text-xl font-semibold text-[var(--pc-text)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                Feeding Timetable
              </h2>
            </div>
            <button
              type="button"
              onClick={addFeedingTime}
              className="flex items-center gap-1.5 rounded-[12px] bg-[var(--pc-primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md hover:brightness-95"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Time
            </button>
          </div>

          {feedingTimes.length === 0 ? (
            /* Empty state */
            <div className="py-8 text-center">
              <div className="mb-3 text-5xl">🍽️</div>
              <p className="text-lg text-[var(--pc-text)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                No feeding times set
              </p>
              <p className="mx-auto mt-1 max-w-[280px] text-sm text-[var(--pc-text-muted)]">
                Add your pet&apos;s meal schedule to track feeding
              </p>
              <button
                type="button"
                onClick={addFeedingTime}
                className="mt-4 inline-flex items-center gap-1.5 rounded-[12px] bg-[var(--pc-primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md hover:brightness-95"
              >
                <Plus className="h-3.5 w-3.5" />
                Add First Meal
              </button>
            </div>
          ) : (
            /* Timeline */
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute bottom-4 left-[23px] top-4 w-[2px]"
                style={{ background: "linear-gradient(to bottom, rgba(232,133,90,0.3), rgba(45,125,116,0.2))" }}
              />

              {feedingTimes.map((time, index) => {
                const meal = getMealPeriod(time);
                const t12 = formatTime12(time);
                const hour = parseInt(time.split(":")[0], 10);
                const dotColor = !isNaN(hour) && hour >= 17 ? "bg-[var(--pc-teal)]" : "bg-[var(--pc-primary)]";

                return (
                  <div key={`feeding-${index}`} className="group relative mb-4 flex items-center gap-4">
                    {/* Timeline dot */}
                    <div className={`absolute left-[16px] z-10 h-[14px] w-[14px] rounded-full border-2 border-white shadow-sm ${dotColor}`} />

                    {/* Meal card */}
                    <div className="ml-10 flex flex-1 items-center justify-between rounded-[16px] border border-[var(--pc-border)] bg-[var(--pc-cream)] px-4 py-3 transition-all hover:border-[var(--pc-primary)]/40 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg ${meal.color}`}>{meal.icon}</span>
                        <div>
                          <p className="text-xs font-medium text-[var(--pc-text-muted)]">{meal.label}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-[var(--pc-text)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                              {t12.display}
                            </span>
                            <span className="text-sm text-[var(--pc-text-muted)]">{t12.period}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Time input for editing */}
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => updateFeedingTime(index, e.target.value)}
                          className="h-8 w-[100px] rounded-[10px] border border-[var(--pc-border)] bg-white px-2 text-xs text-[var(--pc-text)] opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
                        />
                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => removeFeedingTime(index)}
                          disabled={feedingTimes.length === 1}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 transition-all hover:bg-red-500 hover:text-white group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════ SECTION 4 — VACCINATION CHECKLIST ═══════ */}
        <div
          className="animate-[fadeUp_0.4s_ease_forwards] mb-6 rounded-[24px] border border-[var(--pc-border)] bg-white p-6 shadow-sm"
          style={{ animationDelay: "300ms" }}
        >
          {/* Section header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-green-50 text-xl">
                💉
              </div>
              <h2 className="ml-3 text-xl font-semibold text-[var(--pc-text)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                Vaccination Checklist
              </h2>
            </div>
            <button
              type="button"
              onClick={addVaccination}
              className="flex items-center gap-1.5 rounded-[12px] bg-[var(--pc-teal)] px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md hover:brightness-95"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Vaccine
            </button>
          </div>

          {/* Progress row */}
          <div className="mb-5">
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-[var(--pc-text-muted)]">
                Completed vaccinations:{" "}
                <span style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }} className="font-semibold">{completedVaccines}</span>
                {" / "}
                <span style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }} className="font-semibold">{vaccinations.length}</span>
              </span>
              <span className="font-semibold text-[var(--pc-text)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                {vaccinations.length === 0
                  ? "0%"
                  : `${Math.round((completedVaccines / vaccinations.length) * 100)}%`}
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-[8px] overflow-hidden rounded-full bg-[var(--pc-cream)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  background: "linear-gradient(90deg, var(--pc-teal), #4ADE80)",
                  width:
                    vaccinations.length === 0
                      ? "0%"
                      : `${Math.round((completedVaccines / vaccinations.length) * 100)}%`,
                }}
              />
            </div>
          </div>

          {vaccinations.length === 0 ? (
            /* Empty state */
            <div className="rounded-[20px] border-2 border-dashed border-[var(--pc-border)] py-10 text-center">
              <div className="mb-3 text-5xl">💉</div>
              <p className="text-lg text-[var(--pc-text)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
                No vaccinations tracked
              </p>
              <p className="mx-auto mt-1 max-w-[280px] text-sm text-[var(--pc-text-muted)]">
                Add vaccines to monitor your pet&apos;s health protection
              </p>
              <button
                type="button"
                onClick={addVaccination}
                className="mt-4 inline-flex items-center gap-1.5 rounded-[12px] bg-[var(--pc-teal)] px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md hover:brightness-95"
              >
                <Plus className="h-3.5 w-3.5" />
                Add First Vaccine
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vaccinations.map((item, index) => {
                const dueLabel = getDueLabel(ageInMonths, item.recommendedByMonths);
                const isDue = dueLabel === "Due now";
                const isCompleted = item.status === "done";
                const isOverdue = isDue && !isCompleted;

                const borderColor = isCompleted
                  ? "border-green-300 bg-green-50/20"
                  : isOverdue
                    ? "border-red-300 bg-red-50/20"
                    : "border-amber-300 bg-amber-50/30";

                return (
                  <div
                    key={`vaccine-${index}`}
                    className={`overflow-hidden rounded-[20px] border-2 transition-all ${borderColor}`}
                  >
                    {/* Card top row */}
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Status icon */}
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isOverdue
                                ? "border-2 border-red-300 bg-red-50 text-red-400"
                                : "border-2 border-amber-300 bg-amber-50 text-amber-400"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : isOverdue ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>

                        {/* Vaccine info */}
                        <div>
                          <input
                            type="text"
                            value={item.vaccine}
                            onChange={(e) => updateVaccination(index, "vaccine", e.target.value)}
                            placeholder="Vaccine name"
                            className="border-0 bg-transparent p-0 text-base font-semibold text-[var(--pc-text)] placeholder:text-[var(--pc-text-light)] focus:outline-none"
                            style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}
                          />
                          <p className={`text-xs font-semibold ${
                            isCompleted
                              ? "text-green-600"
                              : isOverdue
                                ? "text-red-500"
                                : "text-amber-600"
                          }`}>
                            {isCompleted ? "✓ Completed" : isOverdue ? "⚠ Overdue" : "Pending"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status select */}
                        <div className="relative">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateVaccination(index, "status", e.target.value as PetVaccinationStatus)
                            }
                            className="cursor-pointer appearance-none rounded-[10px] border-[1.5px] border-[var(--pc-border)] bg-white px-3 py-1.5 pr-7 text-xs font-semibold text-[var(--pc-text)] outline-none transition-colors focus:border-[var(--pc-primary)]"
                          >
                            <option value="pending">Pending</option>
                            <option value="done">Done</option>
                            <option value="not_required">Not Required</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--pc-text-muted)]" />
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => removeVaccination(index)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pc-cream)] text-[var(--pc-text-muted)] transition-all hover:bg-red-50 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card details row */}
                    <div className="grid grid-cols-2 gap-3 px-5 pb-4">
                      {/* Recommended By (months) */}
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[var(--pc-text-muted)]">
                          Recommended by (months)
                        </label>
                        <div className="flex items-center gap-2 rounded-[12px] border border-[var(--pc-border)] bg-white px-3 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              const current = typeof item.recommendedByMonths === "number" ? item.recommendedByMonths : 0;
                              updateVaccination(index, "recommendedByMonths", Math.max(0, current - 1));
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--pc-cream)] font-bold text-[var(--pc-text-muted)] transition-all hover:bg-[var(--pc-primary-light)] hover:text-[var(--pc-primary)]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className="flex-1 text-center text-base font-bold text-[var(--pc-text)]"
                            style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}
                          >
                            {item.recommendedByMonths ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const current = typeof item.recommendedByMonths === "number" ? item.recommendedByMonths : 0;
                              updateVaccination(index, "recommendedByMonths", current + 1);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--pc-cream)] font-bold text-[var(--pc-text-muted)] transition-all hover:bg-[var(--pc-primary-light)] hover:text-[var(--pc-primary)]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Doses Taken */}
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[var(--pc-text-muted)]">
                          Doses Taken
                        </label>
                        <div className="flex items-center gap-2 rounded-[12px] border border-[var(--pc-border)] bg-white px-3 py-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateVaccination(index, "dosesTaken", Math.max(0, (item.dosesTaken || 0) - 1))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--pc-cream)] font-bold text-[var(--pc-text-muted)] transition-all hover:bg-[var(--pc-primary-light)] hover:text-[var(--pc-primary)]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className="flex-1 text-center text-base font-bold text-[var(--pc-text)]"
                            style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}
                          >
                            {item.dosesTaken}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateVaccination(index, "dosesTaken", (item.dosesTaken || 0) + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--pc-cream)] font-bold text-[var(--pc-text-muted)] transition-all hover:bg-[var(--pc-primary-light)] hover:text-[var(--pc-primary)]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Due now inline pill */}
                    {isDue && !isCompleted && (
                      <div className="mx-5 mb-4 flex items-center gap-2 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        <span className="text-xs font-medium text-red-600">
                          Due now — schedule vaccination
                        </span>
                      </div>
                    )}

                    {/* Non-due label */}
                    {!isDue && (
                      <div className={`mx-5 mb-4 flex items-center gap-2 rounded-[10px] border px-3 py-2 text-xs font-semibold ${
                        isCompleted
                          ? "border-green-100 bg-green-50 text-green-700"
                          : "border-emerald-100 bg-emerald-50 text-emerald-700"
                      }`}>
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>{dueLabel}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════ CARE NOTES ═══════ */}
        <div
          className="animate-[fadeUp_0.4s_ease_forwards] mb-6 rounded-[24px] border border-[var(--pc-border)] bg-white p-6 shadow-sm"
          style={{ animationDelay: "400ms" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--pc-teal-light)] text-xl">
              📝
            </div>
            <h2 className="ml-1 text-xl font-semibold text-[var(--pc-text)]" style={{ fontFamily: "var(--font-display), 'Fraunces', Georgia, serif" }}>
              Care Notes
            </h2>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any care notes, food preferences, or reminders..."
            className="min-h-[120px] w-full resize-none rounded-[16px] border border-[var(--pc-border)] bg-[var(--pc-cream)] p-4 text-sm text-[var(--pc-text)] placeholder:text-[var(--pc-text-light)] transition-colors focus:border-[var(--pc-primary)] focus:outline-none"
          />
        </div>

        {/* ═══════ SAVE BUTTON ═══════ */}
        <div
          className="animate-[fadeUp_0.4s_ease_forwards] pb-6"
          style={{ animationDelay: "500ms" }}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[16px] bg-[var(--pc-primary)] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[var(--pc-primary)]/20 transition-all hover:brightness-95 hover:shadow-xl disabled:opacity-70 sm:w-auto"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Care Plan"}
          </button>
        </div>

      </div>
    </div>
  );
}
