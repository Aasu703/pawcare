import axios from "../axios";
import { API } from "../endpoints";
import { Review, CreateReviewRequest, UpdateReviewRequest } from "@/lib/types/review";

export async function createReview(data: CreateReviewRequest): Promise<{ success: boolean; message: string; data?: Review }> {
  try {
    const response = await axios.post(API.REVIEW.CREATE, data);
    return { success: true, message: response.data.message || "Review created", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to create review" };
  }
}

export async function getMyReviews(): Promise<{ success: boolean; message: string; data?: Review[] }> {
  try {
    const response = await axios.get(API.REVIEW.GET_MY);
    return { success: true, message: "Reviews fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch reviews" };
  }
}

export async function getReviewById(id: string): Promise<{ success: boolean; message: string; data?: Review }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_ID(id));
    return { success: true, message: "Review fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch review" };
  }
}

export async function updateReview(id: string, data: UpdateReviewRequest): Promise<{ success: boolean; message: string; data?: Review }> {
  try {
    const response = await axios.put(API.REVIEW.UPDATE(id), data);
    return { success: true, message: response.data.message || "Review updated", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to update review" };
  }
}

export async function deleteReview(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.REVIEW.DELETE(id));
    return { success: true, message: response.data.message || "Review deleted" };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to delete review" };
  }
}

export async function getReviewsByProvider(providerId: string, page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { reviews: Review[]; total: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_PROVIDER(providerId), { params: { page, limit } });
    return { success: true, message: "Reviews fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch reviews" };
  }
}

export async function getReviewsByProduct(productId: string, page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { reviews: Review[]; total: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_PRODUCT(productId), { params: { page, limit } });
    return { success: true, message: "Reviews fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch reviews" };
  }
}

export async function getProviderRating(providerId: string): Promise<{ success: boolean; message: string; data?: { averageRating: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_PROVIDER_RATING(providerId));
    return { success: true, message: "Rating fetched", data: response.data.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch rating" };
  }
}
