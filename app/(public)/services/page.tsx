"use client";

import { useState, useEffect } from "react";
import { getAllServices } from "@/lib/api/public/service";
import { Search, Clock, DollarSign, Stethoscope, Scissors, Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

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

  const getCategoryIcon = (data: any) => {
    switch (category) {
      case "grooming": return Scissors;
      case "boarding": return Home;
      case "vet": return Stethoscope;
      default: return Stethoscope;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: any, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">PawCare</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/services" className="text-primary">Services</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 active:scale-95 flex items-center gap-2 font-semibold"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ================= HERO ================= */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-primary/5">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-gradient-to-tr from-white to-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: any, y: 30 }}
            animate={{ opacity: any, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              <Stethoscope className="w-4 h-4" />
              Professional Services
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              Expert Pet Care <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary">
                Services
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with certified veterinary professionals and trusted service providers. From routine check-ups to specialized care, find everything your pet needs in one place.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      <section className="py-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { key: "", label: "All Services", icon: Stethoscope },
              { key: "vet", label: "Veterinary Care", icon: Stethoscope },
              { key: "grooming", label: "Grooming", icon: Scissors },
              { key: "boarding", label: "Boarding", icon: Home },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.key}
                  initial={{ opacity: any, scale: 0.9 }}
                  animate={{ opacity: any, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(cat.key)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                    category === cat.key
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Stethoscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((service, i) => {
                const CategoryIcon = getCategoryIcon(service.catergory || "");
                return (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: any, y: 30 }}
                    animate={{ opacity: any, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CategoryIcon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
                            {service.catergory || "General"}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{service.description}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-foreground">${service.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration_minutes} min</span>
                        </div>
                      </div>

                      {typeof service.providerId === "object" && (
                        <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {(service.providerId as any).businessName || "Provider"}
                            </p>
                            <p className="text-xs text-muted-foreground">Certified Provider</p>
                          </div>
                        </div>
                      )}

                      <Link
                        href="/login"
                        className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30"
                      >
                        Book Service
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 bg-gradient-to-r from-primary via-blue-600 to-primary">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: any, y: 30 }}
            whileInView={{ opacity: any, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Stethoscope className="text-white w-8 h-8" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Book a Service?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of pet owners who trust PawCare for professional veterinary services and expert care providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/register"
                className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="bg-transparent text-white px-10 py-5 rounded-full font-bold text-lg border-2 border-white hover:bg-white/10 transition-all hover:-translate-y-1"
              >
                Sign In to Book
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white font-bold text-xl">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              PawCare
            </div>
            <p className="text-slate-300">Professional pet health management for the modern pet parent.</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="#" className="hover:text-primary transition-colors">Veterinary Care</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Grooming</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Boarding</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Emergency Care</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Service Directory</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Provider Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-700 text-center text-sm text-slate-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2025 PawCare. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs">
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>Vet Approved</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

