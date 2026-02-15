"use server";

import { createReview, getMyReviews, getReviewById, updateReview, deleteReview } from "@/lib/api/user/review";
import { revalidatePath } from "next/cache";

export async function handleCreateReview(data: any) {
  try {
    const response = await createReview(data);
    if (response.success) {
      revalidatePath("/user/reviews");
      return { success: true, message: "Review submitted!", data: response.data };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetMyReviews() {
  try {
    const response = await getMyReviews();
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleGetReviewById(id: string) {
  try {
    const response = await getReviewById(id);
    if (response.success) return { success: true, data: response.data };
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleUpdateReview(id: string, data: any) {
  try {
    const response = await updateReview(id, data);
    if (response.success) {
      revalidatePath("/user/reviews");
      return { success: true, message: "Review updated!", data: response.data };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function handleDeleteReview(id: string) {
  try {
    const response = await deleteReview(id);
    if (response.success) {
      revalidatePath("/user/reviews");
      return { success: true, message: "Review deleted" };
    }
    return { success: false, message: response.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

