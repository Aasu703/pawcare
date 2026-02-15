"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface User {
  _id: string;
  Firstname: string;
  Lastname: string;
  email: string;
  role: string;
  phone?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  user?: User | null;
  mode: "create" | "edit";
}

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  mode,
}: any) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create User" : "Edit User"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">First Name</label>
            <input
              name="Firstname"
              type="text"
              defaultValue={user?.Firstname || ""}
              required
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Last Name</label>
            <input
              name="Lastname"
              type="text"
              defaultValue={user?.Lastname || ""}
              required
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              required
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {mode === "create" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          {mode === "create" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select
              name="role"
              defaultValue={user?.role || "user"}
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={user?.phone || ""}
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Profile Image</label>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border px-4 py-2 hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

