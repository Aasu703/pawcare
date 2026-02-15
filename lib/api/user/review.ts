import axios from "../axios";
import { API } from "../endpoints";
export async function createReview(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.post(API.REVIEW.CREATE, data);
    return { success: true, message: response.data.message || "Review created", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to create review" };
  }
}

export async function getMyReviews(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.REVIEW.GET_MY);
    return { success: true, message: "Reviews fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch reviews" };
  }
}

export async function getReviewById(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_ID(data));
    return { success: true, message: "Review fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch review" };
  }
}

export async function updateReview(id: any, data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await axios.put(API.REVIEW.UPDATE(id), data);
    return { success: true, message: response.data.message || "Review updated", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to update review" };
  }
}

export async function deleteReview(data: any): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.delete(API.REVIEW.DELETE(data));
    return { success: true, message: response.data.message || "Review deleted" };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to delete review" };
  }
}

export async function getReviewsByProvider(providerId: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { reviews: any[]; total: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_PROVIDER(providerId), { params: { page, limit } });
    return { success: true, message: "Reviews fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch reviews" };
  }
}

export async function getReviewsByProduct(productId: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; message: string; data?: { reviews: any[]; total: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_PRODUCT(productId), { params: { page, limit } });
    return { success: true, message: "Reviews fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch reviews" };
  }
}

export async function getProviderRating(data: any): Promise<{ success: boolean; message: string; data?: { averageRating: number } }> {
  try {
    const response = await axios.get(API.REVIEW.GET_PROVIDER_RATING(data));
    return { success: true, message: "Rating fetched", data: response.data.data };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || err.message || "Failed to fetch rating" };
  }
}


