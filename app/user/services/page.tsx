"use client";

import { useState, useEffect } from "react";
import { getAllServices } from "@/lib/api/public/service";
import { Search, Clock, DollarSign, Tag, Calendar, ChevronRight, Star, Activity, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50/30 p-6 md:p-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <motion.div
          initial={{ opacity: any, y: -20 }}
          animate={{ opacity: any, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Browse <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">Services</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and book the best care for your pets. From grooming to vet visits, we have it all.
          </p>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: any, y: 20 }}
          animate={{ opacity: any, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-white/50 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {["all", "grooming", "boarding", "vet"].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all whitespace-nowrap ${category === c
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
              >
                {c === "all" ? "All Services" : c}
              </button>
            ))}
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
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filtered.map((service) => (
                <motion.div
                  layout
                  initial={{ opacity: any, scale: 0.9 }}
                  animate={{ opacity: any, scale: 1 }}
                  exit={{ opacity: any, scale: 0.9 }}
                  key={service._id}
                  className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/60 p-6 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${service.catergory && categoryColors[service.catergory] ? categoryColors[service.catergory] : "bg-gray-100 text-gray-600"} bg-opacity-20`}>
                      {/* Icon based on category - simplified mapping */}
                      {service.catergory === 'vet' ? <Activity className="w-6 h-6" /> :
                        service.catergory === 'grooming' ? <Sparkles className="w-6 h-6" /> :
                          <Tag className="w-6 h-6" />}
                    </div>
                    {service.catergory && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${service.catergory && categoryColors[service.catergory] ? categoryColors[service.catergory] : "bg-gray-100 text-gray-600"}`}>
                        {service.catergory}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{service.title}</h3>
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

                    <Link
                      href={`/user/bookings/new?serviceId=${service._id}`}
                      className="block w-full"
                    >
                      <button className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3.5 rounded-xl font-semibold hover:from-primary hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 group-hover:gap-3">
                        Book Now
                        <ChevronRight className="w-4 h-4 transition-all" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

