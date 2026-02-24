"use server";

import { createReview, getMyReviews, getReviewById, updateReview, deleteReview } from "@/lib/api/user/review";
import { mapApiResult, withActionGuard } from "@/lib/actions/_shared";
import { revalidatePath } from "next/cache";

export async function handleCreateReview(data: any) {
  return withActionGuard(async () => {
    const response = await createReview(data);
    if (response?.success) {
      revalidatePath("/user/reviews");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to create review",
      successMessage: "Review submitted!",
    });
  }, {
    fallbackMessage: "Failed to create review",
    logLabel: "Create review error",
  });
}

export async function handleGetMyReviews() {
  return withActionGuard(async () => {
    const response = await getMyReviews();

    return mapApiResult(response, {
      errorMessage: "Failed to fetch reviews",
    });
  }, {
    fallbackMessage: "Failed to fetch reviews",
    logLabel: "Get my reviews error",
  });
}

export async function handleGetReviewById(id: string) {
  return withActionGuard(async () => {
    const response = await getReviewById(id);

    return mapApiResult(response, {
      errorMessage: "Failed to fetch review",
    });
  }, {
    fallbackMessage: "Failed to fetch review",
    logLabel: "Get review by id error",
  });
}

export async function handleUpdateReview(id: string, data: any) {
  return withActionGuard(async () => {
    const response = await updateReview(id, data);
    if (response?.success) {
      revalidatePath("/user/reviews");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to update review",
      successMessage: "Review updated!",
    });
  }, {
    fallbackMessage: "Failed to update review",
    logLabel: "Update review error",
  });
}

export async function handleDeleteReview(id: string) {
  return withActionGuard(async () => {
    const response = await deleteReview(id);
    if (response?.success) {
      revalidatePath("/user/reviews");
    }

    return mapApiResult(response, {
      errorMessage: "Failed to delete review",
      successMessage: "Review deleted",
    });
  }, {
    fallbackMessage: "Failed to delete review",
    logLabel: "Delete review error",
  });
}

