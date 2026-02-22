import axios from "../axios";
import { API } from "../endpoints";

export type ProviderLocationMode = "pet-shop" | "vet-hospital";

export type VerifiedProviderLocation = {
  _id: string;
  businessName: string;
  clinicOrShopName?: string;
  providerType: "shop" | "vet";
  address?: string;
  rating?: number;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
};

function toProviderType(mode?: ProviderLocationMode) {
  if (mode === "pet-shop") return "shop";
  if (mode === "vet-hospital") return "vet";
  return undefined;
}

export async function getVerifiedProviderLocations(
  mode?: ProviderLocationMode,
): Promise<{ success: boolean; message: string; data?: VerifiedProviderLocation[] }> {
  try {
    const providerType = toProviderType(mode);
    const response = await axios.get(API.PROVIDER.GET_VERIFIED_LOCATIONS, {
      params: providerType ? { providerType } : undefined,
    });

    const raw = response.data?.data;
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.items)
        ? raw.items
        : [];

    const data = list
      .map((item: any) => item?._doc || item)
      .filter((item: any) => item?._id && item?.location)
      .map((item: any) => ({
        _id: String(item._id),
        businessName: String(item.businessName || ""),
        clinicOrShopName: item.clinicOrShopName ? String(item.clinicOrShopName) : "",
        providerType: item.providerType === "vet" ? "vet" : "shop",
        address: item.address ? String(item.address) : "",
        rating: typeof item.rating === "number" ? item.rating : Number(item.rating || 0),
        location: {
          latitude: Number(item.location.latitude),
          longitude: Number(item.location.longitude),
          address: item.location.address ? String(item.location.address) : "",
        },
      }))
      .filter((item: VerifiedProviderLocation) =>
        Number.isFinite(item.location.latitude) &&
        Number.isFinite(item.location.longitude) &&
        item.location.latitude >= -90 &&
        item.location.latitude <= 90 &&
        item.location.longitude >= -180 &&
        item.location.longitude <= 180,
      );

    return {
      success: true,
      message: "Verified provider locations fetched",
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || "Failed to fetch verified provider locations",
    };
  }
}
