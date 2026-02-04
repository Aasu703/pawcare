"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
import {
  handleGetAllUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from "@/lib/actions/admin/user-action";
import UserModal from "./UserModal";

interface User {
  _id: string;
  Firstname: string;
  Lastname: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const fetchUsers = async () => {
    setLoading(true);
    const result = await handleGetAllUsers();
    if (result.success) {
      setUsers(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const result = await handleDeleteUser(id);
    if (result.success) {
      toast.success(result.message);
      fetchUsers();
    } else {
      toast.error(result.message);
    }
  };

  const handleSubmit = async (data: FormData) => {
    let result;
    if (modalMode === "create") {
      result = await handleCreateUser(data);
    } else if (selectedUser) {
      result = await handleUpdateUser(selectedUser._id, data);
    }

    if (result?.success) {
      toast.success(result.message);
      setModalOpen(false);
      fetchUsers();
    } else {
      toast.error(result?.message || "Operation failed");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.Firstname} ${user.Lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    user: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    provider: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Users Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border bg-background py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{user.Firstname} {user.Lastname}</td>
                    <td className="py-4 text-muted-foreground">{user.email}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          roleColors[user.role] || roleColors.user
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {user.phone || "-"}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="rounded-lg p-2 hover:bg-muted"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="rounded-lg p-2 hover:bg-muted"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
}
