"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AppNotification,
  NotificationAudience,
  clearNotifications,
  getAppNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  requestBrowserNotificationPermission,
  subscribeToNotificationUpdates,
} from "@/lib/notifications/app-notifications";

type AppNotificationBellProps = {
  audience: Exclude<NotificationAudience, "all">;
  buttonClassName?: string;
  panelClassName?: string;
  iconClassName?: string;
};

function formatRelativeTime(iso: string) {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";

  const diffMs = Date.now() - time;
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(iso).toLocaleDateString();
}

export default function AppNotificationBell({
  audience,
  buttonClassName,
  panelClassName,
  iconClassName,
}: AppNotificationBellProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);

  useEffect(() => {
    const refresh = () => {
      setItems(getAppNotifications(audience));
      if (typeof window !== "undefined" && "Notification" in window) {
        setPermission(Notification.permission);
      } else {
        setPermission("unsupported");
      }
    };

    refresh();
    const unsubscribe = subscribeToNotificationUpdates(refresh);
    return unsubscribe;
  }, [audience]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("mousedown", onPointerDown);
    }

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const openNotification = (notification: AppNotification) => {
    markNotificationAsRead(notification.id);
    setOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const enableBrowserNotifications = async () => {
    const result = await requestBrowserNotificationPermission();
    if (result === "granted" || result === "denied") {
      setPermission(result);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-100 transition hover:bg-white/20",
          buttonClassName,
        )}
        aria-label="Open notifications"
      >
        <Bell className={cn("h-5 w-5", iconClassName)} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[#f8d548] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#0c4148]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 z-50 mt-2 w-[340px] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl",
            panelClassName,
          )}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              onClick={() => markAllNotificationsAsRead(audience)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#0f4f57] hover:bg-[#0f4f57]/10"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all
            </button>
          </div>

          {permission !== "unsupported" && permission !== "granted" && (
            <button
              type="button"
              onClick={enableBrowserNotifications}
              className="mb-2 w-full rounded-lg border border-[#0f4f57]/20 bg-[#0f4f57]/5 px-3 py-2 text-left text-xs font-medium text-[#0f4f57] hover:bg-[#0f4f57]/10"
            >
              Enable browser alerts for booking and appointment reminders
            </button>
          )}

          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              No notifications yet.
            </div>
          ) : (
            <ul className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openNotification(item)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left transition",
                      item.read
                        ? "border-gray-200 bg-white hover:bg-gray-50"
                        : "border-[#0f4f57]/25 bg-[#0f4f57]/5 hover:bg-[#0f4f57]/10",
                    )}
                  >
                    <p className="line-clamp-1 text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{item.message}</p>
                    <p className="mt-1 text-[11px] text-gray-400">{formatRelativeTime(item.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => clearNotifications(audience)}
              className="mt-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
