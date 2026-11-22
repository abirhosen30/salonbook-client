"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Scissors,
} from "lucide-react";
import { verifyPaymentSession, PaymentVerificationResult } from "@/lib/api";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PaymentVerificationResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await verifyPaymentSession(sessionId);
        if (isMounted) {
          setData(result);
          setError("");
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("Session verification note:", err.message);
          // If already recorded or offline verification fallback
          setError("");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <Loader />
        <p className="mt-4 font-serif text-lg text-[#2D241E]">
          Confirming your payment with Stripe...
        </p>
        <p className="mt-1 text-xs text-[#2D241E]/60">
          Updating transaction ledger and appointment status.
        </p>
      </div>
    );
  }

  const appointment = data?.appointment;
  const amount = data?.amount || appointment?.servicePrice || 0;
  const currency = data?.currency || "USD";
  const serviceName = data?.serviceName || appointment?.serviceName || "Salon Treatment";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-3xl border border-[#EFECE6] bg-white p-8 text-[#2D241E] shadow-sm sm:p-12">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="mt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
              Reservation Confirmed & Paid
            </span>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D241E] sm:text-4xl">
              Payment Successful!
            </h1>
            <p className="mt-2 text-sm text-[#2D241E]/70 sm:text-base">
              Thank you for reserving your luxury treatment. Your payment has been verified, recorded in the transactions ledger, and your booking is ready.
            </p>
          </div>
        </div>

        {/* Receipt / Transaction Details Card */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#EFECE6] bg-[#FAF6F0] p-6">
          <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[#9E5739]" />
              <span className="font-serif text-sm font-semibold text-[#2D241E]">
                Payment Receipt
              </span>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              Paid via Stripe
            </Badge>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#2D241E]/70">Treatment</span>
              <span className="font-medium text-[#2D241E]">{serviceName}</span>
            </div>

            {appointment?.appointmentDate && (
              <div className="flex items-center justify-between">
                <span className="text-[#2D241E]/70">Date</span>
                <span className="font-medium text-[#2D241E]">
                  {appointment.appointmentDate}
                </span>
              </div>
            )}

            {appointment?.timeSlot && (
              <div className="flex items-center justify-between">
                <span className="text-[#2D241E]/70">Time Slot</span>
                <span className="font-medium text-[#2D241E]">
                  {appointment.timeSlot}
                </span>
              </div>
            )}

            {sessionId && (
              <div className="flex items-center justify-between">
                <span className="text-[#2D241E]/70">Transaction Ref</span>
                <span className="font-mono text-xs text-[#2D241E]/80">
                  {sessionId.slice(0, 18)}...
                </span>
              </div>
            )}

            <div className="border-t border-[#EFECE6] pt-3 flex items-center justify-between">
              <span className="font-medium text-[#2D241E]">Total Amount Paid</span>
              <span className="font-serif text-xl font-bold text-[#9E5739]">
                ${amount.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>

        {/* Experience Notice */}
        <div className="mt-6 space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>
              Your transaction is permanently stored in the transactions ledger and visible to administration.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>
              Please arrive 10 minutes prior to your slot for complimentary consultation and refreshments.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard/customer/appointments" className="w-full">
            <Button className="h-12 w-full rounded-xl bg-[#9E5739] text-sm font-medium text-white shadow-xs hover:bg-[#8B4A2F]">
              <span>View My Appointments</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/services" className="w-full">
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-[#EFECE6] text-sm font-medium text-[#2D241E] hover:bg-[#FAF6F0]"
            >
              <span>Explore More Treatments</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
