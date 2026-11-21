import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner Section */}
      <section
        className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        {/* Dark Overlay for contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/75" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Location / Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#E7A17E]" />
            <span>BEVERLY HILLS • NEW YORK • MIAMI</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Curated Luxury Beauty & Hair Services{" "}
            <span className="italic font-normal text-[#E7A17E]">
              At Your Fingertips
            </span>
          </h1>

          {/* Short Description */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed font-light">
            Explore artisanal haircuts, color balayage, revitalizing facials, and bridal makeovers by master stylists. Instant booking and seamless Stripe payments.
          </p>

          {/* CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-[#9E5739] hover:bg-[#8B4A2F] rounded-full shadow-lg shadow-black/20 hover:shadow-xl transition-all group"
            >
              <span>Explore Salon Services</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
