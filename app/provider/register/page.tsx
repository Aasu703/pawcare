"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { providerRegister } from "@/lib/api/provider/provider";
import { useAuth } from "@/context/AuthContext";

export default function ProviderRegisterPage() {
  const { checkAuth } = useAuth();
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    providerType: "" as "shop" | "vet" | "groomer" | "",
    // role-specific
    vetCertification: "",
    vetExperienceYears: "",
    clinicName: "",
    clinicLocation: "",

    groomerExperienceYears: "",
    groomerCertification: "",

    shopPanNumber: "",
    shopGovRegistration: "",
    shopName: "",
    shopLocation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await providerRegister(form);
    if (res.success) {
      if (res.token) {
        document.cookie = `auth_token=${res.token}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }
      if (res.data) {
        const providerUser = { ...res.data, role: "provider" };
        document.cookie = `user_data=${encodeURIComponent(JSON.stringify(providerUser))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
        await checkAuth(providerUser);
      }
      window.location.href = "/provider/dashboard";
    } else {
      setError(res.message || "Registration failed");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Load Google Maps Places script for autocomplete
  useEffect(() => {
    const loadScript = (data: any) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject();
        document.body.appendChild(s);
      });

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return; // no api key provided

    const src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;

    loadScript(src)
      .then(() => {
        if (!locationInputRef.current) return;
        const googleAny = (window as any).google;
        if (!googleAny) return;
        const autocomplete = new googleAny.maps.places.Autocomplete(locationInputRef.current, {
          types: ["geocode", "establishment"],
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const address = place.formatted_address || place.name || "";
          // assign to the correct location field depending on selected role
          setForm((prev) => {
            if (prev.providerType === "vet") return { ...prev, clinicLocation: address } as any;
            if (prev.providerType === "groomer") return { ...prev, clinicLocation: address } as any;
            if (prev.providerType === "shop") return { ...prev, shopLocation: address } as any;
            return { ...prev, address } as any;
          });
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f4f57] to-[#0c4148] py-12">
      <div className="w-full max-w-md bg-[#0c4148] border border-[#f8d548]/40 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Provider Registration</h1>
        <p className="text-gray-400 text-sm mb-6">Register your business on PawCare</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "businessName", label: "Business Name", type: "text", placeholder: "Your business name" },
            { name: "address", label: "Address", type: "text", placeholder: "Business address" },
            { name: "phone", label: "Phone", type: "tel", placeholder: "Phone number" },
            { name: "email", label: "Email", type: "email", placeholder: "Business email" },
            { name: "password", label: "Password", type: "password", placeholder: "Create password" },
            { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-[#f8d548]">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 focus:ring-[#f8d548]"
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-[#f8d548] mb-2">Choose Provider Role</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, providerType: "vet" })}
                className={`px-3 py-3 rounded-lg text-sm font-medium border ${form.providerType === "vet" ? "bg-[#f8d548] text-[#0c4148]" : "bg-[#0b3238] text-white border-[#f8d548]/40"}`}
              >
                Veterinarian
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, providerType: "groomer" })}
                className={`px-3 py-3 rounded-lg text-sm font-medium border ${form.providerType === "groomer" ? "bg-[#f8d548] text-[#0c4148]" : "bg-[#0b3238] text-white border-[#f8d548]/40"}`}
              >
                Groomer
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, providerType: "shop" })}
                className={`px-3 py-3 rounded-lg text-sm font-medium border ${form.providerType === "shop" ? "bg-[#f8d548] text-[#0c4148]" : "bg-[#0b3238] text-white border-[#f8d548]/40"}`}
              >
                Shop Owner
              </button>
            </div>
          </div>

          {/* Location input (uses Google Places autocomplete when API key present) */}
          <div>
            <label className="block text-sm font-medium text-[#f8d548]">Location</label>
            <input
              name="address"
              ref={locationInputRef}
              value={
                form.providerType === "vet"
                  ? form.clinicLocation || form.address
                  : form.providerType === "shop"
                  ? form.shopLocation || form.address
                  : form.address
              }
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Start typing address to autocomplete"
              className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 focus:ring-[#f8d548]"
              required
            />
          </div>

          {/* Role specific fields */}
          {form.providerType === "vet" && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-[#f8d548]">Clinic Name</label>
                <input name="clinicName" value={form.clinicName} onChange={handleChange} className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white" placeholder="Clinic or Hospital name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f8d548]">Veterinary Certification</label>
                <input name="vetCertification" value={form.vetCertification} onChange={handleChange} className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white" placeholder="Certification details" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f8d548]">Years of Experience</label>
                <input name="vetExperienceYears" value={form.vetExperienceYears} onChange={handleChange} type="number" min={0} className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white" placeholder="e.g. 5" required />
              </div>
            </div>
          )}

          {form.providerType === "groomer" && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-[#f8d548]">Years of Grooming Experience</label>
                <input name="groomerExperienceYears" value={form.groomerExperienceYears} onChange={handleChange} type="number" min={0} className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white" placeholder="e.g. 3" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f8d548]">Certification (optional)</label>
                <input name="groomerCertification" value={form.groomerCertification} onChange={handleChange} className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white" placeholder="Certification details (optional)" />
              </div>
            </div>
          )}

          {form.providerType === "shop" && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-[#f8d548]">Shop Name</label>
                <input name="shopName" value={form.shopName} onChange={handleChange} className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white" placeholder="Registered shop name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f8d548]">PAN / Account Number</label>
                <input name="shopPanNumber" value={form.shopPanNumber} onChange={handleChange} className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white" placeholder="PAN or account number" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f8d548]">Government Registration</label>
                <input name="shopGovRegistration" value={form.shopGovRegistration} onChange={handleChange} className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white" placeholder="Gov registration id" required />
              </div>
            </div>
          )}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f8d548] hover:brightness-95 disabled:bg-primary text-[#0c4148] font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200">
          Already have a provider account?{" "}
          <Link href="/provider/login" className="text-[#f8d548] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}


