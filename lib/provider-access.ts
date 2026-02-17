export type ProviderType = "vet" | "shop" | "babysitter" | null | undefined;

export const isVetProvider = (providerType: ProviderType) => providerType === "vet";
export const isShopProvider = (providerType: ProviderType) => providerType === "shop";
export const isGroomerProvider = (providerType: ProviderType) => providerType === "babysitter";

export const canManageServices = (providerType: ProviderType) =>
  isVetProvider(providerType) || isGroomerProvider(providerType);

export const canManageBookings = (providerType: ProviderType) =>
  canManageServices(providerType);

export const canManageInventory = (providerType: ProviderType) =>
  isShopProvider(providerType);

export const canAccessVetFeatures = (providerType: ProviderType) =>
  isVetProvider(providerType);

export const getProviderTypeLabel = (providerType: ProviderType) => {
  if (isVetProvider(providerType)) return "Vet";
  if (isShopProvider(providerType)) return "Shop Owner";
  if (isGroomerProvider(providerType)) return "Groomer";
  return "Provider";
};
