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
  PawPrint,
  Shield,
  Award,
  CheckCircle,
  Star,
  Stethoscope,
  Syringe,
  Pill,
  Calendar,
  Phone,
  MapPin
} from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/20">

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
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
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
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-orange-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100 to-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">Trusted by 50,000+ pet owners</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Advanced Pet <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary">
                Health Care
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Professional veterinary-grade care at your fingertips. Track health, manage medications, schedule appointments, and ensure your pet's wellbeing with expert-backed tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/about"
                className="bg-white text-foreground px-8 py-4 rounded-full font-bold text-lg border-2 border-border hover:bg-muted transition-all hover:-translate-y-1 shadow-sm"
              >
                Learn More
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-border/50">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Vet Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 w-full max-w-[600px] mx-auto">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/cat.png"
                  alt="Healthy Pet with Vet Care"
                  width={600}
                  height={600}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-10 right-10 bg-white rounded-2xl p-4 shadow-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Vaccination Due</p>
                  <p className="text-xs text-muted-foreground">Next: Dec 15</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute bottom-20 left-10 bg-white rounded-2xl p-4 shadow-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Pill className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Medication Reminder</p>
                  <p className="text-xs text-muted-foreground">2:00 PM Today</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Comprehensive Pet Care Services</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for your pet's health and wellbeing, backed by veterinary expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Health Monitoring",
                icon: Activity,
                color: "bg-blue-100 text-blue-600",
                desc: "Track vital signs, weight, and health metrics with professional-grade tools.",
                features: ["Vital signs tracking", "Weight monitoring", "Health alerts"]
              },
              {
                title: "Medication Management",
                icon: Pill,
                color: "bg-green-100 text-green-600",
                desc: "Never miss a dose with smart reminders and dosage tracking.",
                features: ["Smart reminders", "Dosage tracking", "Refill alerts"]
              },
              {
                title: "Appointment Scheduling",
                icon: Calendar,
                color: "bg-purple-100 text-purple-600",
                desc: "Book vet visits, grooming, and wellness check-ups seamlessly.",
                features: ["Online booking", "Reminder notifications", "Clinic locator"]
              },
              {
                title: "Emergency Support",
                icon: Phone,
                color: "bg-red-100 text-red-600",
                desc: "24/7 access to emergency vets and poison control hotlines.",
                features: ["Emergency contacts", "Poison control", "Urgent care finder"]
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.desc}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Trusted by Pet Parents & Vets</h2>
            <p className="text-xl text-muted-foreground">
              See what our community says about keeping their pets healthy with PawCare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Veterinarian",
                image: "/images/vet1.jpg",
                quote: "PawCare has revolutionized how I communicate with pet owners. The health tracking features are incredibly accurate and help me provide better care.",
                rating: 5
              },
              {
                name: "Mike Chen",
                role: "Dog Owner",
                image: "/images/owner1.jpg",
                quote: "Since using PawCare, Max's health has improved dramatically. The medication reminders and vet appointment scheduling saved us so much stress.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Cat Mom",
                image: "/images/owner2.jpg",
                quote: "The emergency support feature was a lifesaver when Luna ate something she shouldn't have. Quick access to poison control information made all the difference.",
                rating: 5
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-border"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Why Choose PawCare?</h2>
            <p className="text-xl text-muted-foreground">
              Advanced features designed by veterinary professionals to ensure your pet's optimal health and wellbeing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Veterinary-Grade Accuracy",
                icon: Stethoscope,
                color: "bg-blue-100 text-blue-600",
                desc: "Medical-grade health monitoring with clinically validated algorithms."
              },
              {
                title: "24/7 Emergency Support",
                icon: Phone,
                color: "bg-red-100 text-red-600",
                desc: "Round-the-clock access to emergency veterinary services and hotlines."
              },
              {
                title: "Smart Medication Tracking",
                icon: Pill,
                color: "bg-green-100 text-green-600",
                desc: "Intelligent reminders and dosage tracking to ensure treatment compliance."
              },
              {
                title: "Integrated Health Records",
                icon: Activity,
                color: "bg-purple-100 text-purple-600",
                desc: "Complete digital health records accessible anywhere, anytime."
              },
              {
                title: "Expert Care Network",
                icon: Users,
                color: "bg-orange-100 text-orange-600",
                desc: "Connect with certified veterinarians and pet care specialists."
              },
              {
                title: "Preventive Care Reminders",
                icon: Clock,
                color: "bg-yellow-100 text-yellow-600",
                desc: "Never miss vaccinations, check-ups, or preventive treatments."
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 px-4 overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden border border-white/20"
        >
          {/* Background Patterns */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="text-white w-8 h-8" />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">Start Your Pet's Health Journey Today</h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Join thousands of pet owners who trust PawCare for professional-grade pet health management. Free 14-day trial, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
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
                Sign In
              </Link>
            </div>
            <div className="pt-8 text-center">
              <p className="text-white/80 text-sm">✓ No setup fees ✓ Cancel anytime ✓ 24/7 support</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50,000+", label: "Pet Parents" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support Available" },
              { number: "500+", label: "Partner Clinics" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="text-xs">FB</span>
              </div>
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="text-xs">TW</span>
              </div>
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="text-xs">IG</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="#" className="hover:text-primary transition-colors">Health Monitoring</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Medication Tracking</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Vet Appointments</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Emergency Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pet Health Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Veterinary Directory</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community Forum</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
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
