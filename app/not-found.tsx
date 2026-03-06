import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--pc-primary-light)] via-white to-[var(--pc-cream)]">
      <div className="absolute inset-0 -z-10 bg-gradient-mesh" />
      <div className="absolute -top-36 -right-36 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-36 -left-36 h-96 w-96 rounded-full bg-[var(--pc-teal)]/15 blur-3xl" />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-20">
        <section className="w-full rounded-4xl border border-primary/15 bg-white/80 p-8 shadow-2xl backdrop-blur-sm md:p-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-primary/10 p-2">
              <Image
                src="/images/pawcare.png"
                alt="PawCare logo"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">PawCare</span>
          </div>

          <p className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Error 404
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            This page ran away.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            The page you requested could not be found. It may have been moved,
            deleted, or the URL may be incorrect.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 font-semibold text-foreground transition hover:border-primary/40 hover:bg-[var(--pc-primary-light)]"
            >
              <Search size={18} />
              Browse Services
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 font-semibold text-foreground transition hover:border-primary/40 hover:bg-[var(--pc-primary-light)]"
            >
              <ArrowLeft size={18} />
              Go to Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
