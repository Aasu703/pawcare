"use client";

import { useState, useEffect } from "react";
import { getAllServices } from "@/lib/api/public/service";
import { Search, Clock, DollarSign, Tag, ChevronRight, Star, Activity, Sparkles, Map, List, SortAsc } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar, { SearchFilters } from "@/components/SearchBar";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    serviceType: "all",
    dateFrom: "",
    dateTo: "",
    petType: "all",
    priceRange: "all",
  });
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "rating">("newest");

  async function loadServices() {
    setLoading(true);
    const res = await getAllServices();
    if (res.success && res.data) {
      setServices(res.data);
      setFiltered(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    let result = services;
    if (filters.location) {
      result = result.filter(
        (s) =>
          s.provider?.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
          s.provider?.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
          s.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
          // For now, skip location filtering if provider info not available
          false
      );
    }
    if (filters.serviceType !== "all") {
      result = result.filter((s) => (s.category || s.catergory) === filters.serviceType);
    }
    if (filters.petType !== "all") {
      // Assuming petType is not in service, skip for now
    }
    if (filters.priceRange !== "all") {
      const [minStr, maxStr] = filters.priceRange.split("-");
      const min = parseInt(minStr);
      const max = maxStr === "+" ? Infinity : parseInt(maxStr);
      result = result.filter((s) => s.price >= min && (max === Infinity || s.price <= max));
    }

    // Sorting
    result = result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    setFiltered(result);
  }, [filters, services, sortBy]);

  const categoryColors: Record<string, string> = {
    grooming: "bg-purple-100 text-purple-700",
    boarding: "bg-blue-100 text-blue-700",
    vet: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50/30 p-6 md:p-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Browse <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">Services</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and book the best care for your pets. From grooming to vet visits, we have it all.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <SearchBar onSearch={setFilters} />
        </motion.div>

        {/* View Toggle and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-1 shadow-lg shadow-gray-200/50 border border-white/50">
            <button
              onClick={() => setViewMode("list")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                viewMode === "map"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Map className="w-4 h-4" />
              Map View
            </button>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/70 backdrop-blur-xl rounded-xl px-4 py-2 text-sm font-medium text-gray-700 border border-white/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-gray-500 font-medium">Loading services...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : viewMode === "map" ? (
          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/60 p-6 shadow-xl shadow-gray-200/40 min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Map View</h3>
              <p className="text-gray-500">Interactive map coming soon! For now, use list view to browse services.</p>
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filtered.map((service) => {
                const category = service.category || service.catergory;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={service._id}
                    className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/60 p-6 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-3 rounded-2xl ${category && categoryColors[category] ? categoryColors[category] : "bg-gray-100 text-gray-600"} bg-opacity-20`}>
                        {category === 'vet' ? <Activity className="w-6 h-6" /> :
                          category === 'grooming' ? <Sparkles className="w-6 h-6" /> :
                            <Tag className="w-6 h-6" />}
                      </div>
                      {category && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${category && categoryColors[category] ? categoryColors[category] : "bg-gray-100 text-gray-600"}`}>
                          {category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{service.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (service.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {service.rating ? `${service.rating.toFixed(1)} (${service.reviewCount || 0} reviews)` : "No reviews yet"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                      {service.description || "No description available for this service."}
                    </p>

                    <div className="space-y-4 mt-auto">
                      <div className="flex items-center justify-between text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{service.duration_minutes} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-gray-900 text-base">${service.price}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/user/services/${service._id}`}
                          className="flex-1"
                        >
                          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2">
                            View Details
                          </button>
                        </Link>
                        <Link
                          href={`/user/bookings/new?serviceId=${service._id}`}
                          className="flex-1"
                        >
                          <button className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-xl font-semibold hover:from-primary hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 group-hover:gap-3">
                            Book Now
                            <ChevronRight className="w-4 h-4 transition-all" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

