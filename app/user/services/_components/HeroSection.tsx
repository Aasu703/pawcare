import React from 'react'

import { PawPrint, Star, ShieldCheck, Heart, Clock } from 'lucide-react'
export function HeroSection() {
  return (
    <section className="relative w-full bg-[#faf7f2] pt-12 pb-20 px-4 md:px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--pc-primary)]/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1a3a2a]/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#e7e5e4] rounded-full shadow-sm">
            <PawPrint className="w-3.5 h-3.5 text-[var(--pc-primary)]" />
            <span className="text-xs font-bold tracking-wide text-[#1a3a2a] uppercase">
              Trusted Pet Care
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1c1917] leading-[1.1]">
            Book care your pet <br />
            <span className="text-[var(--pc-primary)] relative inline-block">
              actually enjoys
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-[var(--pc-primary)]/20"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg text-[#78716c] max-w-lg leading-relaxed">
            Explore grooming, veterinary checkups, and boarding from verified
            providers in one place.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-sm">
              <p className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider mb-1">
                Providers
              </p>
              <p className="text-2xl font-bold text-[#1c1917]">300+</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-l-amber-500 shadow-sm">
              <p className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider mb-1">
                Happy Pets
              </p>
              <p className="text-2xl font-bold text-[#1c1917]">50K+</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-l-[var(--pc-teal)] shadow-sm">
              <p className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider mb-1">
                Avg Rating
              </p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-[#1c1917]">4.8</p>
                <Star className="w-4 h-4 text-[var(--pc-primary)] fill-[var(--pc-primary)]" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-l-rose-500 shadow-sm">
              <p className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider mb-1">
                Support
              </p>
              <p className="text-2xl font-bold text-[#1c1917]">24/7</p>
            </div>
          </div>
        </div>

        {/* Right Content - Decorative Card */}
        <div className="relative hidden lg:block h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2a] to-[#064e3b] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center justify-center text-white p-12 transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-inner">
                <PawPrint className="w-12 h-12 text-[var(--pc-primary)]" />
              </div>

              <div>
                <h3 className="text-3xl font-serif font-bold mb-2">
                  Premium Pet Care
                </h3>
                <p className="text-emerald-100 max-w-xs mx-auto">
                  Experience the difference with our curated network of top-tier
                  professionals.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 w-full max-w-xs mt-8">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm font-medium">
                    Verified Professionals
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <Heart className="w-5 h-5 text-rose-300" />
                  <span className="text-sm font-medium">
                    Loving Environment
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <Clock className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium">Real-time Booking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#e7e5e4] flex items-center gap-3 animate-bounce-slow">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-stone-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-stone-300 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-stone-400 border-2 border-white"></div>
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#1c1917]">1k+ Bookings</p>
              <p className="text-[#78716c]">this week</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}