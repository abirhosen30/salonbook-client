"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Scissors,
  Flame,
  Smile,
  Paintbrush,
  Hand,
  Flower2,
} from "lucide-react";
import { Service } from "@/lib/dummyData";
import { getFeaturedServices } from "@/lib/api";
import { categoryList } from "@/lib/categories";
import ServiceCard from "@/components/ServiceCard";
import Loader from "@/components/Loader";

function getCategoryIcon(name: string) {
  switch (name) {
    case "Haircut & Styling":
      return <Scissors className="w-6 h-6 text-[#9E5739]" />;
    case "Hair Coloring":
      return <Sparkles className="w-6 h-6 text-[#9E5739]" />;
    case "Hair Treatment":
      return <Flame className="w-6 h-6 text-[#9E5739]" />;
    case "Facial & Skincare":
      return <Smile className="w-6 h-6 text-[#9E5739]" />;
    case "Makeup":
      return <Paintbrush className="w-6 h-6 text-[#9E5739]" />;
    case "Manicure & Pedicure":
      return <Hand className="w-6 h-6 text-[#9E5739]" />;
    case "Spa & Massage":
      return <Flower2 className="w-6 h-6 text-[#9E5739]" />;
    default:
      return <Sparkles className="w-6 h-6 text-[#9E5739]" />;
  }
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFeaturedServices() {
      try {
        const data = await getFeaturedServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load featured services", error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedServices();
  }, []);

  return (
    <main className="min-h-screen">
      {/* 1. Hero Banner Section */}
      <section
        className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/75" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#E7A17E]" />
            <span>BEVERLY HILLS • NEW YORK • MIAMI</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Curated Luxury Beauty & Hair Services{" "}
            <span className="italic font-normal text-[#E7A17E]">
              At Your Fingertips
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed font-light">
            Explore artisanal haircuts, color balayage, revitalizing facials, and bridal makeovers by master stylists. Instant booking and seamless Stripe payments.
          </p>

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

      {/* 2. Featured Salon Services Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
            Client Favorites
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D241E] mt-2">
            Featured Salon Services
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#2D241E]/70 leading-relaxed">
            Hand-picked treatments frequently booked and celebrated by our distinguished guests.
          </p>
        </div>

        {/* Loading State */}
        {loading && <Loader />}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <p className="text-center text-sm text-[#2D241E]/60 py-12">
            No active services found.
          </p>
        )}

        {/* Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* Explore All CTA Button */}
        {!loading && services.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#9E5739] hover:text-white bg-transparent hover:bg-[#9E5739] border border-[#9E5739] rounded-full transition-all"
            >
              <span>Explore All Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 3. Salon Service Categories Section */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#EFECE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
              Artisanal Specializations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D241E] mt-2">
              Salon Service Categories
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#2D241E]/70 leading-relaxed">
              Every service is tailored by accredited specialists using non-toxic botanical formulations and clinical-grade tools.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryList.map((category) => (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EFECE6] hover:border-[#9E5739]/40 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#EFECE6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2D241E] group-hover:text-[#9E5739] transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#2D241E]/70 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#EFECE6] flex items-center gap-1.5 text-xs font-semibold text-[#9E5739]">
                  <span>View treatments</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
