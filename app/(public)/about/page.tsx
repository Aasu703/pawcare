"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import {
  Stethoscope,
  Heart,
  Shield,
  Award,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  Eye,
  HandHeart,
  Microscope,
  GraduationCap,
  Phone
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">

      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
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
            <Link href="/about" className="text-primary">About</Link>
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
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
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6"
            >
              <Heart className="w-4 h-4" />
              About PawCare
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
            >
              Revolutionizing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary">
                Pet Health Care
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              We're a team of veterinary professionals, software engineers, and pet lovers dedicated to making pet healthcare accessible, accurate, and compassionate. Founded in 2020, PawCare has helped over 50,000 pets live healthier, happier lives.
            </motion.p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-border"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower pet parents and veterinary professionals with cutting-edge technology that ensures every pet receives the highest standard of preventive and therapeutic care.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-border"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where every pet parent has access to veterinary-grade health monitoring tools, and every veterinarian can provide more personalized, data-driven care.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Meet Our Expert Team</h2>
            <p className="text-xl text-muted-foreground">
              Our diverse team combines veterinary expertise, software engineering, and pet care passion to build the future of pet health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Chief Veterinary Officer",
                credentials: "DVM, DACVIM",
                image: "/images/vet1.jpg",
                bio: "Board-certified veterinary internal medicine specialist with 15+ years experience in companion animal care."
              },
              {
                name: "Dr. Michael Chen",
                role: "Head of Product",
                credentials: "DVM, MBA",
                image: "/images/vet2.jpg",
                bio: "Veterinarian-turned-entrepreneur focused on leveraging technology to improve pet health outcomes."
              },
              {
                name: "Dr. Emily Rodriguez",
                role: "Clinical Research Lead",
                credentials: "DVM, PhD",
                image: "/images/vet3.jpg",
                bio: "Research veterinarian specializing in preventive care protocols and digital health monitoring."
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Stethoscope className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{member.name}</h3>
                  <p className="text-primary font-semibold mb-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.credentials}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Microscope,
                title: "Clinical Accuracy",
                desc: "Every feature is validated by veterinary professionals and backed by scientific evidence."
              },
              {
                icon: Heart,
                title: "Compassion First",
                desc: "We prioritize the wellbeing of pets and the peace of mind of their human families."
              },
              {
                icon: Users,
                title: "Collaborative Care",
                desc: "We bridge the gap between pet parents, veterinarians, and care providers."
              },
              {
                icon: Award,
                title: "Excellence",
                desc: "We continuously innovate and maintain the highest standards in pet health technology."
              },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ACHIEVEMENTS ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Our Impact</h2>
            <p className="text-xl text-muted-foreground">
              Real results from our commitment to improving pet health outcomes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50,000+", label: "Pets Monitored", desc: "Active health tracking" },
              { number: "98%", label: "User Satisfaction", desc: "Based on surveys" },
              { number: "500+", label: "Partner Clinics", desc: "Veterinary network" },
              { number: "24/7", label: "Support Available", desc: "Emergency access" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-card rounded-2xl border border-border"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="py-24 bg-gradient-to-r from-primary via-blue-600 to-primary">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto text-white"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <HandHeart className="text-white w-8 h-8" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Commitment to Pet Health</h2>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              We're not just building software—we're building a healthier future for pets everywhere. Every feature, every update, every decision is made with one goal: better health outcomes for the pets we all love.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                "HIPAA-compliant data security",
                "Veterinary-approved protocols",
                "Continuous clinical validation"
              ].map((commitment, i) => (
                <div key={commitment} className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                  <span className="font-medium">{commitment}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-primary rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden"
        >
          {/* Background Patterns */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Join Our Mission</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Be part of the revolution in pet healthcare. Start your free trial today and experience the difference professional-grade pet care technology can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link
                href="/register"
                className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-white px-10 py-5 rounded-full font-bold text-lg border-2 border-white hover:bg-white/10 transition-all hover:-translate-y-1"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
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
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Press</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pet Health Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Veterinary Directory</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Research</Link></li>
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

