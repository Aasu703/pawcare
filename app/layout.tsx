import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "PawCare",
  description: "Your trusted pet health companion",
  icons: {
    icon: "/images/pawcare.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
