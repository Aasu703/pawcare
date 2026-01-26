"use client"


import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


export default function Page() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0f4f57] text-white">
      {/* Navigation */}
      <nav className="bg-[#0c4148]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/images/pawcare.png" alt="PawCare Logo" width={40} height={40} />
            <span className="text-xl font-bold text-white">PawCare</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/" className="text-gray-100 hover:text-[#f8d548] transition">Home</Link>
            <Link href="/about" className="text-gray-100 hover:text-[#f8d548] transition">About</Link>
            <Link href="/login" className="text-gray-100 hover:text-[#f8d548] transition">Login</Link>
            <Link href="/register" className="bg-[#f8d548] text-[#0c4148] px-4 py-2 rounded-full hover:brightness-95 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(248,213,72,0.15),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.06),transparent_30%)]"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-6">
            <p className="uppercase tracking-[0.2em] text-xs text-[#f8d548]">Welcome to PawCare</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Make Your Pet <span className="text-[#f8d548]">Friendly</span>
            </h1>
            <p className="text-lg text-gray-100/90 leading-relaxed">
              PawCare brings training, health tracking, and expert guidance together so your best friend thrives. Stay organized, book sessions, and follow personalized plans.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="bg-[#f8d548] text-[#0c4148] px-8 py-3 rounded-full font-semibold hover:brightness-95 transition shadow-lg shadow-yellow-500/20">
                Get Started
              </Link>
              <Link href="/about" className="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
                Learn More
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-100/80">
              <div className="flex items-center gap-2">
                <span className="text-[#f8d548]">★</span> Trusted vets & trainers
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#f8d548]">★</span> Wellness plans
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -left-6 -top-6 w-80 h-80 bg-[#f8d548] rounded-full mix-blend-lighten blur-2xl opacity-90"></div>
            <div className="relative w-full max-w-md">
              <div className="absolute -right-6 -top-8 w-24 h-24 rounded-full bg-white/15"></div>
              <Image
                src="/images/cat.png"
                alt="PawCare Cat"
                width={420}
                height={420}
                className="relative z-10 drop-shadow-2xl rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services / Features */}
      <section className="bg-white text-gray-900 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#0f4f57] uppercase tracking-[0.2em]">What we do</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">Care, Training, and Insights</h2>
            <p className="mt-3 text-gray-600">Everything your pet needs in one place—guided programs, bookings, and health tracking.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Observation', desc: 'Track mood, appetite, and daily notes to spot patterns early.', icon: '👀' },
              { title: 'Behaviour Analysis', desc: 'Get actionable insights to improve manners and calm anxiety.', icon: '🐾' },
              { title: 'Introduction', desc: 'Onboard with routines tailored for puppies, kittens, or seniors.', icon: '🐱' },
              { title: 'Modul Training', desc: 'Follow stepwise training plans with reminders and rewards.', icon: '🎯' },
              { title: 'Implementation', desc: 'Book trainers or vets directly and keep follow-up tasks organized.', icon: '📅' },
              { title: 'Control & Evaluation', desc: 'Measure progress, adjust plans, and share reports with pros.', icon: '📊' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition bg-white">
                <div className="w-12 h-12 rounded-full bg-[#f8d548]/30 flex items-center justify-center text-xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#0f4f57] mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f4f57] py-16 md:py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to make your pet happier?</h3>
          <p className="text-gray-100/85 mb-8">Join PawCare to access training modules, health tracking, and expert support tailored for your companion.</p>
          <Link href="/register" className="bg-[#f8d548] text-[#0c4148] px-10 py-4 rounded-full font-semibold hover:brightness-95 transition shadow-lg shadow-yellow-500/20">
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c4148] text-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/images/pawcare.png" alt="PawCare" width={30} height={30} />
              <span className="font-bold text-white">PawCare</span>
            </div>
            <p className="text-sm text-gray-200/80">Friendly, healthy pets made simple.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-200/80">
              <li><Link href="#" className="hover:text-[#f8d548] transition">Features</Link></li>
              <li><Link href="#" className="hover:text-[#f8d548] transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-200/80">
              <li><Link href="/about" className="hover:text-[#f8d548] transition">About</Link></li>
              <li><Link href="#" className="hover:text-[#f8d548] transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-200/80">
              <li><Link href="#" className="hover:text-[#f8d548] transition">Privacy</Link></li>
              <li><Link href="#" className="hover:text-[#f8d548] transition">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-200/70">
          <p>&copy; 2025 PawCare. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

