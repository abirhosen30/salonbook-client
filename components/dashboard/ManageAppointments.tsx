"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Eye,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { getAdminAppointments, updateAdminAppointmentStatus } from "@/lib/api";
import { Appointment } from "@/types";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getAdminAppointments(
          statusFilter === "all" ? undefined : statusFilter
        );
        if (isMounted) {
          setAppointments(data);
          setLoading(false);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to load appointments";
          toast.error(errorMsg);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [statusFilter]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    try {
      setActionLoadingId(id);
      await updateAdminAppointmentStatus(id, newStatus);
      toast.success(`Appointment marked as ${newStatus.toUpperCase()}`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : `Failed to update status to ${newStatus}`;
      toast.error(errorMsg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Confirmed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        );
    }
  };

  const filterTabs = [
    { label: "All Bookings", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
          Scheduling Operations
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-0.5">
          Manage Customer Appointments
        </h1>
        <p className="text-xs sm:text-sm text-[#2D241E]/70 mt-1">
          Review appointment requests, confirm client time slots, and monitor payment statuses.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#EFECE6] pb-3">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === tab.value
                ? "bg-[#9E5739] text-white shadow-xs"
                : "bg-white text-[#2D241E]/70 border border-[#EFECE6] hover:bg-[#FAF6F0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader size="lg" />
          <p className="mt-3 text-sm text-[#2D241E]/60">Loading appointment records...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EFECE6] p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center mx-auto mb-3">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2D241E]">
            No appointments found
          </h3>
          <p className="text-xs sm:text-sm text-[#2D241E]/65 mt-1 max-w-sm mx-auto">
            There are currently no appointment requests under this status filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-[#FAF6F0]/80">
              <TableRow className="border-[#EFECE6]">
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pl-6">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Service
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Date & Slot
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
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pr-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt._id} className="border-[#EFECE6] hover:bg-[#FAF6F0]/40">
                  {/* Customer Info */}
                  <TableCell className="pl-6 py-4">
                    <div className="text-xs">
                      <p className="font-semibold text-[#2D241E] text-sm">
                        {apt.customerName || "Customer"}
                      </p>
                      <p className="text-[#2D241E]/60">{apt.customerEmail}</p>
                    </div>
                  </TableCell>

                  {/* Service Info */}
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-medium text-[#2D241E]">{apt.serviceName}</p>
                      <p className="text-[#2D241E]/50">{apt.category}</p>
                    </div>
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell>
                    <div className="text-xs text-[#2D241E]">
                      <p className="font-semibold">{apt.appointmentDate}</p>
                      <p className="text-[#2D241E]/60">{apt.timeSlot}</p>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="font-serif font-bold text-sm text-[#9E5739]">
                    ${apt.servicePrice}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>{renderStatusBadge(apt.status)}</TableCell>

                  {/* Payment Status Badge */}
                  <TableCell>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        apt.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-neutral-100 text-[#2D241E]/65 border-neutral-200"
                      }`}
                    >
                      {apt.paymentStatus}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details Dialog Trigger */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAppointment(apt)}
                        className="h-8 px-2 text-xs border-[#EFECE6] text-[#2D241E] hover:bg-[#FAF6F0]"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-[#9E5739]" />
                        Details
                      </Button>

                      {/* Confirm Button: ONLY for pending appointments (PDF Page 15) */}
                      {apt.status === "pending" && (
                        <Button
                          size="sm"
                          disabled={actionLoadingId === apt._id}
                          onClick={() => handleUpdateStatus(apt._id, "confirmed")}
                          className="h-8 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Confirm
                        </Button>
                      )}

                      {/* Cancel Button: for pending or confirmed appointments */}
                      {(apt.status === "pending" || apt.status === "confirmed") && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === apt._id}
                          onClick={() => handleUpdateStatus(apt._id, "cancelled")}
                          className="h-8 px-2 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Appointment Details Dialog (PDF Page 14-15) */}
      <Dialog
        open={Boolean(selectedAppointment)}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-lg rounded-3xl border-[#EFECE6] p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold text-[#2D241E]">
              Appointment Request Details
            </DialogTitle>
            <DialogDescription className="text-xs text-[#2D241E]/60">
              ID: {selectedAppointment?._id}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4 pt-2">
              {/* Customer Box */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl space-y-1.5 text-xs text-[#2D241E]">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <User className="w-4 h-4 text-[#9E5739]" />
                  <span>{selectedAppointment.customerName || "Customer"}</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D241E]/70 pl-6">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedAppointment.customerEmail}</span>
                </div>
              </div>

              {/* Service & Schedule Box */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-[#EFECE6] rounded-2xl">
                  <span className="text-[#2D241E]/50 font-medium">Service</span>
                  <p className="font-semibold text-[#2D241E] mt-0.5">
                    {selectedAppointment.serviceName}
                  </p>
                  <p className="text-[#9E5739] font-serif font-bold mt-1">
                    ${selectedAppointment.servicePrice}
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#EFECE6] rounded-2xl">
                  <span className="text-[#2D241E]/50 font-medium">Schedule</span>
                  <p className="font-semibold text-[#2D241E] mt-0.5">
                    {selectedAppointment.appointmentDate}
                  </p>
                  <p className="text-[#2D241E]/70 mt-1">
                    {selectedAppointment.timeSlot}
                  </p>
                </div>
              </div>

              {/* Message Box */}
              {selectedAppointment.message && (
                <div className="bg-white border border-[#EFECE6] p-3.5 rounded-2xl text-xs">
                  <div className="flex items-center gap-1.5 text-[#2D241E]/60 font-medium mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#9E5739]" />
                    <span>Customer Note</span>
                  </div>
                  <p className="text-[#2D241E]/80 italic">
                    &ldquo;{selectedAppointment.message}&rdquo;
                  </p>
                </div>
              )}

              {/* Status and Action Row */}
              <div className="pt-2 flex items-center justify-between border-t border-[#EFECE6]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#2D241E]/60">Status:</span>
                  {renderStatusBadge(selectedAppointment.status)}
                </div>

                <div className="flex items-center gap-2">
                  {selectedAppointment.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedAppointment._id, "confirmed")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                    >
                      Confirm Booking
                    </Button>
                  )}
                  {selectedAppointment.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedAppointment._id, "cancelled")}
                      className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-8"
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
