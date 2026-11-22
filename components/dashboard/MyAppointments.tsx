"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Ban,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Appointment } from "@/types";
import {
  getMyAppointments,
  cancelAppointment,
  createCheckoutSession,
} from "@/lib/api";
import Loader from "@/components/Loader";
import AppointmentDetailsDialog from "@/components/dashboard/AppointmentDetailsDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function MyAppointments() {
  // State 1: List of user appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // State 2: Page loading state
  const [loading, setLoading] = useState<boolean>(true);

  // State 3: Selected appointment for the View Details modal
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  // State 4: Appointment targeted for cancellation confirmation
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);

  // State 5: Track ID of appointment currently processing payment
  const [payingId, setPayingId] = useState<string | null>(null);

  // Function 1: Load appointments from API
  const refreshAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to load appointments";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadInitial() {
      try {
        const data = await getMyAppointments();
        if (!isCancelled) {
          setAppointments(data);
        }
      } catch (error: unknown) {
        if (!isCancelled) {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to load appointments";
          toast.error(errorMsg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Function 2: Handle appointment cancellation
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;

    try {
      setCancelling(true);
      const res = await cancelAppointment(cancelTarget._id);
      toast.success(res.message || "Appointment cancelled");
      setCancelTarget(null);
      // Reload updated appointments list
      await refreshAppointments();
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to cancel appointment";
      toast.error(errorMsg);
    } finally {
      setCancelling(false);
    }
  };

  // Function 3: Handle Pay Now button click
  const handlePayNow = async (appointmentId: string) => {
    try {
      setPayingId(appointmentId);
      const res = await createCheckoutSession(appointmentId);
      toast.success("Redirecting to checkout...");
      // Redirect to payment url returned by backend
      window.location.href = res.url;
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Payment initialization failed";
      toast.error(errorMsg);
      setPayingId(null);
    }
  };

  // Function 4: Open View Details modal
  const handleViewDetails = (item: Appointment) => {
    setSelectedAppointment(item);
    setDetailsOpen(true);
  };

  // Helper 5: Format created request date
  const formatRequestDate = (isoDate?: string) => {
    if (!isoDate) return "N/A";
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoDate;
    }
  };

  // Helper 6: Render colored status pill
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

  // Section 7: Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-[#2D241E]/60">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
            My Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-0.5">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-[#2D241E]/70 mt-1">
            Track your upcoming rituals, view booking statuses, or complete payments.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#9E5739] text-white text-sm font-medium hover:bg-[#8B4A2F] transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Book New Treatment</span>
        </Link>
      </div>

      {/* Empty State */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EFECE6] p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#2D241E]">
            No appointments found
          </h2>
          <p className="text-sm text-[#2D241E]/65 mt-1.5 max-w-md mx-auto">
            You don&apos;t have any scheduled appointments yet. Browse our selection
            of luxury salon services and book your first ritual today.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#9E5739] text-white text-sm font-medium hover:bg-[#8B4A2F] transition-colors"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <>
          {/* 1. Desktop View: shadcn Table */}
          <div className="hidden lg:block bg-white rounded-3xl border border-[#EFECE6] shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-[#FAF6F0]/80">
                <TableRow className="border-[#EFECE6] hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pl-6">
                    Service
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                    Category
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                    Price
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                    Payment
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                    Requested
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pr-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {appointments.map((item) => (
                  <TableRow
                    key={item._id}
                    className="border-[#EFECE6] hover:bg-[#FAF6F0]/50 transition-colors"
                  >
                    {/* Service Image & Name */}
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-[#EFECE6] shrink-0">
                          <Image
                            src={item.serviceImage}
                            alt={item.serviceName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-serif font-bold text-[#2D241E] line-clamp-1">
                          {item.serviceName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-xs text-[#2D241E]/70 font-medium">
                      {item.category}
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell>
                      <div className="text-xs text-[#2D241E]">
                        <p className="font-semibold">{item.appointmentDate}</p>
                        <p className="text-[#2D241E]/60">{item.timeSlot}</p>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-serif font-bold text-sm text-[#9E5739]">
                      ${item.servicePrice}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>

                    {/* Payment Badge */}
                    <TableCell>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          item.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-neutral-100 text-[#2D241E]/65 border-neutral-200"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </TableCell>

                    {/* Requested Date */}
                    <TableCell className="text-xs text-[#2D241E]/60">
                      {formatRequestDate(item.createdAt)}
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(item)}
                          className="h-8 px-2.5 text-xs border-[#EFECE6] text-[#2D241E] hover:bg-[#FAF6F0]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[#9E5739]" />
                          Details
                        </Button>

                        {/* Cancel Button (only pending) */}
                        {item.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCancelTarget(item)}
                            className="h-8 px-2.5 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Ban className="w-3.5 h-3.5 mr-1" />
                            Cancel
                          </Button>
                        )}

                        {/* Pay Now Button (only confirmed AND unpaid) */}
                        {item.status === "confirmed" &&
                          item.paymentStatus === "unpaid" && (
                            <Button
                              size="sm"
                              onClick={() => handlePayNow(item._id)}
                              disabled={payingId === item._id}
                              className="h-8 px-2.5 text-xs bg-[#9E5739] hover:bg-[#8B4A2F] text-white"
                            >
                              <CreditCard className="w-3.5 h-3.5 mr-1" />
                              {payingId === item._id ? "Processing..." : "Pay Now"}
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 2. Mobile View: Responsive Cards */}
          <div className="lg:hidden space-y-4">
            {appointments.map((item) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-3xl border border-[#EFECE6] shadow-xs space-y-4"
              >
                {/* Header: Image, Service name, Price */}
                <div className="flex items-start gap-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 border border-[#EFECE6] shrink-0">
                    <Image
                      src={item.serviceImage}
                      alt={item.serviceName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E5739]">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#2D241E] truncate">
                      {item.serviceName}
                    </h3>
                    <p className="font-serif font-bold text-sm text-[#9E5739] mt-0.5">
                      ${item.servicePrice}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FAF6F0] text-xs">
                  <div>
                    <span className="text-[#2D241E]/50 text-[10px] uppercase font-semibold block">
                      Date & Time
                    </span>
                    <span className="font-medium text-[#2D241E]">
                      {item.appointmentDate} &bull; {item.timeSlot}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#2D241E]/50 text-[10px] uppercase font-semibold block">
                      Requested
                    </span>
                    <span className="text-[#2D241E]/80">
                      {formatRequestDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Status and Payment Pills */}
                <div className="flex items-center justify-between pt-1">
                  <div>{renderStatusBadge(item.status)}</div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      item.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-neutral-100 text-[#2D241E]/65 border-neutral-200"
                    }`}
                  >
                    {item.paymentStatus}
                  </span>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#EFECE6]">
                  {/* View Details */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(item)}
                    className="flex-1 h-9 text-xs border-[#EFECE6] text-[#2D241E] hover:bg-[#FAF6F0]"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-[#9E5739]" />
                    Details
                  </Button>

                  {/* Cancel Button (only pending) */}
                  {item.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCancelTarget(item)}
                      className="flex-1 h-9 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Ban className="w-3.5 h-3.5 mr-1" />
                      Cancel
                    </Button>
                  )}

                  {/* Pay Now Button (only confirmed AND unpaid) */}
                  {item.status === "confirmed" &&
                    item.paymentStatus === "unpaid" && (
                      <Button
                        size="sm"
                        onClick={() => handlePayNow(item._id)}
                        disabled={payingId === item._id}
                        className="flex-1 h-9 text-xs bg-[#9E5739] hover:bg-[#8B4A2F] text-white"
                      >
                        <CreditCard className="w-3.5 h-3.5 mr-1" />
                        {payingId === item._id ? "Processing..." : "Pay Now"}
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reusable View Details Modal */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Cancel Appointment Confirmation Dialog (AlertDialog) */}
      <AlertDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <AlertDialogContent className="bg-white border-[#EFECE6] p-6 rounded-3xl text-[#2D241E]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl font-bold text-[#2D241E]">
              Cancel Appointment?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#2D241E]/70 mt-1">
              Are you sure you want to cancel your booking for{" "}
              <strong className="text-[#2D241E]">
                {cancelTarget?.serviceName}
              </strong>{" "}
              on {cancelTarget?.appointmentDate} at {cancelTarget?.timeSlot}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel
              disabled={cancelling}
              className="border-[#EFECE6] text-[#2D241E] hover:bg-[#FAF6F0]"
            >
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
