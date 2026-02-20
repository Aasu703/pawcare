"use client";

export type NotificationType = "booking" | "appointment" | "order" | "general";
export type NotificationAudience = "user" | "provider" | "all";
export type NotificationProviderType = "vet" | "shop" | "babysitter";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: NotificationType;
  audience: NotificationAudience;
  providerType?: NotificationProviderType;
  read: boolean;
  link?: string;
}

export interface NewNotificationInput {
  id?: string;
  title: string;
  message: string;
  type?: NotificationType;
  audience?: NotificationAudience;
  providerType?: NotificationProviderType;
  link?: string;
  dedupeKey?: string;
  createdAt?: string;
  pushToBrowser?: boolean;
}

type BookingLike = {
  _id?: string;
  id?: string;
  status?: string;
  startTime?: string;
  service?: { title?: string };
  pet?: { name?: string };
};

const STORAGE_KEY = "pawcare.notifications.v1";
const DEDUPE_STORAGE_KEY = "pawcare.notifications.dedupe.v1";
const UPDATE_EVENT = "pawcare:notifications-updated";
const MAX_NOTIFICATIONS = 120;
const MAX_DEDUPE_KEYS = 500;
const UPCOMING_LEVELS_MINUTES = [30, 120, 1440];

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function emitUpdateEvent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function readNotifications(): AppNotification[] {
  if (!canUseBrowserStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function writeNotifications(list: AppNotification[]) {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_NOTIFICATIONS)));
  emitUpdateEvent();
}

function readDedupeMap(): Record<string, string> {
  if (!canUseBrowserStorage()) return {};
  try {
    const raw = window.localStorage.getItem(DEDUPE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeDedupeMap(map: Record<string, string>) {
  if (!canUseBrowserStorage()) return;
  const entries = Object.entries(map)
    .sort((a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime())
    .slice(0, MAX_DEDUPE_KEYS);
  window.localStorage.setItem(DEDUPE_STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
}

function canNotifyAudience(notification: AppNotification, audience?: NotificationAudience) {
  if (!audience || audience === "all") return true;
  return notification.audience === "all" || notification.audience === audience;
}

function canNotifyProviderType(
  notification: AppNotification,
  providerType?: NotificationProviderType,
) {
  if (!providerType) return true;
  if (notification.audience !== "provider") return true;
  if (!notification.providerType) return true;
  return notification.providerType === providerType;
}

function notifyBrowser(title: string, message: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    const notification = new Notification(title, {
      body: message,
      icon: "/images/pawcare.png",
    });
    window.setTimeout(() => notification.close(), 6000);
  } catch {
    // Ignore browser notification errors silently.
  }
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function subscribeToNotificationUpdates(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onUpdate = () => listener();
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === DEDUPE_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener(UPDATE_EVENT, onUpdate);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(UPDATE_EVENT, onUpdate);
    window.removeEventListener("storage", onStorage);
  };
}

export function getAppNotifications(
  audience?: NotificationAudience,
  providerType?: NotificationProviderType,
): AppNotification[] {
  return readNotifications()
    .filter(
      (item) =>
        canNotifyAudience(item, audience) &&
        canNotifyProviderType(item, providerType),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadNotificationCount(
  audience?: NotificationAudience,
  providerType?: NotificationProviderType,
): number {
  return getAppNotifications(audience, providerType).filter((item) => !item.read).length;
}

export function addAppNotification(input: NewNotificationInput): AppNotification | null {
  if (!canUseBrowserStorage()) return null;

  const trimmedDedupeKey = input.dedupeKey?.trim();
  if (trimmedDedupeKey) {
    const dedupeMap = readDedupeMap();
    if (dedupeMap[trimmedDedupeKey]) {
      return null;
    }
    dedupeMap[trimmedDedupeKey] = new Date().toISOString();
    writeDedupeMap(dedupeMap);
  }

  const next: AppNotification = {
    id: input.id || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    title: input.title,
    message: input.message,
    createdAt: input.createdAt || new Date().toISOString(),
    type: input.type || "general",
    audience: input.audience || "all",
    providerType: input.providerType,
    read: false,
    link: input.link,
  };

  const current = readNotifications();
  writeNotifications([next, ...current]);

  if (input.pushToBrowser) {
    notifyBrowser(next.title, next.message);
  }

  return next;
}

export function markNotificationAsRead(id: string) {
  if (!id) return;
  const next = readNotifications().map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  );
  writeNotifications(next);
}

export function markAllNotificationsAsRead(
  audience?: NotificationAudience,
  providerType?: NotificationProviderType,
) {
  const next = readNotifications().map((notification) => {
    if (
      canNotifyAudience(notification, audience) &&
      canNotifyProviderType(notification, providerType)
    ) {
      return { ...notification, read: true };
    }
    return notification;
  });
  writeNotifications(next);
}

export function clearNotifications(
  audience?: NotificationAudience,
  providerType?: NotificationProviderType,
) {
  if (!canUseBrowserStorage()) return;
  if (!audience || audience === "all") {
    window.localStorage.removeItem(STORAGE_KEY);
    emitUpdateEvent();
    return;
  }
  const next = readNotifications().filter(
    (notification) =>
      !(
        canNotifyAudience(notification, audience) &&
        canNotifyProviderType(notification, providerType)
      ),
  );
  writeNotifications(next);
}

function formatAppointmentTime(date: Date) {
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function createUpcomingAppointmentNotifications(
  bookings: BookingLike[],
  options: {
    audience: "user" | "provider";
    providerType?: NotificationProviderType;
    statuses?: string[];
    serviceLabel?: string;
    link?: string;
  },
): number {
  const now = Date.now();
  const allowedStatuses = options.statuses || ["confirmed"];
  let created = 0;

  for (const booking of bookings || []) {
    if (!booking?.startTime || !allowedStatuses.includes((booking.status || "").toLowerCase())) {
      continue;
    }

    const start = new Date(booking.startTime);
    if (Number.isNaN(start.getTime())) continue;

    const diffMinutes = (start.getTime() - now) / 60000;
    if (diffMinutes <= 0 || diffMinutes > Math.max(...UPCOMING_LEVELS_MINUTES)) {
      continue;
    }

    let level: number | null = null;
    if (diffMinutes <= 30) level = 30;
    else if (diffMinutes <= 120) level = 120;
    else if (diffMinutes <= 1440) level = 1440;

    if (!level) continue;

    const bookingId = booking._id || booking.id || booking.startTime;
    const fallbackService =
      options.serviceLabel ||
      (options.providerType === "babysitter"
        ? "Grooming appointment"
        : options.providerType === "shop"
          ? "Order pickup"
          : "Appointment");
    const serviceTitle = booking.service?.title || fallbackService;
    const petName = booking.pet?.name ? ` for ${booking.pet.name}` : "";
    const label = level === 1440 ? "in less than 24 hours" : level === 120 ? "in about 2 hours" : "in 30 minutes";

    const notification = addAppNotification({
      audience: options.audience,
      providerType: options.providerType,
      type: "appointment",
      title: "Upcoming appointment",
      message: `${serviceTitle}${petName} starts ${label} (${formatAppointmentTime(start)}).`,
      link: options.link || (options.audience === "provider" ? "/provider/vet-appointments" : "/user/bookings"),
      dedupeKey: `appointment-reminder:${options.audience}:${bookingId}:${level}`,
      pushToBrowser: true,
    });

    if (notification) {
      created += 1;
    }
  }

  return created;
}
