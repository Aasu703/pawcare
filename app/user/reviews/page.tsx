"use client";

import { useState, useEffect } from "react";
import { getMyReviews, createReview, updateReview, deleteReview } from "@/lib/api/user/review";
import { Star, Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    setLoading(true);
    const res = await getMyReviews();
    if (res.success && res.data) setReviews(res.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingId) {
      res = await updateReview(editingId, form);
    } else {
      res = await createReview(form);
    }
    if (res.success) {
      toast.success(editingId ? "Review updated!" : "Review submitted!");
      resetForm();
      loadReviews();
    } else {
      toast.error(res.message);
    }
  };

  const handleEdit = (data: any) => {
    setEditingId(data._id);
    setForm({ rating: data.rating, comment: data.comment || "" });
    setShowForm(true);
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this review?")) return;
    const res = await deleteReview(data);
    if (res.success) {
      toast.success("Review deleted");
      loadReviews();
    } else {
      toast.error(res.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ rating: 5, comment: "" });
  };

  const renderStars = (rating: any, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${interactive ? "cursor-pointer" : ""}`}
            onClick={interactive ? () => setForm({ ...form, rating: star }) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-500 mt-1">Share your experience with our services</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#0f4f57] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0c4148] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Write Review
        </button>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editingId ? "Edit Review" : "Write a Review"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                {renderStars(form.rating, true)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent resize-none"
                  placeholder="Tell us about your experience..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0f4f57] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0c4148] transition-colors"
              >
                {editingId ? "Update Review" : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">Share your experience with our services</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  {renderStars(review.rating)}
                  {review.comment && (
                    <p className="text-gray-700 mt-3">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(review)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(review._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

