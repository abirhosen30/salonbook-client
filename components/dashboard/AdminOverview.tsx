"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Users,
  Scissors,
  CalendarCheck,
  Clock,
  CheckCircle2,
  CreditCard,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getAdminStats, AdminStats } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats>({
    totalRegisteredCustomers: 0,
    totalActiveServices: 0,
    totalAppointmentRequests: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    totalSuccessfulPayments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const data = await getAdminStats();
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to load admin statistics";
          toast.error(errorMsg);
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-[#2D241E]/60">Loading salon metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
            Administration Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-0.5">
            Operational Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#2D241E]/70 mt-1">
            Real-time metrics, appointment volume, service catalog health, and revenue highlights.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard/admin/services/add">
            <Button className="bg-[#9E5739] hover:bg-[#8B4A2F] text-white flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>Add New Service</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Key Metrics Cards (PDF Page 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Registered Customers"
          value={stats.totalRegisteredCustomers}
          icon={Users}
        />
        <StatCard
          title="Active Salon Services"
          value={stats.totalActiveServices}
          icon={Scissors}
        />
        <StatCard
          title="Total Appointment Requests"
          value={stats.totalAppointmentRequests}
          icon={CalendarCheck}
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingAppointments}
          icon={Clock}
        />
        <StatCard
          title="Confirmed Appointments"
          value={stats.confirmedAppointments}
          icon={CheckCircle2}
        />
        <StatCard
          title="Total Successful Payments"
          value={stats.totalSuccessfulPayments}
          icon={CreditCard}
        />
      </div>

      {/* Revenue Highlight Card */}
      <div className="bg-gradient-to-r from-[#2D241E] to-[#42342B] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-[#E7CBA9] text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Financial Highlights</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold mt-2">
            ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-1">
            Total verified salon revenue processed through Stripe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/admin/transactions">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              View Transactions
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="/dashboard/admin/appointments">
            <Button className="bg-[#9E5739] hover:bg-[#8B4A2F] text-white">
              Manage Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
