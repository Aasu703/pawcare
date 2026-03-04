type UploadKind = "image" | "documents";

const hasProtocol = (value: string) => /^(https?|data):\/?\//i.test(value);
const IMAGE_KEYS = [
  "imageUrl",
  "avatarUrl",
  "image",
  "avatar",
  "profileImage",
  "profileImageUrl",
  "participantImage",
] as const;

const normalizeUploadPath = (rawPath: string, kind: UploadKind): string => {
  const trimmed = rawPath.trim();
  if (!trimmed) return "";
  if (hasProtocol(trimmed)) return trimmed;
  if (!trimmed.startsWith("/uploads/")) return trimmed;

  if (
    trimmed.startsWith("/uploads/image/") ||
    trimmed.startsWith("/uploads/documents/") ||
    trimmed.startsWith("/uploads/dummy/")
  ) {
    return trimmed;
  }

  const segments = trimmed.split("/").filter(Boolean);
  if (segments.length === 2 && segments[0] === "uploads") {
    return `/uploads/${kind}/${segments[1]}`;
  }

  return trimmed;
};

export const getApiBaseUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  return raw.replace(/\/+$/, "");
};

export const pickImagePath = (input: unknown): string => {
  if (typeof input === "string") {
    return input.trim();
  }

  if (!input || typeof input !== "object") {
    return "";
  }

  const value = input as Record<string, unknown>;
  for (const key of IMAGE_KEYS) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return "";
};

export const resolveMediaUrl = (
  rawPath: string | undefined | null,
  baseUrl: string,
  kind: UploadKind = "image",
): string => {
  if (!rawPath) return "";

  const normalized = normalizeUploadPath(rawPath, kind);
  if (!normalized) return "";
  if (hasProtocol(normalized)) return normalized;

  const base = baseUrl.replace(/\/+$/, "");
  const path = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return `${base}${path}`;
};
