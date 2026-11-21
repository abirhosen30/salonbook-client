"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getServiceById } from "@/lib/api";
import { Service } from "@/types";
import Loader from "@/components/Loader";
import BookingForm from "@/components/services/BookingForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  id: string;
};

export default function ServiceDetails({ id }: Props) {
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  // Authentication protection
  useEffect(() => {
    if (!userLoading && !user) {
      router.push(`/signin?redirect=/services/${id}`);
    }
  }, [user, userLoading, id, router]);

  // Load service by id
  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true);
        setError("");
        const data = await getServiceById(id);
        if (!data) {
          setError("Service not found");
        } else {
          setService(data);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load service details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchService();
    }
  }, [id]);

  // Loader while checking auth or loading service data
  if (userLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-[#2D241E]/60">Loading service details...</p>
      </div>
    );
  }

  // Not authenticated redirecting state
  if (!user) {
    return null;
  }

  // Invalid or not found id error state
  if (error || !service) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-[#EFECE6] p-8 max-w-md w-full text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto mb-4 text-[#9E5739]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D241E] mb-2">
            Service Not Found
          </h2>
          <p className="text-sm text-[#2D241E]/70 mb-6">
            We could not find the service you are looking for. It may have been retired or the link is invalid.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#9E5739] text-white text-sm font-medium hover:bg-[#8B4A2F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const isInactive = service.status === "inactive";
  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button link */}
      <div className="mb-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-[#2D241E]/70 hover:text-[#9E5739] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all services
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Service Image Section */}
        <div className="lg:col-span-7">
          <div className="relative h-80 sm:h-[460px] w-full rounded-3xl overflow-hidden border border-[#EFECE6] bg-neutral-100 shadow-xs">
            <Image
              src={service.image}
              alt={service.serviceName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            <div className="absolute top-4 left-4">
              <Badge className="bg-black/60 text-white backdrop-blur-md px-3 py-1 text-xs uppercase tracking-wider font-semibold hover:bg-black/70">
                {service.category}
              </Badge>
            </div>

            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-[#2D241E] backdrop-blur-md px-3 py-1 text-xs font-medium flex items-center gap-1.5 hover:bg-white">
                <Clock className="w-3.5 h-3.5 text-[#9E5739]" />
                {service.duration} mins
              </Badge>
            </div>
          </div>
        </div>

        {/* Service Details & Booking Section */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-xs flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
              {service.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-1">
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
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2D241E]/70 mb-2">
              About this Treatment
            </h3>
            <p className="text-sm leading-relaxed text-[#2D241E]/80">
              {service.description}
            </p>
          </div>

          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EFECE6] space-y-2 text-xs text-[#2D241E]/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#9E5739]" />
              <span>Complimentary organic refreshments & consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#9E5739]" />
              <span>Tailored aftercare recommendations by master stylists</span>
            </div>
          </div>

          {/* Action / Warning Notice Area */}
          <div className="pt-2">
            {isInactive ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-sm font-semibold text-amber-800">
                  This service is not available
                </p>
                <p className="text-xs text-amber-700/80 mt-0.5">
                  This treatment is temporarily deactivated.
                </p>
              </div>
            ) : isAdmin ? (
              <div className="rounded-2xl bg-[#FAF6F0] border border-[#EFECE6] p-4 text-center">
                <p className="text-sm font-semibold text-[#2D241E]">
                  Admins cannot book appointments
                </p>
                <p className="text-xs text-[#2D241E]/60 mt-0.5">
                  Sign in with a customer account to make client reservations.
                </p>
              </div>
            ) : (
              <Button
                onClick={() => setOpen(true)}
                className="w-full h-12 bg-[#9E5739] hover:bg-[#8B4A2F] text-white text-base font-medium rounded-xl shadow-xs transition-colors"
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
  );
}
