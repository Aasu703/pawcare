"use client";

import { usePathname } from "next/navigation";
import ProviderSidebar from "./_components/ProviderSidebar";

const authPages = ["/provider/login", "/provider/register"];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}