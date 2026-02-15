"use client";

import { useState, useEffect } from "react";
import { getAllReviews, deleteReview } from "@/lib/api/admin/review";
import { Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllReviews(1, 100);
      setReviews(res.data?.data || res.reviews || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(data);
      toast.success("Review deleted");
      load();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <p className="text-muted-foreground mt-1">View and moderate all reviews</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-gray-400">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-sm">
                      {typeof r.userId === "object" ? (r.userId as any).Firstname || "User" : "User"}
                    </span>
                    <span className="text-xs text-gray-400">left a review</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${star <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </div>
                <button onClick={() => handleDelete(r._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

