"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Stethoscope,
  Scissors,
  Calendar,
  MessageSquare,
  ChevronRight,
  Loader2,
  User,
  Award,
  Banknote,
  BadgeCheck,
  Pencil,
  X,
} from "lucide-react";
import {
  getVerifiedProviderLocations,
  type VerifiedProviderLocation,
} from "@/lib/api/public/provider";
import {
  getReviewsByProvider,
  getProviderRatingBreakdown,
  createReview,
} from "@/lib/api/user/review";
import { getServicesByProvider } from "@/lib/api/public/service";
import { API_CONFIG } from "@/lib/api/config";

type RatingBreakdown = {
  averageRating: number;
  totalReviews: number;
  excellent: number;
  good: number;
  average: number;
  belowAverage: number;
  poor: number;
};

type Review = {
  _id: string;
  rating: number;
  comment?: string;
  userName?: string;
  userProfileImage?: string;
  createdAt?: string;
};

const RATING_LABELS = ["", "Poor", "Below Average", "Average", "Good", "Excellent"];

export default function VetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params?.id as string;

  const [provider, setProvider] = useState<VerifiedProviderLocation | null>(
    null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [breakdown, setBreakdown] = useState<RatingBreakdown | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add review state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (providerId) loadData();
  }, [providerId]);

  async function loadData() {
    setLoading(true);
    const [provRes, revRes, breakdownRes, svcRes] = await Promise.all([
      getVerifiedProviderLocations(),
      getReviewsByProvider(providerId),
      getProviderRatingBreakdown(providerId),
      getServicesByProvider(providerId),
    ]);

    if (provRes.success && provRes.data) {
      const found = provRes.data.find((p) => p._id === providerId);
      setProvider(found ?? null);
    }
    if (revRes.success && revRes.data) {
      setReviews(revRes.data.reviews);
    }
    if (breakdownRes.success && breakdownRes.data) {
      setBreakdown(breakdownRes.data);
    }
    if (svcRes.success && svcRes.data) {
      setServices(svcRes.data);
    }
    setLoading(false);
  }

  async function handleSubmitReview() {
    if (reviewRating === 0) return;
    setSubmitting(true);
    const res = await createReview({
      providerId,
      rating: reviewRating,
      comment: reviewComment,
    });
    setSubmitting(false);
    if (res.success) {
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
      const [revRes, breakdownRes] = await Promise.all([
        getReviewsByProvider(providerId),
        getProviderRatingBreakdown(providerId),
      ]);
      if (revRes.success && revRes.data) setReviews(revRes.data.reviews);
      if (breakdownRes.success && breakdownRes.data)
        setBreakdown(breakdownRes.data);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-stone-400">
        <div className="p-4 bg-teal-50 rounded-full mb-4">
          <Loader2 className="w-7 h-7 animate-spin text-teal-500" />
        </div>
        <p className="text-sm font-medium">Loading provider details...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-stone-400">
        <div className="p-5 bg-stone-100 rounded-full mb-4">
          <Stethoscope className="w-12 h-12 opacity-30" />
        </div>
        <p className="text-lg font-bold text-stone-500 mb-1">
          Provider not found
        </p>
        <button
          onClick={() => router.push("/user/vets")}
          className="text-sm font-semibold text-[var(--pc-teal)] hover:underline"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const imageUrl = provider.profileImageUrl
    ? provider.profileImageUrl.startsWith("http")
      ? provider.profileImageUrl
      : API_CONFIG.getImageUrl(provider.profileImageUrl)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-[var(--pc-teal)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
        {/* Image banner */}
        <div className="h-60 bg-linear-to-br from-teal-50 via-cyan-50 to-teal-100 relative flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={provider.businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-teal-300">
              {provider.providerType === "vet" ? (
                <Stethoscope className="w-16 h-16" />
              ) : (
                <Scissors className="w-16 h-16" />
              )}
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--pc-teal)]">
              {provider.providerType === "vet" ? "Veterinarian" : "Shop"}
            </span>
          </div>
          {/* Gradient overlay at bottom for overlap */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/30 to-transparent" />
        </div>

        {/* Info card overlapping image */}
        <div className="relative -mt-14 mx-5">
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black text-stone-900 mb-0.5 tracking-tight">
                  {provider.businessName}
                </h1>
                {provider.degree && (
                  <p className="text-sm font-bold text-[var(--pc-teal)]">
                    {provider.degree}
                  </p>
                )}
                {provider.certification && (
                  <p className="text-xs text-teal-600/80 mt-0.5">
                    {provider.certification}
                  </p>
                )}
              </div>
              {/* Rating badge */}
              <div className="flex flex-col items-center bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 ml-4 shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-lg font-black text-stone-800">
                    {(provider.rating ?? 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-semibold">
                  {provider.ratingCount ?? 0} reviews
                </span>
              </div>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {provider.workingHours && (
                <span className="inline-flex items-center gap-1.5 bg-stone-50 text-stone-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-100">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {provider.workingHours}
                </span>
              )}
              {provider.experience && (
                <span className="inline-flex items-center gap-1.5 bg-teal-50 text-[var(--pc-teal)] text-xs font-medium px-3 py-1.5 rounded-lg border border-teal-100">
                <Award className="w-3.5 h-3.5" />
                  {provider.experience}
                </span>
              )}
              {provider.location?.address && (
                <span className="inline-flex items-center gap-1.5 bg-stone-50 text-stone-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-100">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {provider.location.address}
                </span>
              )}
            </div>

            {/* Appointment fee */}
            {provider.appointmentFee != null &&
              provider.appointmentFee > 0 && (
                <div className="mt-4 flex items-center gap-2 bg-[var(--pc-teal)]/5 border border-[var(--pc-teal)]/15 rounded-xl px-4 py-2.5">
                  <Banknote className="w-4 h-4 text-[var(--pc-teal)]" />
                  <span className="text-sm font-bold text-[var(--pc-teal)]">
                    LKR {provider.appointmentFee} per Appointment
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* Bio */}
        {provider.bio && (
          <div className="px-6 pt-5">
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              About
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              {provider.bio}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="p-5 flex gap-3">
          <Link
            href={`/user/bookings/new?providerId=${provider._id}${provider.appointmentFee ? `&price=${provider.appointmentFee}` : ""}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--pc-teal)] text-white font-bold py-3.5 px-6 rounded-xl hover:bg-[var(--pc-teal-dark)] transition-colors shadow-md shadow-teal-200/50"
          >
            <Calendar className="w-5 h-5" />
            Book an Appointment
          </Link>
          <Link
            href="/user/vet-chat"
            className="inline-flex items-center justify-center gap-2 border border-stone-200 text-stone-600 font-semibold py-3.5 px-5 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Chat
          </Link>
        </div>
      </div>

      {/* Services by this provider */}
      {services.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-teal-50 rounded-lg">
              <BadgeCheck className="w-4 h-4 text-[var(--pc-teal)]" />
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Services Offered
            </h2>
          </div>
          <div className="space-y-2.5">
            {services.map((svc: any) => (
              <Link
                key={svc._id}
                href={`/user/services/${svc._id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-sm text-stone-900 group-hover:text-[var(--pc-teal)]">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {svc.duration} · LKR {svc.price}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 rounded-lg">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Reviews & Ratings
            </h2>
            {reviews.length > 0 && (
              <span className="bg-stone-100 text-stone-500 text-xs font-bold px-2 py-0.5 rounded-md">
                {reviews.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors px-3 py-1.5 rounded-lg ${
              showReviewForm
                ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                : "bg-[var(--pc-teal)]/10 text-[var(--pc-teal)] hover:bg-[var(--pc-teal)]/20"
            }`}
          >
            {showReviewForm ? (
              <>
                <X className="w-3.5 h-3.5" /> Cancel
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" /> Write Review
              </>
            )}
          </button>
        </div>

        {/* Rating Breakdown */}
        {breakdown && (
          <div className="bg-stone-50 rounded-xl p-5 mb-5">
            <div className="flex items-center gap-8">
              <div className="text-center shrink-0">
                <p className="text-4xl font-black text-stone-900 leading-none">
                  {breakdown.averageRating.toFixed(1)}
                </p>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const value = breakdown.averageRating - (i - 1);
                    return (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          value >= 1
                            ? "text-amber-400 fill-amber-400"
                            : value > 0
                              ? "text-amber-400 fill-amber-200"
                              : "text-stone-200 fill-stone-100"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-400 font-semibold mt-1">
                  {breakdown.totalReviews} reviews
                </p>
              </div>
              <div className="w-px h-20 bg-stone-200" />
              <div className="flex-1 space-y-1.5">
                <BreakdownBar
                  stars={5}
                  count={breakdown.excellent}
                  total={breakdown.totalReviews}
                  color="bg-[var(--pc-teal)]"
                />
                <BreakdownBar
                  stars={4}
                  count={breakdown.good}
                  total={breakdown.totalReviews}
                  color="bg-[var(--pc-sage)]"
                />
                <BreakdownBar
                  stars={3}
                  count={breakdown.average}
                  total={breakdown.totalReviews}
                  color="bg-amber-400"
                />
                <BreakdownBar
                  stars={2}
                  count={breakdown.belowAverage}
                  total={breakdown.totalReviews}
                  color="bg-[var(--pc-primary)]"
                />
                <BreakdownBar
                  stars={1}
                  count={breakdown.poor}
                  total={breakdown.totalReviews}
                  color="bg-red-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Add Review Form */}
        {showReviewForm && (
          <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-5 mb-5">
            <h3 className="font-bold text-stone-800 mb-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Help other pet owners make informed decisions
            </p>
            {/* Star selector */}
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setReviewRating(i)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-9 h-9 cursor-pointer transition-colors ${
                      i <= reviewRating
                        ? "text-amber-400 fill-amber-400"
                        : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
              {reviewRating > 0 && (
                <span className="text-xs font-bold text-[var(--pc-teal)] ml-2">
                  {RATING_LABELS[reviewRating]}
                </span>
              )}
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Tell others about your experience with this provider..."
              rows={3}
              className="w-full mt-3 px-4 py-3 rounded-xl border border-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--pc-teal)]/30 focus:border-[var(--pc-teal)] text-sm resize-none transition-all"
            />
            <button
              onClick={handleSubmitReview}
              disabled={reviewRating === 0 || submitting}
              className="mt-3 bg-[var(--pc-teal)] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[var(--pc-teal-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm shadow-md shadow-teal-200/50"
            >
              {submitting ? "Posting..." : "Submit Review"}
            </button>
          </div>
        )}

        {/* Review List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <div className="p-4 bg-stone-50 rounded-full inline-block mb-3">
              <Star className="w-8 h-8 opacity-30" />
            </div>
            <p className="font-bold text-stone-500">No reviews yet</p>
            <p className="text-sm mt-0.5">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BreakdownBar({
  stars,
  count,
  total,
  color,
}: {
  stars: number;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-stone-500 w-3 text-right">
        {stars}
      </span>
      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
      <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-stone-400 w-5 text-right">
        {count}
      </span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  function timeAgo(dateStr?: string) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <div className="border border-stone-100 rounded-xl p-4 hover:border-stone-200 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center overflow-hidden shrink-0">
          {review.userProfileImage ? (
            <img
              src={review.userProfileImage}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-[var(--pc-teal)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-stone-800">
            {review.userName || "Anonymous"}
          </p>
          <p className="text-[11px] text-stone-400">
            {timeAgo(review.createdAt)}
          </p>
        </div>
        {/* Rating badge */}
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg shrink-0">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-black text-stone-700">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-stone-600 leading-relaxed mt-3 ml-12">
          {review.comment}
        </p>
      )}
    </div>
  );
}
