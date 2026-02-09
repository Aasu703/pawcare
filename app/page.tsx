"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  GraduationCap,
  Utensils,
  Users,
  Clock,
  ArrowRight,
  Heart,
  Bone,
  PawPrint
} from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/20">

      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/images/pawcare.png" alt="PawCare Logo" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">PawCare</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 active:scale-95 flex items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ================= HERO ================= */}
      <section className="relative pt-12 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 -z-10 w-[500px] h-[500px] bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-32 left-0 -z-10 w-[600px] h-[600px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-semibold border border-secondary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              #1 Trusted Pet Care App
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Make Your Pet <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-orange-600">
                Happy & Healthy
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Join thousands of pet owners who trust PawCare for training, health tracking, and expert guidance. Keeping tails wagging has never been easier.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
              >
                Start for Free
              </Link>
              <Link
                href="/about"
                className="bg-white text-foreground px-8 py-4 rounded-full font-bold text-lg border border-border hover:bg-muted transition-all hover:-translate-y-1"
              >
                Learn More
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Users size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
              <p>Loved by 10,000+ pet parents</p>
            </div>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 w-full max-w-[500px] mx-auto">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/cat.png"
                  alt="Happy Cat"
                  width={500}
                  height={500}
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  priority
                />
              </motion.div>
            </div>

            {/* Decorative Elements around image */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 z-0 bg-yellow-100 p-4 rounded-3xl text-yellow-500"
            >
              <Bone size={40} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-10 left-10 z-20 bg-blue-100 p-4 rounded-full text-blue-500"
            >
              <Activity size={40} />
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 bg-muted/50 rounded-[3rem] mx-4 my-8 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Everything your pet needs</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools designed by vets and behaviorists to ensure your furry friend lives their best life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Health Tracking", icon: Activity, color: "bg-red-100 text-red-600", desc: "Monitor vaccinations, weight, and vet visits." },
              { title: "Behavior Analysis", icon: Brain, color: "bg-purple-100 text-purple-600", desc: "Understand your pet's mood and habits." },
              { title: "Training Modules", icon: GraduationCap, color: "bg-blue-100 text-blue-600", desc: "Step-by-step guides for new tricks." },
              { title: "Nutrition Plans", icon: Utensils, color: "bg-green-100 text-green-600", desc: "Customized diet for optimal health." },
              { title: "Community", icon: Users, color: "bg-orange-100 text-orange-600", desc: "Connect with other pet lovers." },
              { title: "Smart Reminders", icon: Clock, color: "bg-yellow-100 text-yellow-600", desc: "Never miss a meal or appointment." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden"
        >
          {/* Background Patterns */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="flex justify-center mb-4">
              <Heart className="text-white w-12 h-12 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Ready to be the best pet parent?</h2>
            <p className="text-xl md:text-2xl opacity-90">
              Join PawCare today and get a 30-day free trial of our premium features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Get Started Now <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-background border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-muted-foreground">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-xl">
              <Image src="/images/pawcare.png" alt="PawCare" width={32} height={32} className="rounded-full" />
              PawCare
            </div>
            <p>Making pets happier, one paw at a time.</p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Download</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-border text-center text-sm">
          © 2025 PawCare. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
