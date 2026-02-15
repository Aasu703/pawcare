import axios from "../axios";
import { API } from "../endpoints";
export async function createReview(data: any): Promise<{ success: boolean; message: string; data?: Review }> {
  try {
    const response = await axios.post(API.REVIEW.CREATE, data);
    return { success: boolean, message: response.data.message || "Review created", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to create review" };
  }
}

export async function getMyReviews(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.REVIEW.GET_MY);
    return { success: boolean, message: "Reviews fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch reviews" };
  }
}

export async function getReviewById(data: any): Promise<{ success: boolean; message: string; data?: Review }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_ID(id));
    return { success: boolean, message: "Review fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch review" };
  }
}

export async function updateReview(id: any, data: any): Promise<{ success: boolean; message: string; data?: Review }> {
  try {
    const response = await axios.put(API.REVIEW.UPDATE(id), data);
    return { success: boolean, message: response.data.message || "Review updated", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to update review" };
  }
}

export async function deleteReview(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.REVIEW.DELETE(id));
    return { success: boolean, message: response.data.message || "Review deleted" };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to delete review" };
  }
}

export async function getReviewsByProvider(providerId: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { reviews: any[]; total: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_PROVIDER(providerId), { params: { page, limit } });
    return { success: boolean, message: "Reviews fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch reviews" };
  }
}

export async function getReviewsByProduct(productId: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { reviews: any[]; total: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_PRODUCT(productId), { params: { page, limit } });
    return { success: boolean, message: "Reviews fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch reviews" };
  }
}

export async function getProviderRating(data: any): Promise<{ success: boolean; message: string; data?: { averageRating: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_PROVIDER_RATING(providerId));
    return { success: boolean, message: "Rating fetched", data: response.data.data };
  } catch (data: any) {
    return { success: boolean, message: error.response?.data?.message || error.message || "Failed to fetch rating" };
  }
}


