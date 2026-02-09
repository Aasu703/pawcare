"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { providerRegister } from "@/lib/api/provider/provider";

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        document.cookie = `user_data=${encodeURIComponent(JSON.stringify({ ...res.data, role: "provider" }))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }
      window.location.href = "/provider/dashboard";
    } else {
      setError(res.message || "Registration failed");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

