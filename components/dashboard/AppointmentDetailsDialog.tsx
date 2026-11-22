"use client";

import Image from "next/image";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Appointment } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  // Appointment object to inspect, or null if modal is closed
  appointment: Appointment | null;
  // Controls dialog open state
  open: boolean;
  // Callback when dialog open state changes
  onOpenChange: (open: boolean) => void;
};

// Reusable dialog component to view full appointment details (used by Customer and Admin)
export default function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
}: Props) {
  if (!appointment) return null;

  // Helper 1: Format date into readable string
  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  // Helper 2: Status badge styling
  const renderStatusBadge = (status: Appointment["status"]) => {
    if (status === "confirmed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Confirmed
        </span>
      );
    }
    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white border-[#EFECE6] p-6 rounded-3xl text-[#2D241E]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E5739]">
              Booking #{appointment._id}
            </span>
            <div className="flex items-center gap-2">
              {renderStatusBadge(appointment.status)}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  appointment.paymentStatus === "paid"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-neutral-100 text-[#2D241E]/70 border-neutral-200"
                }`}
              >
                {appointment.paymentStatus}
              </span>
            </div>
          </div>

          <DialogTitle className="font-serif text-2xl font-bold text-[#2D241E] mt-1">
            {appointment.serviceName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-3">
          {/* Service Image and Category preview */}
          <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-[#EFECE6] bg-neutral-100">
            <Image
              src={appointment.serviceImage}
              alt={appointment.serviceName}
              fill
              className="object-cover"
            />
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-black/60 text-white backdrop-blur-md">
              {appointment.category}
            </span>
          </div>

          {/* Booking Schedule Details Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#FAF6F0] p-4 rounded-2xl border border-[#EFECE6] text-xs">
            <div className="flex items-center gap-2 text-[#2D241E]/80">
              <Calendar className="w-4 h-4 text-[#9E5739]" />
              <div>
                <p className="text-[10px] text-[#2D241E]/50 uppercase font-semibold">Date</p>
                <p className="font-medium text-[#2D241E]">{appointment.appointmentDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#2D241E]/80">
              <Clock className="w-4 h-4 text-[#9E5739]" />
              <div>
                <p className="text-[10px] text-[#2D241E]/50 uppercase font-semibold">Time Slot</p>
                <p className="font-medium text-[#2D241E]">{appointment.timeSlot}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#2D241E]/80">
              <DollarSign className="w-4 h-4 text-[#9E5739]" />
              <div>
                <p className="text-[10px] text-[#2D241E]/50 uppercase font-semibold">Price</p>
                <p className="font-bold text-[#9E5739]">${appointment.servicePrice}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#2D241E]/80">
              <Sparkles className="w-4 h-4 text-[#9E5739]" />
              <div>
                <p className="text-[10px] text-[#2D241E]/50 uppercase font-semibold">Requested On</p>
                <p className="font-medium text-[#2D241E]">{formatDate(appointment.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-2 border-t border-[#EFECE6] pt-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-[#2D241E]/60 text-[10px]">
              Customer Information
            </h4>
            <div className="flex items-center justify-between text-[#2D241E]/80">
              <span className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#9E5739]" />
                {appointment.customerName}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#9E5739]" />
                {appointment.customerEmail}
              </span>
            </div>
          </div>

          {/* Additional Message Note (if any) */}
          {appointment.message && (
            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EFECE6] text-xs space-y-1">
              <span className="flex items-center gap-1.5 font-semibold text-[#2D241E]/70 text-[10px] uppercase">
                <FileText className="w-3 h-3 text-[#9E5739]" />
                Customer Notes
              </span>
              <p className="text-[#2D241E]/80 italic">&ldquo;{appointment.message}&rdquo;</p>
            </div>
          )}

          {/* Modal Action Footer */}
          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#EFECE6] text-[#2D241E] hover:bg-[#FAF6F0]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
