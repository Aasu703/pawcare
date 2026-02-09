"use client";

import { useState, useEffect } from "react";
import { getAllMessages, deleteMessage } from "@/lib/api/admin/message";
import { Message } from "@/lib/types/message";
import { Trash2, Eye, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllMessages(1, 100);
      setMessages(res.data || res.messages || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      toast.success("Message deleted");
      setSelected(null);
      load();
    } catch {
      toast.error("Failed to delete message");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all messages</p>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Message Detail</h2>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">User:</span> {typeof selected.userId === "object" ? (selected.userId as any).Firstname : selected.userId}</p>
              <p><span className="font-medium">Date:</span> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ""}</p>
              <div className="border-t pt-3 mt-3">
                <p className="text-gray-700">{selected.content}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => handleDelete(selected._id)} className="text-sm text-red-500 hover:text-red-700">Delete Message</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No messages found</td></tr>
              ) : messages.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{typeof m.userId === "object" ? (m.userId as any).Firstname : m.userId}</td>
                  <td className="px-6 py-4 text-sm truncate max-w-xs">{m.content?.substring(0, 60) || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setSelected(m)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(m._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
