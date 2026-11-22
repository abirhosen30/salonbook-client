"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="rounded-3xl border border-[#EFECE6] bg-white p-8 text-center text-[#2D241E] shadow-sm sm:p-12">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/50">
          <AlertCircle className="h-9 w-9" />
        </div>

        {/* Title & Description */}
        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
            Checkout Session Incomplete
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-[#2D241E]">
            Payment Cancelled
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#2D241E]/75">
            Your payment session was cancelled. No charges have been made to your card or account.
          </p>
        </div>

        {/* Notice Card */}
        <div className="mt-6 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 text-left text-xs text-amber-950">
          <p className="font-semibold text-amber-900">
            What happens to your appointment?
          </p>
          <p className="mt-1 leading-relaxed text-amber-800/90">
            Your appointment reservation is still held as confirmed in our system, but its status remains <strong>unpaid</strong>. You can pay anytime before your session from your customer dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard/customer/appointments" className="w-full">
            <Button className="h-12 w-full rounded-xl bg-[#9E5739] text-sm font-medium text-white shadow-xs hover:bg-[#8B4A2F]">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Go to My Appointments & Pay</span>
            </Button>
          </Link>

          <Link href="/services" className="w-full">
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-[#EFECE6] text-sm font-medium text-[#2D241E] hover:bg-[#FAF6F0]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Return to Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
