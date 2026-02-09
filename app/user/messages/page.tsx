"use client";

import { useState, useEffect } from "react";
import { getMyMessages, createMessage, deleteMessage } from "@/lib/api/user/message";
import { Message } from "@/lib/types/message";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    setLoading(true);
    const res = await getMyMessages();
    if (res.success && res.data) setMessages(res.data);
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    const res = await createMessage({ content: content.trim() });
    if (res.success) {
      toast.success("Message sent!");
      setContent("");
      loadMessages();
    } else {
      toast.error(res.message);
    }
    setSending(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const res = await deleteMessage(id);
    if (res.success) {
      toast.success("Message deleted");
      loadMessages();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Send and manage your messages</p>
      </div>

      {/* Compose */}
      <form onSubmit={handleSend} className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">New Message</label>
        <div className="flex gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent resize-none"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="px-5 bg-[#0f4f57] text-white rounded-lg font-medium hover:bg-[#0c4148] transition-colors disabled:opacity-50 self-end"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between group">
              <div className="flex-1">
                <p className="text-gray-800">{msg.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(msg._id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
