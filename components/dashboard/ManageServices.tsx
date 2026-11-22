"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Scissors,
  PlusCircle,
  Edit,
  Trash2,
  Clock,
  Power,
  Search,
} from "lucide-react";
import { getServices, updateService, deleteService } from "@/lib/api";
import { Service } from "@/types";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getServices({ status: "all" });
        if (isMounted) {
          setServices(data);
          setLoading(false);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to load salon services";
          toast.error(errorMsg);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleStatus = async (service: Service) => {
    try {
      setTogglingId(service._id);
      const newStatus = service.status === "active" ? "inactive" : "active";
      await updateService(service._id, { status: newStatus });
      toast.success(
        `Service status changed to ${newStatus.toUpperCase()}`
      );
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, status: newStatus } : s))
      );
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update service status";
      toast.error(errorMsg);
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteService(deleteTarget._id);
      toast.success("Service deleted successfully");
      setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete service";
      toast.error(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.serviceName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-0.5">
            Manage Salon Services
          </h1>
          <p className="text-xs sm:text-sm text-[#2D241E]/70 mt-1">
            Create, edit, toggle visibility, and maintain treatment prices and durations.
          </p>
        </div>

        <Link href="/dashboard/admin/services/add">
          <Button className="bg-[#9E5739] hover:bg-[#8B4A2F] text-white flex items-center gap-2 shrink-0">
            <PlusCircle className="w-4 h-4" />
            <span>Add New Service</span>
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFECE6] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#2D241E]/40 ml-1" />
        <input
          type="text"
          placeholder="Filter treatments by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm bg-transparent outline-none placeholder:text-[#2D241E]/40"
        />
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader size="lg" />
          <p className="mt-3 text-sm text-[#2D241E]/60">Loading services catalog...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EFECE6] p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center mx-auto mb-3">
            <Scissors className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2D241E]">
            No services found
          </h3>
          <p className="text-xs sm:text-sm text-[#2D241E]/65 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? "No treatment matched your filter keyword."
              : "No services have been added to the catalog yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-[#FAF6F0]/80">
              <TableRow className="border-[#EFECE6]">
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pl-6">
                  Service
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Category
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Duration
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Price
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pr-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service._id} className="border-[#EFECE6] hover:bg-[#FAF6F0]/40">
                  {/* Service Info */}
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-[#EFECE6]">
                        <Image
                          src={service.image}
                          alt={service.serviceName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#2D241E] line-clamp-1">
                          {service.serviceName}
                        </p>
                        <p className="text-xs text-[#2D241E]/50 line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="text-xs font-medium text-[#2D241E]/70">
                    {service.category}
                  </TableCell>

                  {/* Duration */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-[#2D241E]/70">
                      <Clock className="w-3.5 h-3.5 text-[#9E5739]" />
                      <span>{service.duration} mins</span>
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="font-serif font-bold text-sm text-[#9E5739]">
                    ${service.price}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        service.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-neutral-100 text-[#2D241E]/60 border-neutral-200"
                      }`}
                    >
                      {service.status}
                    </Badge>
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Toggle Active / Inactive */}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={togglingId === service._id}
                        onClick={() => handleToggleStatus(service)}
                        className={`h-8 px-2.5 text-xs border-[#EFECE6] ${
                          service.status === "active"
                            ? "text-amber-700 hover:bg-amber-50"
                            : "text-emerald-700 hover:bg-emerald-50"
                        }`}
                        title={service.status === "active" ? "Deactivate" : "Activate"}
                      >
                        <Power className="w-3.5 h-3.5 mr-1" />
                        {service.status === "active" ? "Deactivate" : "Activate"}
                      </Button>

                      {/* Edit Button */}
                      <Link href={`/dashboard/admin/services/edit/${service._id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs border-[#EFECE6] text-[#2D241E] hover:bg-[#FAF6F0]"
                          title="Edit Service"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1 text-[#9E5739]" />
                          Edit
                        </Button>
                      </Link>

                      {/* Delete Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(service)}
                        className="h-8 px-2.5 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-3xl border-[#EFECE6]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl font-bold text-[#2D241E]">
              Delete Service?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#2D241E]/70">
              Are you sure you want to delete &ldquo;{deleteTarget?.serviceName}&rdquo;?
              This action will remove the service from the catalog permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-xl border-[#EFECE6] text-[#2D241E]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
