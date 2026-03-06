"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getMyProviderProfile,
  updateMyProviderProfile,
  uploadProviderCertificate,
  uploadProviderProfileImage,
} from "@/lib/api/provider/provider";
import { toast } from "sonner";
import { BadgeCheck, FileUp, Paperclip, X, Camera, Building, Mail, Phone, MapPin, FileText, ClipboardList, Save } from "lucide-react";
import Image from "next/image";
import ProviderLocationPicker, { type ProviderPinnedLocation } from "@/components/ProviderLocationPicker";
import { getApiBaseUrl, resolveMediaUrl } from "@/lib/utils/media-url";

type ProviderForm = {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  certification: string;
  certificationDocumentUrl: string;
  experience: string;
  clinicOrShopName: string;
  panNumber: string;
  providerType: "shop" | "vet" | "babysitter" | "";
  location: ProviderPinnedLocation;
  pawcareVerified: boolean;
  locationVerified: boolean;
  status: "pending" | "approved" | "rejected" | "";
  profileImageUrl: string;
};
type ProviderStringField =
  | "businessName"
  | "address"
  | "phone"
  | "email"
  | "certification"
  | "experience"
  | "clinicOrShopName"
  | "panNumber";

export default function ProviderProfilePage() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const baseUrl = getApiBaseUrl();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [form, setForm] = useState<ProviderForm>({
    businessName: "",
    address: "",
    phone: "",
    email: "",
    certification: "",
    certificationDocumentUrl: "",
    experience: "",
    clinicOrShopName: "",
    panNumber: "",
    providerType: "",
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
    pawcareVerified: false,
    locationVerified: false,
    status: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const profile = await getMyProviderProfile();
      const src = profile.success ? profile.data : user;
      setForm({
        businessName: src?.businessName || "",
        address: src?.address || "",
        phone: src?.phone || "",
        email: src?.email || "",
        certification: src?.certification || "",
        certificationDocumentUrl: src?.certificationDocumentUrl || "",
        experience: src?.experience || "",
        clinicOrShopName: src?.clinicOrShopName || "",
        panNumber: src?.panNumber || "",
        providerType: src?.providerType || "",
        location: {
          latitude:
            typeof src?.location?.latitude === "number" ? src.location.latitude : null,
          longitude:
            typeof src?.location?.longitude === "number" ? src.location.longitude : null,
          address: typeof src?.location?.address === "string" ? src.location.address : "",
        },
        pawcareVerified: Boolean(src?.pawcareVerified),
        locationVerified: Boolean(src?.locationVerified),
        status: src?.status || "",
        profileImageUrl: src?.profileImageUrl || "",
      });
      setImageLoadError(false);
      setLoading(false);
    };
    load();
  }, [user]);

  const onChange = (key: ProviderStringField, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const certificateUrl = resolveMediaUrl(
    form.certificationDocumentUrl,
    baseUrl,
    "documents",
  );
  const profileImageUrl = resolveMediaUrl(
    photoPreview || form.profileImageUrl,
    baseUrl,
    "image",
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiresLocation = form.providerType === "shop" || form.providerType === "vet";
    const hasPinnedLocation =
      typeof form.location.latitude === "number" &&
      Number.isFinite(form.location.latitude) &&
      typeof form.location.longitude === "number" &&
      Number.isFinite(form.location.longitude);

    if (requiresLocation && !hasPinnedLocation) {
      toast.error("Please pin your clinic/shop location on the map.");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      panNumber: form.panNumber.trim().toUpperCase(),
      location: hasPinnedLocation
        ? {
            latitude: form.location.latitude as number,
            longitude: form.location.longitude as number,
            address: form.location.address?.trim() || "",
          }
        : undefined,
    };
    const response = await updateMyProviderProfile(payload);
    if (response.success) {
      const updatedUser = { ...(user ?? {}), ...(response.data ?? {}), role: "provider" };
      document.cookie = `user_data=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/;`;
      await checkAuth(updatedUser);
      toast.success("Provider profile updated");
      router.refresh();
    } else {
      toast.error(response.message || "Failed to update profile");
    }
    setSaving(false);
  };

  const handleCertificateUpload = async (file: File | null) => {
    if (!file) return;
    const isVet = form.providerType === "vet";
    if (!isVet) {
      toast.error("Certificate upload is available for veterinarian providers.");
      return;
    }

    setSaving(true);
    try {
      const result = await uploadProviderCertificate(file);
      if (!result.success) {
        toast.error(result.message || "Failed to upload certificate file.");
        return;
      }
      const uploadedPath = result.data?.path || result.data?.url || "";
      if (!uploadedPath) {
        toast.error("Upload succeeded but file path was not returned.");
        return;
      }
      setForm((prev) => ({
        ...prev,
        certificationDocumentUrl: uploadedPath,
      }));
      toast.success("Certificate file attached.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePhotoUpload = async (file: File | null) => {
    if (!file) return;

    setSaving(true);
    try {
      const result = await uploadProviderProfileImage(file);
      if (!result.success) {
        toast.error(result.message || "Failed to upload profile image.");
        return;
      }
      const uploadedPath = result.data?.path || result.data?.url || "";
      if (!uploadedPath) {
        toast.error("Upload succeeded but file path was not returned.");
        return;
      }
      setForm((prev) => ({
        ...prev,
        profileImageUrl: uploadedPath,
      }));
      setPhotoPreview(null);
      setImageLoadError(false);
      toast.success("Profile photo updated!");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoPreview = (file: File | null) => {
    if (!file) return;
    setImageLoadError(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--pc-primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl pb-28">
      {/* ── Profile Hero Banner ── */}
      <div className="relative h-[200px] rounded-[24px] overflow-hidden mb-6">
        <Image src="/images/pawcare.png" alt="" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-[var(--pc-teal-dark)]/70" />
        <div className="relative z-10 flex flex-col justify-end h-full px-8 pb-6">
          <h1 className="font-[var(--font-display)] text-[28px] font-bold text-white">Your Business Profile</h1>
          <p className="text-white/70 text-sm mt-1">Keep your info up to date for pet owners</p>
        </div>
      </div>

      {/* ── Profile Photo Card ── */}
      <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-6 mb-4 flex flex-col md:flex-row gap-5 items-start">
        {/* Photo preview */}
        <div className="relative w-[100px] h-[100px] rounded-[20px] overflow-hidden border-2 border-white shadow-md flex-shrink-0">
          {profileImageUrl && !imageLoadError ? (
            <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" onError={() => setImageLoadError(true)} />
          ) : (
            <div className="w-full h-full bg-[var(--pc-cream)] border-2 border-dashed border-[var(--pc-primary)]/30 flex flex-col items-center justify-center rounded-[20px]">
              <Camera className="h-6 w-6 text-[var(--pc-text-muted)]" />
              <span className="text-xs text-[var(--pc-text-muted)] mt-1">Add photo</span>
            </div>
          )}
        </div>
        {/* Right info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-[var(--font-display)] text-xl font-semibold text-foreground truncate">{form.businessName || form.clinicOrShopName || "Your Business"}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {form.providerType && (
              <span className="bg-[var(--pc-teal-light)] text-[var(--pc-teal)] rounded-full px-3 py-1 text-sm font-medium">
                {form.providerType === "vet" ? "🏥 Vet" : form.providerType === "shop" ? "🛒 Shop" : "✂️ Groomer"}
              </span>
            )}
            {form.pawcareVerified ? (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">⏳ Pending Review</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="cursor-pointer bg-[var(--pc-primary)] text-white rounded-[10px] px-4 py-2 text-sm font-semibold hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {saving ? "Uploading..." : "Change Photo"}
              <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" disabled={saving} onChange={(e) => { const file = e.target.files?.[0] || null; if (file) { handlePhotoPreview(file); void handleProfilePhotoUpload(file); } e.currentTarget.value = ""; }} />
            </label>
            {profileImageUrl && (
              <button type="button" onClick={() => { setForm((prev) => ({ ...prev, profileImageUrl: "" })); setPhotoPreview(null); }} className="text-red-500 border border-red-200 rounded-[12px] px-3 py-2 text-xs font-semibold hover:bg-red-50 hover:border-red-300 transition-all inline-flex items-center gap-1">
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          <p className="text-xs text-[var(--pc-text-muted)] mt-2">JPG, PNG, WEBP · Max 5MB</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* ── Card 1: Business Information ── */}
        <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--pc-primary-light)] flex items-center justify-center text-[var(--pc-primary)]"><Building className="h-4 w-4" /></div>
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-foreground">Business Information</h2>
          </div>
          <div className="border-b border-[var(--pc-border)] mb-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <div>
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Business Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--pc-text-muted)]" />
                <input value={form.businessName} onChange={(e) => onChange("businessName", e.target.value)} placeholder="Your business name" className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] pl-10 pr-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]" />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--pc-text-muted)]" />
                <input value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="Email address" className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] pl-10 pr-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]" />
              </div>
            </div>
            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--pc-text-muted)]" />
                <input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="Phone number" className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] pl-10 pr-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]" />
              </div>
            </div>
            {/* Address */}
            <div>
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--pc-text-muted)]" />
                <input value={form.address} onChange={(e) => onChange("address", e.target.value)} placeholder="Business address" className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] pl-10 pr-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 2: Verification Details ── */}
        <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-[10px] bg-[var(--pc-primary-light)] flex items-center justify-center text-[var(--pc-primary)]"><ClipboardList className="h-4 w-4" /></div>
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-foreground">Verification Details</h2>
          </div>
          <div className="border-b border-[var(--pc-border)] mb-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Clinic / Shop Name</label>
              <input value={form.clinicOrShopName} onChange={(e) => onChange("clinicOrShopName", e.target.value)} placeholder="Clinic or shop name" className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]" />
              <p className="text-xs text-[var(--pc-text-muted)] mt-1">As registered with authorities</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">PAN Number</label>
              <input value={form.panNumber} onChange={(e) => onChange("panNumber", e.target.value.toUpperCase())} placeholder="PAN number" className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)] uppercase" />
              <p className="text-xs text-[var(--pc-text-muted)] mt-1">Required for verification</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Experience</label>
              <div className="flex">
                <textarea value={form.experience} onChange={(e) => onChange("experience", e.target.value)} placeholder="Years and areas of experience" rows={3} className="flex-1 border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)] resize-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--pc-text-muted)] uppercase tracking-wider mb-1.5 block">Certification</label>
              <textarea value={form.certification} onChange={(e) => onChange("certification", e.target.value)} placeholder="Certifications and qualifications" rows={3} className="w-full border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)] min-h-[80px] resize-none" />
            </div>
            {form.providerType === "vet" && (
              <div className="md:col-span-2 space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[var(--pc-teal)]/20 bg-[var(--pc-teal)]/5 px-4 py-2 text-sm font-semibold text-[var(--pc-teal)] hover:bg-[var(--pc-teal)]/10 transition-all">
                  <FileUp className="h-4 w-4" />
                  {saving ? "Uploading..." : "Attach Certification File"}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" disabled={saving} onChange={(e) => { const file = e.target.files?.[0] || null; void handleCertificateUpload(file); e.currentTarget.value = ""; }} />
                </label>
                {certificateUrl ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <a href={certificateUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[var(--pc-teal)] hover:underline">
                      <Paperclip className="h-3.5 w-3.5" /> View Attached Certificate
                    </a>
                    <button type="button" onClick={() => setForm((prev) => ({ ...prev, certificationDocumentUrl: "" }))} className="inline-flex items-center gap-1 rounded-[10px] border border-red-200 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100 transition-all">
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--pc-text-muted)]">Accepted: PDF, JPG, PNG, WEBP (max 10MB)</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Card 3: Shop Location ── */}
        {(form.providerType === "shop" || form.providerType === "vet") && (
          <div className="bg-white rounded-[20px] border border-[var(--pc-border)] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-[10px] bg-[var(--pc-primary-light)] flex items-center justify-center text-[var(--pc-primary)]"><MapPin className="h-4 w-4" /></div>
              <h2 className="font-[var(--font-display)] text-lg font-semibold text-foreground">{form.providerType === "shop" ? "Shop Location" : "Clinic Location"}</h2>
            </div>
            <div className="border-b border-[var(--pc-border)] mb-5" />
            <p className="text-sm text-[var(--pc-text-muted)] mb-4">Drag the pin to your exact location</p>
            <div className="rounded-[16px] overflow-hidden border-2 border-[var(--pc-border)]">
              <ProviderLocationPicker
                value={form.location}
                onChange={(location) => setForm((prev) => ({ ...prev, location }))}
                required
                label={form.providerType === "shop" ? "Shop Pin Location" : "Clinic Pin Location"}
                helperText="Pin the exact location used for PawCare map verification."
              />
            </div>
            {form.location.latitude && form.location.longitude && (
              <div className="bg-[var(--pc-cream)] rounded-[10px] px-3 py-2 mt-3 text-xs text-[var(--pc-text-muted)]">
                📌 Lat: {Number(form.location.latitude).toFixed(4)} · Lng: {Number(form.location.longitude).toFixed(4)}
              </div>
            )}
            <input value={form.location.address || ""} onChange={(e) => setForm((prev) => ({ ...prev, location: { ...prev.location, address: e.target.value } }))} placeholder="Location notes (optional)" className="w-full mt-3 border-[1.5px] border-[var(--pc-border)] rounded-[12px] bg-[var(--pc-cream)] px-4 py-3 text-sm font-medium focus:border-[var(--pc-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--pc-primary)]/10 outline-none transition-all duration-200 placeholder:text-[var(--pc-text-muted)]" />
          </div>
        )}
      </form>

      {/* ── Sticky Save Bar ── */}
      <div className="fixed bottom-0 left-[256px] right-0 bg-white border-t border-[var(--pc-border)] px-6 py-4 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-30">
        <span className="text-xs text-[var(--pc-text-muted)]">Unsaved changes</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.refresh()} className="border-[1.5px] border-[var(--pc-border)] text-[var(--pc-text-muted)] rounded-[12px] px-5 py-2.5 font-semibold text-sm bg-transparent hover:border-[var(--pc-primary)] hover:text-[var(--pc-primary)] hover:bg-[var(--pc-primary-light)] transition-all duration-200">Discard Changes</button>
          <button type="button" onClick={(e) => { e.preventDefault(); const fakeEvent = { preventDefault: () => {} } as React.FormEvent; onSubmit(fakeEvent); }} disabled={saving} className="bg-[var(--pc-primary)] text-white rounded-[12px] px-6 py-2.5 font-semibold text-sm hover:bg-[var(--pc-primary-hover)] hover:shadow-[0_4px_16px_rgba(232,133,90,0.35)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 inline-flex items-center gap-2">
            {saving ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>) : (<><Save className="h-4 w-4" /> Save Profile</>)}
          </button>
        </div>
      </div>
    </div>
  );
}
