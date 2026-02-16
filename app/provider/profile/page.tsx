"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMyProviderProfile, updateMyProviderProfile } from "@/lib/api/provider/provider";
import { toast } from "sonner";

type ProviderForm = {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  certification: string;
  experience: string;
  clinicOrShopName: string;
  panNumber: string;
};

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
    experience: "",
    clinicOrShopName: "",
    panNumber: "",
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
        experience: src?.experience || "",
        clinicOrShopName: src?.clinicOrShopName || "",
        panNumber: src?.panNumber || "",
      });
      setLoading(false);
    };
    load();
  }, [user]);

  const onChange = (key: keyof ProviderForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      panNumber: form.panNumber.trim().toUpperCase(),
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
          </div>
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
