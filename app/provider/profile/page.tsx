"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getMyProviderProfile,
  updateMyProviderProfile,
  uploadProviderCertificate,
} from "@/lib/api/provider/provider";
import { toast } from "sonner";
import { BadgeCheck, FileUp, Paperclip, X } from "lucide-react";
import ProviderLocationPicker, { type ProviderPinnedLocation } from "@/components/ProviderLocationPicker";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      });
      setLoading(false);
    };
    load();
  }, [user]);

  const onChange = (key: ProviderStringField, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
                {form.certificationDocumentUrl ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <a
                      href={form.certificationDocumentUrl}
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
