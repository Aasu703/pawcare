"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { providerLogin } from "@/lib/api/provider/provider";
import { useAuth } from "@/context/AuthContext";

export default function ProviderLoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await providerLogin(form);
    if (res.success) {
      // Set cookies for provider auth
      if (res.token) {
        document.cookie = `auth_token=${res.token}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }
      if (res.data) {
        document.cookie = `user_data=${encodeURIComponent(JSON.stringify({ ...res.data, role: "provider" }))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }
      window.location.href = "/provider/dashboard";
    } else {
      setError(res.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f4f57] to-[#0c4148]">
      <div className="w-full max-w-md bg-[#0c4148] border border-[#f8d548]/40 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Provider Login</h1>
        <p className="text-gray-400 text-sm mb-6">Access your provider dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#f8d548]">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 focus:ring-[#f8d548]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#f8d548]">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-[#f8d548]/60 rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 focus:ring-[#f8d548]"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f8d548] hover:brightness-95 disabled:bg-yellow-300 text-[#0c4148] font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200">
          Don&apos;t have a provider account?{" "}
          <Link href="/provider/register" className="text-[#f8d548] hover:underline">
            Register here
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link href="/login" className="text-gray-400 hover:text-gray-200 text-sm">
            Login as user instead
          </Link>
        </p>
      </div>
    </div>
  );
}
