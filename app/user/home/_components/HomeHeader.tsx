"use client";

import { useAuth } from "@/context/AuthContext";
import { getApiBaseUrl, pickImagePath, resolveMediaUrl } from "@/lib/utils/media-url";
import { User, LogOut } from "lucide-react";
import Image from "next/image";
import AppNotificationBell from "@/components/AppNotificationBell";
import { motion } from "framer-motion";

interface HomeHeaderProps {
  openNotificationsRef: React.MutableRefObject<(() => void) | null>;
  onLogout: () => void;
  onProfileClick: () => void;
}

export function HomeHeader({ openNotificationsRef, onLogout, onProfileClick }: HomeHeaderProps) {
  const { user } = useAuth();
  const baseUrl = getApiBaseUrl();
  const profileImageSrc = resolveMediaUrl(pickImagePath(user), baseUrl, "image");

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="relative z-50 border-b border-white/20 backdrop-blur-xl bg-white/70 sticky top-0"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white">
            <Image src="/images/pawcare.png" alt="PawCare" width={40} height={40} className="object-cover" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">PawCare</span>
        </div>

        <div className="flex items-center gap-4">
          <AppNotificationBell
            audience="user"
            registerOpenHandler={(handler: (() => void) | null) => {
              openNotificationsRef.current = handler;
            }}
            buttonClassName="h-10 w-10 bg-transparent text-gray-700 hover:bg-white/70"
            iconClassName="w-5 h-5"
          />
          <button
            onClick={onProfileClick}
            className="px-3 py-1.5 rounded-full bg-white/50 hover:bg-white border border-white/20 transition-all duration-300 flex items-center gap-2 group"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {profileImageSrc ? (
                <img
                  src={profileImageSrc}
                  alt={user?.Firstname || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.Firstname?.charAt(0) || <User className="w-4 h-4" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 hidden sm:block">
              {user?.Firstname || "Profile"}
            </span>
          </button>
          <button
            onClick={onLogout}
            className="p-2.5 rounded-full hover:bg-red-50 text-gray-700 hover:text-red-500 transition duration-300"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
