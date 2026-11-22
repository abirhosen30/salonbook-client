"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getCustomerStats, getMyAppointments, CustomerStats } from "@/lib/api";
import { Appointment } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import Loader from "@/components/Loader";

export default function CustomerOverview() {
  const { user } = useCurrentUser();

  // State 1: Stats summary counts
  const [stats, setStats] = useState<CustomerStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });

  // State 2: List of customer appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // State 3: Loading spinner state
  const [loading, setLoading] = useState<boolean>(true);

  // Function 1: Load stats counts and appointment data from API
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Fetch stats and appointments in parallel
        const [statsData, appointmentsData] = await Promise.all([
          getCustomerStats(),
          getMyAppointments(),
        ]);
        setStats(statsData);
        setAppointments(appointmentsData);
      } catch (error: unknown) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to load dashboard data";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Section 2: Show loader while fetching API data
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-[#2D241E]/60">Loading your overview...</p>
      </div>
    );
  }

  // Take the 3 latest appointments
  const recentAppointments = appointments.slice(0, 3);

  // Function 2: Helper for status badge styling
  const renderStatusBadge = (status: Appointment["status"]) => {
    if (status === "confirmed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Confirmed
        </span>
      );
    }
    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Greeting Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
            Customer Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-1">
            Welcome back, {user?.name || "Client"}
          </h1>
          <p className="mt-1 text-sm text-[#2D241E]/70">
            Here is a quick summary of your salon booking activity and upcoming rituals.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#9E5739] text-white text-sm font-medium hover:bg-[#8B4A2F] transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Book a Treatment</span>
        </Link>
      </div>

      {/* 2. Four Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Requests */}
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon={CalendarDays}
          iconColor="text-[#9E5739]"
          iconBg="bg-[#FAF6F0]"
          description="All appointments created"
        />

        {/* Card 2: Pending */}
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          description="Awaiting salon confirmation"
        />

        {/* Card 3: Confirmed */}
        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          description="Scheduled sessions"
        />

        {/* Card 4: Cancelled */}
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          description="Cancelled or declined"
        />
      </div>

      {/* 3. Latest 3 Appointments Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-xs">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EFECE6]">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#2D241E]">
              Recent Appointments
            </h2>
            <p className="text-xs text-[#2D241E]/60 mt-0.5">
              Your latest 3 booking requests
            </p>
          </div>

          <Link
            href="/dashboard/customer/appointments"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#9E5739] hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Empty State */}
        {recentAppointments.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-base font-semibold text-[#2D241E]">No appointments yet</p>
            <p className="text-sm text-[#2D241E]/60 mt-1 max-w-sm mx-auto">
              You haven&apos;t booked any salon appointments yet. Explore our treatments to schedule your first session.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9E5739] text-white text-sm font-medium hover:bg-[#8B4A2F] transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          /* Recent Appointments List */
          <div className="divide-y divide-[#EFECE6]">
            {recentAppointments.map((item) => (
              <div
                key={item._id}
                className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Service Details */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 border border-[#EFECE6] shrink-0">
                    <Image
                      src={item.serviceImage}
                      alt={item.serviceName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E5739]">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#2D241E]">
                      {item.serviceName}
                    </h3>
                    <p className="text-xs text-[#2D241E]/65 mt-0.5 flex items-center gap-2">
                      <span>{item.appointmentDate}</span>
                      <span>&bull;</span>
                      <span>{item.timeSlot}</span>
                    </p>
                  </div>
                </div>

                {/* Price & Badges */}
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-right">
                    <p className="font-serif text-lg font-bold text-[#9E5739]">
                      ${item.servicePrice}
                    </p>
                    <span className="text-[10px] uppercase font-semibold text-[#2D241E]/60">
                      {item.paymentStatus}
                    </span>
                  </div>

                  <div className="shrink-0">{renderStatusBadge(item.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
