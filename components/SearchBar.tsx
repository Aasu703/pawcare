"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, PawPrint, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  serviceType: string;
  dateFrom: string;
  dateTo: string;
  petType: string;
  priceRange: string;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    serviceType: "all",
    dateFrom: "",
    dateTo: "",
    petType: "all",
    priceRange: "all",
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const serviceTypeChips = [
    { label: "All", value: "all" },
    { label: "Vet", value: "vet" },
    { label: "Grooming", value: "grooming" },
    { label: "Boarding", value: "boarding" },
  ];

  return (
    <div className="rounded-3xl border border-[#f2e7d1] bg-gradient-to-b from-[#fffef8] via-[#fff9ef] to-white p-5 shadow-[0_20px_60px_rgba(245,158,11,0.12)] md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#7a4d0b]">
          <Sparkles className="h-4 w-4 text-[#f59e0b]" />
          Curated for pet parents
        </div>
        <div className="flex flex-wrap gap-2">
          {serviceTypeChips.map((chip) => {
            const active = filters.serviceType === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => updateFilter("serviceType", chip.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all ${
                  active
                    ? "bg-[#f59e0b] text-white shadow-[0_8px_20px_rgba(245,158,11,0.35)]"
                    : "bg-white text-gray-600 hover:bg-[#fff5e4]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6 xl:items-end">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-500 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#f59e0b]" />
            Location
          </label>
          <Input
            placeholder="City or zip code"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full h-11 rounded-xl border-[#e8d8bc] bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-500 flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-[#f59e0b]" />
            Service Type
          </label>
          <Select value={filters.serviceType} onValueChange={(value) => updateFilter("serviceType", value)}>
            <SelectTrigger className="h-11 rounded-xl border-[#e8d8bc] bg-white">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="grooming">Grooming</SelectItem>
              <SelectItem value="boarding">Boarding</SelectItem>
              <SelectItem value="vet">Veterinary</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#f59e0b]" />
            Check-in
          </label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="w-full h-11 rounded-xl border-[#e8d8bc] bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#f59e0b]" />
            Check-out
          </label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="w-full h-11 rounded-xl border-[#e8d8bc] bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-500 flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-[#f59e0b]" />
            Pet Type
          </label>
          <Select value={filters.petType} onValueChange={(value) => updateFilter("petType", value)}>
            <SelectTrigger className="h-11 rounded-xl border-[#e8d8bc] bg-white">
              <SelectValue placeholder="Select pet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pets</SelectItem>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="bird">Bird</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ef7f1a] font-semibold shadow-[0_12px_24px_rgba(239,127,26,0.35)] hover:from-[#ef7f1a] hover:to-[#dd6b13]"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="mt-5 border-t border-[#f2e7d1] pt-4">
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
            <Filter className="w-4 h-4 text-[#f59e0b]" />
            Advanced Filters
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Price Range</label>
              <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
                <SelectTrigger className="h-11 rounded-xl border-[#e8d8bc] bg-white">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-50">$0 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200+">$200+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
