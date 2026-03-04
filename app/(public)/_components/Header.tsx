"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/login", label: "Login" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            <Image
              src="/images/pawcare.png"
              alt="PawCare Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            PawCare
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 active:scale-95 flex items-center gap-2 font-semibold"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-[10px] hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border/40 bg-background px-6 pb-4"
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}

