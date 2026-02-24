import axios from "../axios";
import { API } from "../endpoints";

export async function getAssignedPetsForVet(): Promise<{ success: boolean; message: string; data?: any[] }> {
  try {
    const response = await axios.get(API.PROVIDER.PET.GET_ASSIGNED);
    const raw = response.data?.data;
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.pets)
        ? raw.pets
        : Array.isArray(raw?.items)
          ? raw.items
          : [];

    return {
      success: true,
      message: response.data?.message || "Assigned pets fetched",
      data: list.map((item: any) => item?._doc || item),
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || "Failed to fetch assigned pets",
    };
  }
}
