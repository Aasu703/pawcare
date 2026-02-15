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
        animate={{ y: any, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
              <Image
                src="/images/pawcare.png"
                alt="PawCare Logo"
                width={32}
                height={32}
                className="object-contain"
              />
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
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 -z-10 bg-gradient-mesh"></div>
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: any, repeat: any, ease: "easeInOut" }}
          className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-orange-200/30 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: any, repeat: any, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/30 to-primary/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: any, repeat: any, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[400px] h-[400px] bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
        ></motion.div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: any, x: -50 }}
            animate={{ opacity: any, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">Trusted by 50,000+ pet owners</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Advanced Pet <br />
              <span className="gradient-text-vibrant inline-block">
                Health Care
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Professional veterinary-grade care at your fingertips. Track health, manage medications, schedule appointments, and ensure your pet's wellbeing with expert-backed tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="group relative bg-gradient-primary text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Start Free Trial</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/about"
                className="group bg-white text-foreground px-8 py-4 rounded-full font-bold text-lg border-2 border-border hover:border-primary transition-all hover:-translate-y-1 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
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
            initial={{ opacity: any, scale: 0.8 }}
            animate={{ opacity: any, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 w-full max-w-[600px] mx-auto">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: any, repeat: any, ease: "easeInOut" }}
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
              initial={{ opacity: any, y: 20 }}
              animate={{ opacity: any, y: 0 }}
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
              initial={{ opacity: any, y: 20 }}
              animate={{ opacity: any, y: 0 }}
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
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 -skew-x-12 transform origin-top translate-x-1/2 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 transform origin-bottom -translate-x-1/2 -z-10"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: any, y: 20 }}
              whileInView={{ opacity: any, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold mb-6"
            >
              Comprehensive <span className="gradient-text">Pet Care Services</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: any, y: 20 }}
              whileInView={{ opacity: any, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              Everything you need for your pet's health and wellbeing, backed by veterinary expertise.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Health Monitoring",
                icon: any,
                color: "text-blue-600",
                bg: "bg-blue-100/50",
                border: "border-blue-200",
                desc: "Track vital signs, weight, and health metrics with professional-grade tools.",
                features: ["Vital signs tracking", "Weight monitoring", "Health alerts"]
              },
              {
                title: "Medication Management",
                icon: any,
                color: "text-green-600",
                bg: "bg-green-100/50",
                border: "border-green-200",
                desc: "Never miss a dose with smart reminders and dosage tracking.",
                features: ["Smart reminders", "Dosage tracking", "Refill alerts"]
              },
              {
                title: "Appointment Scheduling",
                icon: any,
                color: "text-purple-600",
                bg: "bg-purple-100/50",
                border: "border-purple-200",
                desc: "Book vet visits, grooming, and wellness check-ups seamlessly.",
                features: ["Online booking", "Reminder notifications", "Clinic locator"]
              },
              {
                title: "Emergency Support",
                icon: any,
                color: "text-red-600",
                bg: "bg-red-100/50",
                border: "border-red-200",
                desc: "24/7 access to emergency vets and poison control hotlines.",
                features: ["Emergency contacts", "Poison control", "Urgent care finder"]
              },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: any, y: 30 }}
                whileInView={{ opacity: any, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`group p-8 rounded-3xl bg-white/60 backdrop-blur-sm border ${service.border} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${service.bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`}></div>

                <div className={`w-16 h-16 ${service.bg} ${service.color} rounded-2xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  <service.icon size={32} />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-foreground relative z-10">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                  {service.desc}
                </p>

                <ul className="space-y-3 relative z-10">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 bg-gradient-to-b from-white to-orange-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Trusted by <span className="text-primary">Pet Parents & Vets</span></h2>
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
                rating: any,
                color: "bg-blue-50 border-blue-100"
              },
              {
                name: "Mike Chen",
                role: "Dog Owner",
                image: "/images/owner1.jpg",
                quote: "Since using PawCare, Max's health has improved dramatically. The medication reminders and vet appointment scheduling saved us so much stress.",
                rating: any,
                color: "bg-orange-50 border-orange-100"
              },
              {
                name: "Emily Rodriguez",
                role: "Cat Mom",
                image: "/images/owner2.jpg",
                quote: "The emergency support feature was a lifesaver when Luna ate something she shouldn't have. Quick access to poison control information made all the difference.",
                rating: any,
                color: "bg-purple-50 border-purple-100"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: any, scale: 0.9 }}
                whileInView={{ opacity: any, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-3xl shadow-sm border ${testimonial.color} relative`}
              >
                <div className="absolute top-6 right-8 text-6xl font-serif opacity-10 text-primary">"</div>

                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ opacity: any, scale: 0 }}
                      whileInView={{ opacity: any, scale: 1 }}
                      transition={{ delay: 0.5 + (star * 0.1) }}
                    >
                      <Star className={`w-5 h-5 ${star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    </motion.div>
                  ))}
                </div>

                <blockquote className="text-foreground/80 mb-6 leading-relaxed relative z-10 font-medium">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-4 border-t border-black/5 pt-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                    {/* Placeholder for avatar if image fails */}
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(#fb8c00_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Why Choose <span className="gradient-text">PawCare?</span></h2>
            <p className="text-xl text-muted-foreground">
              Advanced features designed by veterinary professionals to ensure your pet's optimal health and wellbeing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Veterinary-Grade Accuracy",
                icon: any,
                color: "text-blue-600",
                bg: "bg-blue-50",
                desc: "Medical-grade health monitoring with clinically validated algorithms."
              },
              {
                title: "24/7 Emergency Support",
                icon: any,
                color: "text-red-600",
                bg: "bg-red-50",
                desc: "Round-the-clock access to emergency veterinary services and hotlines."
              },
              {
                title: "Smart Medication Tracking",
                icon: any,
                color: "text-green-600",
                bg: "bg-green-50",
                desc: "Intelligent reminders and dosage tracking to ensure treatment compliance."
              },
              {
                title: "Integrated Health Records",
                icon: any,
                color: "text-purple-600",
                bg: "bg-purple-50",
                desc: "Complete digital health records accessible anywhere, anytime."
              },
              {
                title: "Expert Care Network",
                icon: any,
                color: "text-orange-600",
                bg: "bg-orange-50",
                desc: "Connect with certified veterinarians and pet care specialists."
              },
              {
                title: "Preventive Care Reminders",
                icon: any,
                color: "text-yellow-600",
                bg: "bg-yellow-50",
                desc: "Never miss vaccinations, check-ups, or preventive treatments."
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: any, scale: 0.9 }}
                whileInView={{ opacity: any, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 px-4 overflow-hidden bg-gradient-vibrant relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: any, repeat: any, repeatType: "reverse" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-30"
          style={{ backgroundSize: '200% 200%' }}
        />

        <motion.div
          initial={{ opacity: any, scale: 0.95 }}
          whileInView={{ opacity: any, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto glass-strong rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden border border-white/20 shadow-2xl"
        >
          {/* Background Patterns */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: any, repeat: Infinity }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30"
              >
                <Heart className="text-white w-10 h-10 fill-white/50" />
              </motion.div>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-md">Start Your Pet's <br />Health Journey Today</h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of pet owners who trust PawCare for professional-grade pet health management. Free 14-day trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link
                href="/register"
                className="bg-white text-primary px-12 py-5 rounded-full font-bold text-xl hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={24} />
              </Link>
              <Link
                href="/login"
                className="bg-transparent text-white px-12 py-5 rounded-full font-bold text-xl border-2 border-white hover:bg-white/10 transition-all hover:-translate-y-1 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
            <div className="pt-8 text-center flex flex-wrap justify-center gap-6 opacity-80">
              <span className="flex items-center gap-2"><CheckCircle size={16} /> No setup fees</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} /> Cancel anytime</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} /> 24/7 support</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-20 bg-white relative z-10 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            {[
              { number: "50k+", label: "Pet Parents" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support Available" },
              { number: "500+", label: "Partner Clinics" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: any, y: 20 }}
                whileInView={{ opacity: any, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4 px-4"
              >
                <div className="text-4xl md:text-5xl font-black gradient-text tracking-tight">{stat.number}</div>
                <div className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-white font-bold text-2xl">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 p-2">
                  <Image
                    src="/images/pawcare.png"
                    alt="PawCare Logo"
                    width={32}
                    height={32}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                PawCare
              </div>
              <p className="text-slate-400 leading-relaxed">
                Professional pet health management for the modern pet parent. Join our community of animal lovers.
              </p>
              <div className="flex gap-4">
                {['FB', 'TW', 'IG', 'LI'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:border-primary transition-all cursor-pointer hover:-translate-y-1">
                    <span className="text-xs font-bold">{social}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Services</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Health Monitoring</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Medication Tracking</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Vet Appointments</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Emergency Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Resources</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Pet Health Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Veterinary Directory</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Community Forum</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 text-center text-sm text-slate-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p>© 2025 PawCare. All rights reserved.</p>
              <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-wider">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> HIPAA Compliant</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Vet Approved</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

