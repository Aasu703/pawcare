"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Page() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#0f4f57] text-white overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#0c4148]/95 backdrop-blur sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/images/pawcare.png" alt="PawCare" width={40} height={40} />
            <span className="text-xl font-bold">PawCare</span>
          </div>
          <div className="flex gap-6 text-sm font-semibold">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/login">Login</Link>
            <Link
              href="/register"
              className="bg-[#f8d548] text-[#0c4148] px-4 py-2 rounded-full"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-12 items-center">

          {/* TEXT */}
          <motion.div
  initial={{ x: -60, opacity: 0 }}
  animate={{ x: 0, opacity: 1, y: [0, -10, 0] }}
  transition={{
    x: { duration: 0.8 },
    opacity: { duration: 0.8 },
    y: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}
  className="space-y-7"
>
  <p className="uppercase tracking-widest text-[#f8d548] text-sm font-semibold">
    Welcome to PawCare
  </p>

  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
    Make Your Pet{" "}
    <span className="text-[#f8d548]">Friendly</span>
  </h1>

  <p className="text-xl text-gray-100/90 max-w-xl">
    Training, health tracking, and expert guidance — all in one place.
  </p>

  <div className="flex gap-4">
    <Link
      href="/register"
      className="bg-[#f8d548] text-[#0c4148] px-8 py-4 rounded-full font-semibold"
    >
      Get Started →
    </Link>

    <Link
      href="/about"
      className="border border-white/40 px-8 py-4 rounded-full"
    >
      Learn More
    </Link>
  </div>
</motion.div>

          {/* IMAGE */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center"
          >
            <Image
              src="/images/cat.png"
              alt="Cat"
              width={420}
              height={420}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-white text-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">Care, Training & Insights</h2>
            <p className="text-gray-600 mt-3">
              Everything your pet needs, organized and simple.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Observation", icon: "👀" },
              { title: "Behaviour Analysis", icon: "🐾" },
              { title: "Introduction", icon: "🐱" },
              { title: "Training Modules", icon: "🎯" },
              { title: "Implementation", icon: "📅" },
              { title: "Evaluation", icon: "📊" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border shadow-sm hover:shadow-md bg-white"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#0f4f57]">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#0f4f57] py-20 text-center"
      >
        <h3 className="text-4xl font-bold mb-4">
          Ready to make your pet happier?
        </h3>
        <p className="text-gray-100/80 mb-8">
          Start tracking, training, and caring — the smart way.
        </p>
        <Link
          href="/register"
          className="bg-[#f8d548] text-[#0c4148] px-10 py-4 rounded-full font-semibold"
        >
          Start Free Trial
        </Link>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0c4148] py-10 text-center text-sm text-gray-200/70">
        © 2025 PawCare. All rights reserved.
      </footer>
    </main>
  );
}
