"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Provider {
  _id: string;
  businessName: string;
  email: string;
  phone?: string;
  specialty?: string;
  address?: string;
  isActive?: boolean;
}

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  provider?: Provider | null;
  mode: "create" | "edit";
}

export default function ProviderModal({
  isOpen,
  onClose,
  onSubmit,
  provider,
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
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Add Provider" : "Edit Provider"}
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
            <label className="mb-1 block text-sm font-medium">Business Name</label>
            <input
              name="businessName"
              type="text"
              defaultValue={provider?.businessName || ""}
              required
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={provider?.email || ""}
              required
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {mode === "create" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={provider?.phone || ""}
              required
              minLength={10}
              placeholder="e.g. 1234567890"
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Specialty</label>
            <select
              name="specialty"
              defaultValue={provider?.specialty || "general"}
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="general">General</option>
              <option value="grooming">Grooming</option>
              <option value="veterinary">Veterinary</option>
              <option value="training">Training</option>
              <option value="boarding">Boarding</option>
              <option value="daycare">Daycare</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <textarea
              name="address"
              defaultValue={provider?.address || ""}
              required
              minLength={5}
              rows={2}
              className="w-full rounded-lg border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={provider?.isActive !== false}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label className="text-sm font-medium">Active</label>
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

