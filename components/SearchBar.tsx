"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, PawPrint, Filter } from "lucide-react";
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <Input
            placeholder="Enter city or zip code"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Service Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <PawPrint className="w-4 h-4" />
            Service Type
          </label>
          <Select value={filters.serviceType} onValueChange={(value) => updateFilter("serviceType", value)}>
            <SelectTrigger>
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

        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Check-in
          </label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Check-out
          </label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Pet Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <PawPrint className="w-4 h-4" />
            Pet Type
          </label>
          <Select value={filters.petType} onValueChange={(value) => updateFilter("petType", value)}>
            <SelectTrigger>
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

        {/* Search Button */}
        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="mt-4 pt-4 border-t">
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
                <SelectTrigger>
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