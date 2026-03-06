"use client";

import { useState, useEffect } from "react";
import { getFeedbackByProvider } from "@/lib/api/provider/provider";
import { MessageCircle } from "lucide-react";

function getProviderId(): string {
  if (typeof window === "undefined") return "";
  try {
    const cookie = document.cookie.split("; ").find((c) => c.startsWith("user_data="));
    if (cookie) {
      const data = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
      return data._id || data.id || "";
    }
  } catch { /* empty */ }
  return "";
}

export default function ProviderFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const providerId = getProviderId();

  useEffect(() => {
    if (!providerId) return;
    const load = async () => {
      setLoading(true);
      const res = await getFeedbackByProvider(providerId);
      if (res.success && res.data) setFeedback(res.data);
      setLoading(false);
    };
    load();
  }, [providerId]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
        <p className="text-muted-foreground mt-1">Feedback you have shared for users after completed bookings</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Feedback</p>
          <p className="text-3xl font-bold text-[var(--pc-teal)] mt-1">{feedback.length}</p>
        </div>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--pc-teal)] border-t-transparent"></div>
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg text-muted-foreground">No feedback yet</p>
          <p className="text-sm text-muted-foreground mt-1">Submit feedback from completed bookings to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((f) => (
            <div key={f._id} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-semibold text-foreground text-sm">
                    {typeof f.userId === "object" ? (f.userId as any).Firstname || "Customer" : "Customer"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              <p className="mt-3 text-muted-foreground text-sm">{f.feedback}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

