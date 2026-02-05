"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, Calendar, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { handleGetUserById } from "@/lib/actions/admin/user-action";

interface User {
  id: string;
  Firstname: string;
  Lastname: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserDetailProps {
  userId: string;
}

export default function UserDetail({ userId }: UserDetailProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const result = await handleGetUserById(userId);
      if (result.success) {
        setUser(result.data);
      } else {
        toast.error(result.message);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

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

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    user: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    provider: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      {/* User Details Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <UserIcon className="h-10 w-10 text-orange-600" />
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">
                {user.Firstname} {user.Lastname}
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                    roleColors[user.role] || roleColors.user
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {user.updatedAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/admin/users/${userId}/edit`}
          className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          Edit User
        </Link>
      </div>
    </div>
  );
}