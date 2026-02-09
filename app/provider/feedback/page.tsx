"use client";

import { useState, useEffect } from "react";
import { getFeedbackByProvider } from "@/lib/api/provider/provider";
import { Feedback } from "@/lib/types/provider";
import { Star, MessageCircle } from "lucide-react";

export default function ProviderFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getFeedbackByProvider();
      if (res.success && res.data) setFeedback(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1)
      : "0";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-500 mt-1">Reviews and ratings from your customers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-3xl font-bold text-[#0f4f57] mt-1">{feedback.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-3xl font-bold text-[#0f4f57]">{avgRating}</p>
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">5-Star Reviews</p>
          <p className="text-3xl font-bold text-[#0f4f57] mt-1">
            {feedback.filter((f) => f.rating === 5).length}
          </p>
        </div>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg text-gray-500">No feedback yet</p>
          <p className="text-sm text-gray-400 mt-1">Reviews will appear here once customers leave feedback</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((f) => (
            <div key={f._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {typeof f.userId === "object" ? (f.userId as any).name || "Customer" : "Customer"}
                    </span>
                    {f.serviceId && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {typeof f.serviceId === "object" ? (f.serviceId as any).title || "Service" : "Service"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= (f.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              {f.comment && (
                <p className="mt-3 text-gray-600 text-sm">{f.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
