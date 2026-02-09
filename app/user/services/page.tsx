"use client";

import { useState, useEffect } from "react";
import { getAllServices } from "@/lib/api/public/service";
import { Service } from "@/lib/types/service";
import { Search, Clock, DollarSign, Tag } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    let result = services;
    if (search) {
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== "all") {
      result = result.filter((s) => s.catergory === category);
    }
    setFiltered(result);
  }, [search, category, services]);

  const loadServices = async () => {
    setLoading(true);
    const res = await getAllServices();
    if (res.success && res.data) {
      setServices(res.data);
      setFiltered(res.data);
    }
    setLoading(false);
  };

  const categoryColors: Record<string, string> = {
    grooming: "bg-purple-100 text-purple-700",
    boarding: "bg-blue-100 text-blue-700",
    vet: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Services</h1>
        <p className="text-gray-500 mt-1">Find and book the best care for your pets</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {["all", "grooming", "boarding", "vet"].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                category === c
                  ? "bg-[#0f4f57] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No services found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                {service.catergory && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[service.catergory] || "bg-gray-100 text-gray-600"}`}>
                    {service.catergory}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {service.description || "No description available"}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${service.price}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {service.duration_minutes} min
                </span>
              </div>

              <Link
                href={`/user/bookings/new?serviceId=${service._id}`}
                className="block w-full text-center bg-[#0f4f57] text-white py-2.5 rounded-lg font-medium hover:bg-[#0c4148] transition-colors"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
