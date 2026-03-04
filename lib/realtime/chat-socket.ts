import { io, Socket } from "socket.io-client";
import { getApiBaseUrl } from "@/lib/utils/media-url";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift() || null;
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

export function getClientAuthToken(): string | null {
  const cookieToken = getCookie("auth_token");
  if (cookieToken && cookieToken !== "undefined") return cookieToken;

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("auth_token");
    if (stored && stored !== "undefined") return stored;
  }

  return null;
}

function resolveSocketBaseUrl(): string {
  return getApiBaseUrl();
}

export function createChatSocket(token: string): Socket {
  return io(resolveSocketBaseUrl(), {
    path: "/socket.io",
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 30,
    reconnectionDelay: 1000,
    auth: { token },
  });
}
