"use client";

import { useState } from "react";
import { AnnouncementBar } from "./_components/AnnouncementBar";
import { HeroSection } from "./_components/HeroSection";
import { SearchBar, type ServiceSearchFilters } from "./_components/SearchBar";
import { ServiceGrid } from "./_components/ServiceGrid";

export default function ServicesPage() {
  const [filters, setFilters] = useState<ServiceSearchFilters>({
    location: "",
    serviceType: "all",
    petType: "all",
    dateFrom: "",
    dateTo: "",
  });

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <AnnouncementBar />
      <HeroSection />
      <SearchBar onSearch={setFilters} />
      <ServiceGrid filters={filters} />
    </main>
  );
}
