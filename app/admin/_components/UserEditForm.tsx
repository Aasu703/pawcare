"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { handleGetUserById, handleUpdateUser } from "@/lib/actions/admin/user-action";

interface User {
  id: string;
  Firstname: string;
  Lastname: string;
  email: string;
  role: string;
  phone?: string;
}

interface UserEditFormProps {
  userId: string;
}

export default function UserEditForm({ userId }: UserEditFormProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    Firstname: "",
    Lastname: "",
    email: "",
    role: "user",
    phone: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const result = await handleGetUserById(userId);
      if (result.success) {
        setUser(result.data);
        setFormData({
          Firstname: result.data.Firstname || "",
          Lastname: result.data.Lastname || "",
          email: result.data.email || "",
          role: result.data.role || "user",
          phone: result.data.phone || "",
        });
      } else {
        toast.error(result.message);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append("Firstname", formData.Firstname);
    data.append("Lastname", formData.Lastname);
    data.append("email", formData.email);
    data.append("role", formData.role);
    if (formData.phone) data.append("phone", formData.phone);

    const result = await handleUpdateUser(userId, data);
    if (result.success) {
      toast.success("User updated successfully");
      router.push(`/admin/users/${userId}`);
    } else {
      toast.error(result.message);
    }
    setSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="text-center py-8">
          <p className="text-muted-foreground">User not found</p>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 mt-4 text-orange-500 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href={`/admin/users/${userId}`}
        className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User Details
      </Link>

      {/* Edit Form */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="Firstname" className="text-sm font-medium">
                First Name
              </label>
              <input
                id="Firstname"
                name="Firstname"
                type="text"
                value={formData.Firstname}
                onChange={handleChange}
                className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="Lastname" className="text-sm font-medium">
                Last Name
              </label>
              <input
                id="Lastname"
                name="Lastname"
                type="text"
                value={formData.Lastname}
                onChange={handleChange}
                className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href={`/admin/users/${userId}`}
              className="rounded-lg border px-4 py-2 hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}