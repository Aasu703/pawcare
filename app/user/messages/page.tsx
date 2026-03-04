"use client";

import { useState, useEffect } from "react";
import { getAllMessages, createMessage, deleteMessage } from "@/lib/api/user/message";
import { MessageSquare, Send, Trash2, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { getApiBaseUrl, pickImagePath, resolveMediaUrl } from "@/lib/utils/media-url";

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const currentUserId = user?._id || user?.id || "";
  const baseUrl = getApiBaseUrl();

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    setLoading(true);
    const res = await getAllMessages(1, 100);
    if (res.success && res.data) {
      setMessages(res.data.messages || []);
    } else {
      toast.error(res.message);
    }
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

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this message?")) return;
    const res = await deleteMessage(data);
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
        <h1 className="text-3xl font-bold text-foreground">Community Blogs</h1>
        <p className="text-muted-foreground mt-1">Write a blog and see updates from all users</p>
      </div>

      {/* Compose */}
      <form onSubmit={handleSend} className="bg-white rounded-xl border border-border p-5 mb-8">
        <label className="block text-sm font-medium text-foreground mb-2">Write Blog</label>
        <div className="flex gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-[var(--pc-teal)] focus:border-transparent resize-none"
            placeholder="Share your thoughts..."
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="px-5 bg-[var(--pc-teal)] text-white rounded-lg font-medium hover:bg-[var(--pc-teal-dark)] transition-colors disabled:opacity-50 self-end"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--pc-teal)] border-t-transparent"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const author = typeof msg.userId === "object" ? msg.userId : null;
            const authorId = typeof msg.userId === "string" ? msg.userId : author?._id || author?.id || (msg.userId as any)?.toString?.() || "";
            const isOwnMessage = Boolean(currentUserId && authorId && currentUserId === authorId);
            const rawImageUrl = pickImagePath(author) || (isOwnMessage ? pickImagePath(user) : "");
            const imageSrc = resolveMediaUrl(rawImageUrl, baseUrl, "image");
            const displayName = author
              ? `${author.Firstname || ""} ${author.Lastname || ""}`.trim() || author.email || "User"
              : (isOwnMessage ? (user?.Firstname || user?.firstName || user?.name || user?.email || "You") : "User");

            return (
              <div key={msg._id} className="bg-white rounded-xl border border-border p-5 flex items-start justify-between group">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {imageSrc ? (
                      <img src={imageSrc} alt={displayName} width={48} height={48} className="object-cover w-12 h-12" />
                    ) : (
                      <div className="w-12 h-12 bg-muted flex items-center justify-center">
                        <UserCircle className="h-7 w-7 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</p>
                    </div>
                    <p className="text-foreground mt-2">{msg.content}</p>
                  </div>
                </div>

                {isOwnMessage && (
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

