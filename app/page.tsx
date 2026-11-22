"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Scissors,
  Flame,
  Smile,
  Paintbrush,
  Hand,
  Flower2,
  Star,
} from "lucide-react"
import { Service } from "@/types"
import { getFeaturedServices } from "@/lib/api"
import { categoryList } from "@/lib/categories"
import ServiceCard from "@/components/ServiceCard"
import Loader from "@/components/Loader"
import { whyChooseUsData } from "@/lib/WhyChooseUs"
import { testimonialsData } from "@/lib/TestimonialsData"

function getCategoryIcon(name: string) {
  switch (name) {
    case "Haircut & Styling":
      return <Scissors className="h-6 w-6 text-[#9E5739]" />
    case "Hair Coloring":
      return <Sparkles className="h-6 w-6 text-[#9E5739]" />
    case "Hair Treatment":
      return <Flame className="h-6 w-6 text-[#9E5739]" />
    case "Facial & Skincare":
      return <Smile className="h-6 w-6 text-[#9E5739]" />
    case "Makeup":
      return <Paintbrush className="h-6 w-6 text-[#9E5739]" />
    case "Manicure & Pedicure":
      return <Hand className="h-6 w-6 text-[#9E5739]" />
    case "Spa & Massage":
      return <Flower2 className="h-6 w-6 text-[#9E5739]" />
    default:
      return <Sparkles className="h-6 w-6 text-[#9E5739]" />
  }
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadFeaturedServices() {
      try {
        const data = await getFeaturedServices()
        setServices(data)
      } catch (error) {
        console.error("Failed to load featured services", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedServices()
  }, [])

  return (
    <main className="min-h-screen">
      {/* 1. Hero Banner Section */}
      <section
        className="relative flex min-h-[580px] w-full items-center justify-center overflow-hidden bg-cover bg-center lg:min-h-[660px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/75" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur-md sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#E7A17E]" />
            <span>BEVERLY HILLS • NEW YORK • MIAMI</span>
          </div>

          <h1 className="mx-auto max-w-4xl font-serif text-3xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Curated Luxury Beauty & Hair Services{" "}
            <span className="font-normal text-[#E7A17E] italic">
              At Your Fingertips
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed font-light text-white/85 sm:text-lg lg:text-xl">
            Explore artisanal haircuts, color balayage, revitalizing facials,
            and bridal makeovers by master stylists. Instant booking and
            seamless Stripe payments.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#9E5739] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-[#8B4A2F] hover:shadow-xl"
            >
              <span>Explore Salon Services</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Salon Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-wider text-[#9E5739] uppercase">
            Client Favorites
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#2D241E] sm:text-4xl">
            Featured Salon Services
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#2D241E]/70 sm:text-base">
            Hand-picked treatments frequently booked and celebrated by our
            distinguished guests.
          </p>
        </div>

        {/* Loading State */}
        {loading && <Loader />}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <p className="py-12 text-center text-sm text-[#2D241E]/60">
            No active services found.
          </p>
        )}

        {/* Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
              className="inline-flex items-center gap-2 rounded-full border border-[#9E5739] bg-transparent px-6 py-3 text-sm font-medium text-[#9E5739] transition-all hover:bg-[#9E5739] hover:text-white"
            >
              <span>Explore All Treatments</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 3. Salon Service Categories Section */}
      <section className="border-y border-[#EFECE6] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-semibold tracking-wider text-[#9E5739] uppercase">
              Artisanal Specializations
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#2D241E] sm:text-4xl">
              Salon Service Categories
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#2D241E]/70 sm:text-base">
              Every service is tailored by accredited specialists using
              non-toxic botanical formulations and clinical-grade tools.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryList.map((category) => (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col justify-between rounded-2xl border border-[#EFECE6] bg-[#FAF6F0] p-6 transition-all hover:border-[#9E5739]/40 hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#EFECE6] bg-white shadow-xs transition-transform group-hover:scale-105">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2D241E] transition-colors group-hover:text-[#9E5739]">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#2D241E]/70 sm:text-sm">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 border-t border-[#EFECE6] pt-3 text-xs font-semibold text-[#9E5739]">
                  <span>View treatments</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-wider text-[#9E5739] uppercase">
            Effortless Hospitality
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#2D241E] sm:text-4xl">
            Why Choose SalonBook
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#2D241E]/70 sm:text-base">
            We bridged high-fashion artistry with modern digital calm to
            eliminate phone tags, unexpected fees, and waiting times.
          </p>
        </div>

        {/* 4 Small Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUsData.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="flex flex-col justify-between rounded-2xl border border-[#EFECE6] bg-white p-6 shadow-xs transition-colors hover:border-[#9E5739]/30"
              >
                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF6F0]">
                    <Icon className="h-5 w-5 text-[#9E5739]" />
                  </div>
                  <h3 className="mb-2 font-serif text-base font-bold text-[#2D241E]">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#2D241E]/70 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. What Our Customers Say (Testimonials) Section */}
      <section className="border-t border-[#EFECE6] bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-semibold tracking-wider text-[#9E5739] uppercase">
              Loved By Our Guests
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#2D241E] sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#2D241E]/70 sm:text-base">
              Real experiences from clients who booked and visited our verified
              master stylists.
            </p>
          </div>

          {/* 3 Testimonials Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonialsData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-2xl border border-[#EFECE6] bg-[#FAF6F0] p-7 shadow-xs"
              >
                <div>
                  {/* 5 Stars */}
                  <div className="mb-4 flex items-center gap-1 text-[#9E5739]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#9E5739]" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="mb-6 text-sm leading-relaxed text-[#2D241E]/80 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 border-t border-[#EFECE6] pt-4">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-[#9E5739]/20 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#2D241E]">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#2D241E]/60">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
