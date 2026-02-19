"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ChatContact,
  ChatConversation,
  ChatMessage,
  getChatContacts,
  getChatConversations,
  getChatMessages,
  sendChatMessage,
} from "@/lib/api/chat";
import { MessageSquare, Send, UserCircle } from "lucide-react";
import { toast } from "sonner";

type ActiveParticipant = {
  participantId: string;
  participantRole: "provider" | "user";
  name: string;
  subtitle?: string;
  imageUrl?: string;
};

export default function UserVetChatPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentUserId = user?._id || user?.id || "";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:5050";

  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [manualActive, setManualActive] = useState<ActiveParticipant | null>(null);

  const selectedFromQuery = useMemo(() => {
    const participantId = searchParams.get("participantId") || "";
    const participantRole = (searchParams.get("participantRole") || "provider") as
      | "provider"
      | "user";
    const participantName = searchParams.get("participantName") || "Provider";
    const participantSubtitle = searchParams.get("participantSubtitle") || "";
    if (!participantId) return null;
    return {
      participantId,
      participantRole,
      name: participantName,
      subtitle: participantSubtitle || undefined,
    } satisfies ActiveParticipant;
  }, [searchParams]);

  const loadInitial = async () => {
    setLoading(true);
    const [contactsRes, conversationsRes] = await Promise.all([
      getChatContacts(),
      getChatConversations(1, 30),
    ]);

    if (contactsRes.success && contactsRes.data) {
      setContacts(contactsRes.data);
    } else if (!contactsRes.success) {
      toast.error(contactsRes.message);
    }

    if (conversationsRes.success && conversationsRes.data) {
      setConversations(conversationsRes.data.conversations || []);
    } else if (!conversationsRes.success) {
      toast.error(conversationsRes.message);
    }
    setLoading(false);
  };

  const loadMessages = async (participant: ActiveParticipant) => {
    setMessagesLoading(true);
    const res = await getChatMessages(
      participant.participantId,
      participant.participantRole,
      1,
      200,
    );
    if (res.success && res.data) {
      setMessages(res.data.messages || []);
    } else {
      toast.error(res.message);
      setMessages([]);
    }
    setMessagesLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInitial();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const defaultActive = useMemo<ActiveParticipant | null>(() => {
    if (selectedFromQuery) return selectedFromQuery;
    if (conversations.length === 0) return null;
    const first = conversations[0];
    return {
      participantId: first.participantId,
      participantRole: first.participantRole,
      name: first.participantName,
      subtitle: first.participantSubtitle,
      imageUrl: first.participantImage,
    };
  }, [conversations, selectedFromQuery]);

  const active = manualActive ?? defaultActive;

  useEffect(() => {
    if (!active) {
      const timer = window.setTimeout(() => {
        setMessages([]);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      void loadMessages(active);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (selectedFromQuery) {
      const timer = window.setTimeout(() => {
        setManualActive(null);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [selectedFromQuery]);

  const handleSelectContact = (contact: ChatContact) => {
    const participant: ActiveParticipant = {
      participantId: contact.participantId,
      participantRole: contact.participantRole,
      name: contact.name,
      subtitle: contact.subtitle,
      imageUrl: contact.imageUrl,
    };
    setManualActive(participant);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !draft.trim()) return;

    setSending(true);
    const res = await sendChatMessage(
      active.participantId,
      draft.trim(),
      active.participantRole,
    );
    if (res.success) {
      setDraft("");
      await loadMessages(active);
      await loadInitial();
    } else {
      toast.error(res.message);
    }
    setSending(false);
  };

  const resolveImage = (raw?: string) => {
    if (!raw) return "";
    return raw.startsWith("http") ? raw : `${baseUrl}${raw}`;
  };

  const participants = contacts.filter((contact) => contact.participantRole === "provider");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vet Chat</h1>
        <p className="text-gray-500 mt-1">Message your vet providers directly</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-4">
          <aside className="bg-white border border-gray-200 rounded-xl p-3">
            <h2 className="px-2 py-2 text-sm font-semibold text-gray-700">Your Vets</h2>
            {participants.length === 0 ? (
              <p className="px-2 py-8 text-sm text-gray-500">
                No vet contacts yet. Vet contacts appear after bookings.
              </p>
            ) : (
              <div className="space-y-1">
                {participants.map((contact) => {
                  const isActive = active?.participantId === contact.participantId;
                  return (
                    <button
                      key={contact.participantId}
                      onClick={() => handleSelectContact(contact)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive ? "bg-[#0f4f57]/10" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {contact.imageUrl ? (
                          <img
                            src={resolveImage(contact.imageUrl)}
                            alt={contact.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                        <p className="text-xs text-gray-500 truncate">{contact.subtitle || "Provider"}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="bg-white border border-gray-200 rounded-xl flex flex-col min-h-[520px]">
            {!active ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg text-gray-500">Select a vet to start chatting</p>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{active.name}</p>
                  <p className="text-xs text-gray-500">{active.subtitle || "Provider"}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messagesLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-10">
                      No messages yet. Start the conversation.
                    </p>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = Boolean(currentUserId && msg.senderId === currentUserId);
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
                              isOwn
                                ? "bg-[#0f4f57] text-white rounded-br-md"
                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                            }`}
                          >
                            <p>{msg.content}</p>
                            {msg.createdAt && (
                              <p
                                className={`mt-1 text-[11px] ${
                                  isOwn ? "text-white/70" : "text-gray-500"
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSend} className="p-3 border-t border-gray-200 flex gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="px-4 rounded-lg bg-[#0f4f57] text-white hover:bg-[#0c4148] disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
