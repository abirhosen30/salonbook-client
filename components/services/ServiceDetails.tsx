"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Sparkles, CheckCircle2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { getServiceById } from "@/lib/api"
import { Service } from "@/types"
import Loader from "@/components/Loader"
import BookingForm from "@/components/services/BookingForm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Props = {
  id: string
}

export default function ServiceDetails({ id }: Props) {
  const router = useRouter()
  const { user, loading: userLoading } = useCurrentUser()

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false)

  // Authentication protection
  useEffect(() => {
    if (!userLoading && !user) {
      router.push(`/signin?redirect=/services/${id}`)
    }
  }, [user, userLoading, id, router])

  // Load service by id
  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true)
        setError("")
        const data = await getServiceById(id)
        if (!data) {
          setError("Service not found")
        } else {
          setService(data)
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load service details"
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchService()
    }
  }, [id])

  // Loader while checking auth or loading service data
  if (userLoading || loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-[#2D241E]/60">
          Loading service details...
        </p>
      </div>
    )
  }

  // Not authenticated redirecting state
  if (!user) {
    return null
  }

  // Invalid or not found id error state
  if (error || !service) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#EFECE6] bg-white p-8 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF6F0] text-[#9E5739]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mb-2 font-serif text-2xl font-bold text-[#2D241E]">
            Service Not Found
          </h2>
          <p className="mb-6 text-sm text-[#2D241E]/70">
            We could not find the service you are looking for. It may have been
            retired or the link is invalid.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9E5739] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#8B4A2F]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  const isInactive = service.status === "inactive"
  const isAdmin = user.role === "admin"

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back button link */}
      <div className="mb-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2D241E]/70 transition-colors hover:text-[#9E5739]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all services
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Service Image Section */}
        <div className="lg:col-span-7">
          <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-[#EFECE6] bg-neutral-100 shadow-xs sm:h-[460px]">
            <Image
              src={service.image}
              alt={service.serviceName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            <div className="absolute top-4 left-4">
              <Badge className="bg-black/60 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md hover:bg-black/70">
                {service.category}
              </Badge>
            </div>

            <div className="absolute top-4 right-4">
              <Badge className="flex items-center gap-1.5 bg-white/90 px-3 py-1 text-xs font-medium text-[#2D241E] backdrop-blur-md hover:bg-white">
                <Clock className="h-3.5 w-3.5 text-[#9E5739]" />
                {service.duration} mins
              </Badge>
            </div>
          </div>
        </div>

        {/* Service Details & Booking Section */}
        <div className="flex flex-col gap-6 rounded-3xl border border-[#EFECE6] bg-white p-6 shadow-xs sm:p-8 lg:col-span-5">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#9E5739] uppercase">
              {service.category}
            </span>
            <h1 className="mt-1 font-serif text-2xl font-bold text-[#2D241E] sm:text-3xl">
              {service.serviceName}
            </h1>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-[#9E5739]">
                ${service.price}
              </span>
              <span className="text-xs text-[#2D241E]/60">/ session</span>
            </div>
          </div>

          <div className="border-t border-[#EFECE6] pt-4">
            <h3 className="mb-2 text-xs font-semibold tracking-wider text-[#2D241E]/70 uppercase">
              About this Treatment
            </h3>
            <p className="text-sm leading-relaxed text-[#2D241E]/80">
              {service.description}
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-[#EFECE6] bg-[#FAF6F0] p-4 text-xs text-[#2D241E]/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#9E5739]" />
              <span>Complimentary organic refreshments & consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#9E5739]" />
              <span>Tailored aftercare recommendations by master stylists</span>
            </div>
          </div>

          {/* Action / Warning Notice Area */}
          <div className="pt-2">
            {isInactive ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                <p className="text-sm font-semibold text-amber-800">
                  This service is not available
                </p>
                <p className="mt-0.5 text-xs text-amber-700/80">
                  This treatment is temporarily deactivated.
                </p>
              </div>
            ) : isAdmin ? (
              <div className="rounded-2xl border border-[#EFECE6] bg-[#FAF6F0] p-4 text-center">
                <p className="text-sm font-semibold text-[#2D241E]">
                  Admins cannot book appointments
                </p>
                <p className="mt-0.5 text-xs text-[#2D241E]/60">
                  Sign in with a customer account to make client reservations.
                </p>
              </div>
            ) : (
              <Button
                onClick={() => setOpen(true)}
                className="h-12 w-full rounded-xl bg-[#9E5739] text-base font-medium text-white shadow-xs transition-colors hover:bg-[#8B4A2F]"
              >
                Book Appointment
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Dialog */}
      {!isInactive && !isAdmin && (
        <BookingForm
          service={service}
          user={user}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  )
}
