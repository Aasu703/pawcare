"use client";

import { useState, useEffect } from "react";
import { getAllServices } from "@/lib/api/public/service";
import { Service } from "@/lib/types/service";
import { Search, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function PublicServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getAllServices();
      if (res.success && res.data) setServices(res.data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || s.catergory === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#0f4f57] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-white/80 mb-8">Professional pet care services for your furry friends</p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f8d548]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Category Filter */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {["", "grooming", "boarding", "vet"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-[#0f4f57] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#0f4f57]"
              }`}
            >
              {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "All"}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500">No services found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div key={service._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#0f4f57]/10 text-[#0f4f57] capitalize">
                      {service.catergory || "General"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">${service.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration_minutes} min</span>
                    </div>
                  </div>
                  {typeof service.providerId === "object" && (
                    <p className="text-xs text-gray-400 mb-4">
                      by {(service.providerId as any).businessName || "Provider"}
                    </p>
                  )}
                  <Link
                    href="/login"
                    className="block w-full text-center py-2.5 rounded-lg bg-[#f8d548] text-[#0f4f57] font-semibold hover:bg-[#f0cc30] transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
