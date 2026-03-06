"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { setProviderType, uploadProviderCertificate } from "@/lib/api/provider/provider";
import { Stethoscope, Scissors, ShoppingBag, Check, X, UploadCloud, MapPin, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProviderLocationPicker, { type ProviderPinnedLocation } from "@/components/ProviderLocationPicker";

const providerTypes = [
  {
    id: "vet",
    title: "Veterinarian",
    description: "Provide veterinary services including consultations, vaccinations, and medical treatments for pets.",
    icon: Stethoscope,
    iconBg: "bg-[var(--pc-teal-light)]",
    iconColor: "text-[var(--pc-teal)]",
  },
  {
    id: "shop",
    title: "Pet Shop",
    description: "Sell pet supplies, food, toys, and accessories through your own storefront.",
    icon: ShoppingBag,
    iconBg: "bg-[var(--pc-primary-light)]",
    iconColor: "text-[var(--pc-primary)]",
  },
  {
    id: "babysitter",
    title: "Groomer",
    description: "Offer grooming, styling, and related pet care services to pet owners.",
    icon: Scissors,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

function getStepState(step: number, selectedType: string | null, hasDetails: boolean, hasLocation: boolean) {
  if (step === 1) return selectedType ? "completed" : "active";
  if (step === 2) return !selectedType ? "upcoming" : hasDetails ? "completed" : "active";
  if (step === 3) return !hasDetails ? "upcoming" : hasLocation ? "completed" : "active";
  return "upcoming";
}

export default function SelectProviderType() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [certification, setCertification] = useState("");
  const [certificationDocumentUrl, setCertificationDocumentUrl] = useState("");
  const [certificationFileName, setCertificationFileName] = useState("");
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [experience, setExperience] = useState("");
  const [clinicOrShopName, setClinicOrShopName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [pinnedLocation, setPinnedLocation] = useState<ProviderPinnedLocation>({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const hasPinnedLocation =
    typeof pinnedLocation.latitude === "number" &&
    Number.isFinite(pinnedLocation.latitude) &&
    typeof pinnedLocation.longitude === "number" &&
    Number.isFinite(pinnedLocation.longitude);

  const submitType = async (typeId: string) => {
    if (!typeId || loading) return;

    const isVet = typeId === "vet";
    const isGroomer = typeId === "babysitter";
    const isShop = typeId === "shop";

    if (isVet && (!certification.trim() || !experience.trim() || !clinicOrShopName.trim())) {
      toast.error("For vets, certification, experience, and clinic/shop name are required.");
      return;
    }

    if (isGroomer && !experience.trim()) {
      toast.error("For groomers, experience is required.");
      return;
    }

    if (isShop && (!clinicOrShopName.trim() || !panNumber.trim())) {
      toast.error("For shop owners, shop name and PAN number are required.");
      return;
    }

    if ((isVet || isShop) && !hasPinnedLocation) {
      toast.error("Please pin your clinic/shop location on the map.");
      return;
    }

    setLoading(true);
    try {
      const res = await setProviderType({
        providerType: typeId,
        certification: certification.trim(),
        certificationDocumentUrl: certificationDocumentUrl || undefined,
        experience: experience.trim(),
        clinicOrShopName: clinicOrShopName.trim(),
        panNumber: panNumber.trim().toUpperCase(),
        location: hasPinnedLocation
          ? {
              latitude: pinnedLocation.latitude as number,
              longitude: pinnedLocation.longitude as number,
              address: pinnedLocation.address?.trim() || "",
            }
          : undefined,
      });
      if (res.success) {
        const providerFromResponse = res.data?._doc ?? res.data ?? {};
        const updatedUser = {
          ...(user ?? {}),
          ...providerFromResponse,
          providerType: providerFromResponse.providerType ?? typeId,
          role: "provider",
        };

        document.cookie = `user_data=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/;`;
        await checkAuth(updatedUser);
        toast.success("Details submitted. Please wait for admin verification.");
        router.replace("/provider/verification-pending");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to set provider type");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    await submitType(selectedType);
  };

  const handleCertificateUpload = async (file: File | null) => {
    if (!file) return;

    setUploadingCertificate(true);
    try {
      const result = await uploadProviderCertificate(file);
      if (result.success) {
        const uploadedPath = result.data?.path || result.data?.url || "";
        if (!uploadedPath) {
          toast.error("Upload succeeded but file path was not returned.");
          return;
        }
        setCertificationDocumentUrl(uploadedPath);
        setCertificationFileName(result.data?.originalname || file.name);
        toast.success("Certificate file attached successfully.");
      } else {
        toast.error(result.message || "Failed to upload certificate file.");
      }
    } finally {
      setUploadingCertificate(false);
    }
  };

  const isVet = selectedType === "vet";
  const isGroomer = selectedType === "babysitter";
  const isShop = selectedType === "shop";

  /* Progress step logic (visual only) */
  const hasDetailsFilled = selectedType
    ? isVet
      ? !!(certification.trim() && experience.trim() && clinicOrShopName.trim())
      : isShop
      ? !!(clinicOrShopName.trim() && panNumber.trim())
      : isGroomer
      ? !!experience.trim()
      : false
    : false;
  const needsLocation = isVet || isShop;

  const steps = [
    { num: 1, label: "Choose Type" },
    { num: 2, label: "Your Details" },
    { num: 3, label: "Location" },
  ];

  return (
    <div className="min-h-screen bg-[var(--pc-cream)]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, i) => {
            const state = getStepState(step.num, selectedType, hasDetailsFilled, hasPinnedLocation);
            const isLast = i === steps.length - 1;
            return (
              <div key={step.num} className="flex items-center">
                <div
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    state === "completed"
                      ? "bg-green-500 text-white"
                      : state === "active"
                      ? "bg-[var(--pc-primary)] text-white"
                      : "bg-[var(--pc-cream)] text-[var(--pc-text-muted)] border border-[var(--pc-border)]"
                  }`}
                >
                  {state === "completed" ? "✓" : step.num} {step.label}
                </div>
                {!isLast && (
                  <div className="mx-2 h-[2px] w-8 sm:w-12 bg-[var(--pc-border)]" />
                )}
              </div>
            );
          })}
        </div>

        {/* STEP 1 — CHOOSE PROVIDER TYPE */}
        <div className="relative mb-8">
          <div className="text-center">
            <h1 className="font-[Fraunces] text-2xl font-semibold text-[var(--pc-text)]">
              What kind of provider are you?
            </h1>
            <p className="text-sm text-[var(--pc-text-muted)] mt-2 mb-8">
              Choose the type that best describes your service
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {providerTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`relative bg-white rounded-[24px] border-2 p-6 cursor-pointer transition-all duration-200 hover:border-[var(--pc-primary)] hover:shadow-md hover:scale-[1.01] ${
                    isSelected
                      ? "border-[var(--pc-primary)] bg-[var(--pc-primary-light)]/30 shadow-[0_0_0_4px_rgba(232,133,90,0.1)]"
                      : "border-[var(--pc-border)]"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className={`${type.iconBg} ${type.iconColor} flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px]`}>
                      <Icon className="h-7 w-7" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-[Fraunces] text-lg font-semibold text-[var(--pc-text)] mb-1">
                        {type.title}
                      </h3>
                      <p className="text-sm text-[var(--pc-text-muted)] leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pc-primary)] transition-transform duration-200 scale-100">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2 — VERIFICATION DETAILS */}
        {selectedType && (
          <div className="bg-white rounded-[24px] border border-[var(--pc-border)] p-6 mt-6">
            <h2 className="font-[Fraunces] text-xl font-semibold text-[var(--pc-text)] mb-1">
              📋 Verification Details
            </h2>
            <p className="text-sm text-[var(--pc-text-muted)] mb-5">
              This information will be reviewed by our team
            </p>

            <div className="space-y-5">
              {/* Clinic/Shop Name */}
              {(isVet || isShop) && (
                <div>
                  <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">
                    Clinic/Shop Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--pc-text-light)]" />
                    <input
                      type="text"
                      value={clinicOrShopName}
                      onChange={(e) => setClinicOrShopName(e.target.value)}
                      placeholder="Enter clinic or shop name"
                      className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 placeholder:text-[var(--pc-text-light)]"
                    />
                  </div>
                </div>
              )}

              {/* Experience */}
              {(isVet || isGroomer) && (
                <div>
                  <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">
                    Experience
                  </label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Describe your relevant experience"
                    rows={4}
                    className="w-full min-h-[120px] border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 placeholder:text-[var(--pc-text-light)] resize-y"
                  />
                  <p className="text-xs text-[var(--pc-text-muted)] mt-1">
                    Describe your professional background and years of experience
                  </p>
                </div>
              )}

              {/* Certification */}
              {isVet && (
                <div>
                  <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">
                    Certification
                  </label>
                  <textarea
                    value={certification}
                    onChange={(e) => setCertification(e.target.value)}
                    placeholder="Enter certification/license details"
                    rows={3}
                    className="w-full min-h-[100px] border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 placeholder:text-[var(--pc-text-light)] resize-y"
                  />
                  <p className="text-xs text-[var(--pc-text-muted)] mt-1">
                    Include license number, issuing body, and expiry date
                  </p>
                </div>
              )}

              {/* Certificate File Upload */}
              {isVet && (
                <div>
                  <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">
                    Certificate File
                  </label>
                  {certificationDocumentUrl ? (
                    <div className="flex items-center gap-3 rounded-[12px] border border-[var(--pc-border)] bg-[var(--pc-cream)] p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--pc-primary-light)]">
                        <UploadCloud className="h-4 w-4 text-[var(--pc-primary)]" />
                      </div>
                      <span className="flex-1 truncate text-sm font-medium text-[var(--pc-text)]">
                        {certificationFileName || "Certificate file"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCertificationDocumentUrl("");
                          setCertificationFileName("");
                        }}
                        className="rounded-[10px] border border-red-200 bg-red-50 p-1.5 text-red-500 transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="group flex cursor-pointer flex-col items-center rounded-[16px] border-2 border-dashed border-[var(--pc-primary)]/30 p-5 text-center transition-all duration-200 hover:border-[var(--pc-primary)] hover:bg-[var(--pc-primary-light)]">
                      <UploadCloud className="h-8 w-8 text-[var(--pc-text-muted)] mb-2 group-hover:text-[var(--pc-primary)]" />
                      <span className="text-sm text-[var(--pc-text-muted)]">
                        {uploadingCertificate ? "Uploading..." : "Drop your certificate here or click to browse"}
                      </span>
                      <span className="text-xs text-[var(--pc-text-muted)] mt-1">
                        PDF, JPG, PNG, WEBP · Max 10MB
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        disabled={uploadingCertificate}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          void handleCertificateUpload(file);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              )}

              {/* PAN Number */}
              {isShop && (
                <div>
                  <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="Enter PAN number"
                    className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 placeholder:text-[var(--pc-text-light)] uppercase"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 — LOCATION */}
        {(isVet || isShop) && (
          <div className="bg-white rounded-[24px] border border-[var(--pc-border)] p-6 mt-4">
            <h2 className="font-[Fraunces] text-xl font-semibold text-[var(--pc-text)] mb-1">
              📍 {isVet ? "Clinic" : "Shop"} Location
            </h2>
            <p className="text-sm text-[var(--pc-text-muted)] mb-4">
              Pin your exact business location on the map
            </p>

            <ProviderLocationPicker
              value={pinnedLocation}
              onChange={setPinnedLocation}
              required
              label={isVet ? "Clinic Location" : "Shop Location"}
              helperText="Allow location access or click anywhere on map to pin your exact business location."
            />

            {/* Location pinned indicator */}
            {hasPinnedLocation && (
              <div className="bg-[var(--pc-teal-light)] rounded-[12px] px-4 py-3 mt-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--pc-teal)]" />
                <span className="text-sm font-medium text-[var(--pc-teal)]">
                  Location pinned: {pinnedLocation.address || "Custom location"} ({pinnedLocation.latitude?.toFixed(3)}, {pinnedLocation.longitude?.toFixed(3)})
                </span>
              </div>
            )}

            {/* Location Notes */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">
                Location Notes (Optional)
              </label>
              <input
                type="text"
                value={pinnedLocation.address || ""}
                onChange={(e) =>
                  setPinnedLocation((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Landmark, floor, or nearby reference"
                className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 placeholder:text-[var(--pc-text-light)]"
              />
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={!selectedType || loading}
          className={`mt-8 w-full rounded-[16px] py-4 font-semibold text-base font-[Fraunces] transition-all duration-200 active:scale-[0.99] ${
            selectedType && !loading
              ? "bg-[var(--pc-primary)] text-white hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_6px_24px_rgba(232,133,90,0.4)]"
              : "bg-gray-200 text-[var(--pc-text-muted)] cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit for Verification →"
          )}
        </button>

        <p className="text-xs text-[var(--pc-text-muted)] text-center mt-3">
          🔒 Your information is reviewed by our team within 24-48 hours
        </p>
      </div>
    </div>
  );
}
