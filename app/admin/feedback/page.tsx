"use client";

import { useState, useEffect } from "react";
import { getAllFeedback, deleteFeedback } from "@/lib/api/admin/feedback";
import { Feedback } from "@/lib/types/provider";
import { Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllFeedback(1, 100);
      setFeedback(res.data || res.feedback || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feedback?")) return;
    try {
      await deleteFeedback(id);
      toast.success("Feedback deleted");
      load();
    } catch {
      toast.error("Failed to delete feedback");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Feedback Management</h1>
        <p className="text-muted-foreground mt-1">View and moderate all provider feedback</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-gray-400">No feedback found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((f) => (
            <div key={f._id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-sm">
                      {typeof f.userId === "object" ? (f.userId as any).Firstname || "User" : "User"}
                    </span>
                    <span className="text-xs text-gray-400">→</span>
                    <span className="font-medium text-sm">
                      {typeof f.providerId === "object" ? (f.providerId as any).businessName || "Provider" : "Provider"}
                    </span>
                    {f.serviceId && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {typeof f.serviceId === "object" ? (f.serviceId as any).title : "Service"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${star <= (f.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                  {f.comment && <p className="text-sm text-gray-600">{f.comment}</p>}
                </div>
                <button onClick={() => handleDelete(f._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
