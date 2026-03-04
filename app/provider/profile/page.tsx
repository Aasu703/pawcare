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
import { BadgeCheck, FileUp, Paperclip, X, Camera } from "lucide-react";
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Provider Profile</h1>
        <p className="text-gray-600">Update your business and verification details.</p>
        {form.pawcareVerified && (form.providerType === "shop" || form.providerType === "vet") ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <BadgeCheck className="h-4 w-4" />
            {form.providerType === "shop" ? "PawCare Verified Shop" : "PawCare Verified Vet"}
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Profile Photo Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Photo Preview */}
            <div className="relative w-full md:w-40 h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
              {profileImageUrl && !imageLoadError ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setImageLoadError(true)}
                />
              ) : profileImageUrl && imageLoadError ? (
                <div className="text-center">
                  <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-xs text-gray-500">Failed to load image</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No photo yet</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex-1 space-y-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#0f4f57]/20 bg-[#0f4f57]/5 px-4 py-3 text-sm font-semibold text-[#0f4f57] hover:bg-[#0f4f57]/10 transition-colors">
                <FileUp className="h-5 w-5" />
                {saving ? "Uploading..." : "Change Photo"}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  disabled={saving}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handlePhotoPreview(file);
                      void handleProfilePhotoUpload(file);
                    }
                    e.currentTarget.value = "";
                  }}
                />
              </label>
              <p className="text-xs text-gray-500">
                Accepted formats: JPG, PNG, WEBP (max 5MB).
              </p>
              {profileImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      profileImageUrl: "",
                    }));
                    setPhotoPreview(null);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 hover:bg-red-100 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.businessName}
              onChange={(e) => onChange("businessName", e.target.value)}
              placeholder="Business name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
            <input
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
            <input
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="Phone"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
            <input
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Address"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Verification Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.clinicOrShopName}
              onChange={(e) => onChange("clinicOrShopName", e.target.value)}
              placeholder="Clinic/Shop name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
            <input
              value={form.panNumber}
              onChange={(e) => onChange("panNumber", e.target.value.toUpperCase())}
              placeholder="PAN number"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary uppercase"
            />
            <textarea
              value={form.experience}
              onChange={(e) => onChange("experience", e.target.value)}
              placeholder="Experience"
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
            <textarea
              value={form.certification}
              onChange={(e) => onChange("certification", e.target.value)}
              placeholder="Certification"
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
            {form.providerType === "vet" ? (
              <div className="md:col-span-2 space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0f4f57]/20 bg-[#0f4f57]/5 px-4 py-2 text-sm font-semibold text-[#0f4f57] hover:bg-[#0f4f57]/10">
                  <FileUp className="h-4 w-4" />
                  {saving ? "Uploading..." : "Attach Certification File"}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    disabled={saving}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      void handleCertificateUpload(file);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
                {certificateUrl ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <a
                      href={certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#0f4f57] hover:underline"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      View Attached Certificate
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          certificationDocumentUrl: "",
                        }))
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, JPG, PNG, WEBP (max 10MB).
                  </p>
                )}
              </div>
            ) : null}
          </div>
          {(form.providerType === "shop" || form.providerType === "vet") && (
            <div className="mt-6 space-y-3">
              <ProviderLocationPicker
                value={form.location}
                onChange={(location) => setForm((prev) => ({ ...prev, location }))}
                required
                label={form.providerType === "shop" ? "Shop Pin Location" : "Clinic Pin Location"}
                helperText="Pin the exact location used for PawCare map verification."
              />
              <input
                value={form.location.address || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      address: e.target.value,
                    },
                  }))
                }
                placeholder="Location notes (optional)"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90 disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
