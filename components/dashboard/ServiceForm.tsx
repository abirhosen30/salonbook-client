"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { categoryNames } from "@/lib/categories";
import {
  createService,
  updateService,
  getServiceById,
  uploadImage,
} from "@/lib/api";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Props = {
  // If serviceId is passed, form operates in EDIT mode; otherwise, in ADD mode
  serviceId?: string;
};

export default function ServiceForm({ serviceId }: Props) {
  const router = useRouter();
  const isEditMode = Boolean(serviceId);

  // Form Fields State
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // Image Upload State (file only, with preview)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [existingImage, setExistingImage] = useState<string>("");

  // Loading States
  const [pageLoading, setPageLoading] = useState<boolean>(isEditMode);
  const [saving, setSaving] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>("");

  // Function 1: If in Edit mode, load the existing service data to prefill form
  useEffect(() => {
    async function loadServiceData() {
      if (!serviceId) return;

      try {
        setPageLoading(true);
        setLoadError("");
        const data = await getServiceById(serviceId);

        if (!data) {
          setLoadError("Service not found");
          return;
        }

        // Prefill form inputs with existing service details
        setServiceName(data.serviceName);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(String(data.price));
        setDuration(String(data.duration));
        setStatus(data.status);
        setExistingImage(data.image);
        setPreviewUrl(data.image);
      } catch (error: unknown) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to load service";
        setLoadError(errorMsg);
      } finally {
        setPageLoading(false);
      }
    }

    loadServiceData();
  }, [serviceId]);

  // Function 2: Handle image file selection and generate local preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create local temporary URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  // Function 3: Handle form submission for both Add and Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic field validations
    if (!serviceName.trim()) {
      toast.error("Please enter a service name");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a service description");
      return;
    }

    // 2. Number validations: must be positive numbers
    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      toast.error("Price must be a positive number greater than 0");
      return;
    }

    const numDuration = Number(duration);
    if (!duration || isNaN(numDuration) || numDuration <= 0) {
      toast.error("Duration must be a positive number of minutes");
      return;
    }

    // 3. Image validation: image is required in Add mode, optional in Edit if existing exists
    if (!isEditMode && !imageFile) {
      toast.error("Please upload a service image");
      return;
    }

    if (isEditMode && !imageFile && !existingImage) {
      toast.error("Please upload a service image");
      return;
    }

    try {
      setSaving(true);

      // 4. Upload image file if a new file was chosen
      let finalImageUrl = existingImage;
      if (imageFile) {
        try {
          finalImageUrl = await uploadImage(imageFile);
        } catch {
          toast.error("Image upload failed. Please try a different image.");
          setSaving(false);
          return;
        }
      }

      // 5. Prepare payload
      const servicePayload = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: numPrice,
        duration: numDuration,
        image: finalImageUrl,
        status,
      };

      // 6. Call create or update API
      if (isEditMode && serviceId) {
        await updateService(serviceId, servicePayload);
        toast.success("Service updated successfully!");
      } else {
        await createService(servicePayload);
        toast.success("Service created successfully!");
      }

      // 7. Redirect to services management table
      router.push("/dashboard/admin/services");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to save service";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
    console.log("Form submitted with data:");
  };

  // Section 4: Loading state during initial service fetch in Edit mode
  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-[#2D241E]/60">Loading service details...</p>
      </div>
    );
  }

  // Section 5: Error state if serviceId is invalid
  if (loadError) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EFECE6] text-center max-w-md mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2D241E]">
          {loadError}
        </h2>
        <p className="text-sm text-[#2D241E]/60 mt-1 mb-6">
          The service you are trying to edit could not be found.
        </p>
        <Link
          href="/dashboard/admin/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9E5739] text-white text-sm font-medium hover:bg-[#8B4A2F]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div>
        <Link
          href="/dashboard/admin/services"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D241E]/70 hover:text-[#9E5739] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Services</span>
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EFECE6] shadow-xs">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#EFECE6]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
            {isEditMode ? "Edit Service" : "New Offering"}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-1">
            {isEditMode ? "Update Salon Treatment" : "Add Salon Treatment"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#2D241E]/70">
            {isEditMode
              ? "Modify the service pricing, duration, category, or preview image."
              : "Publish a bespoke hair, skin, or spa ritual for client bookings."}
          </p>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Field 1: Service Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
              Service Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Luxe Balayage & Glossing"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="h-11 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] text-sm focus-visible:ring-[#9E5739]"
              required
            />
          </div>

          {/* Field 2 & 3: Category & Status in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
                Category *
              </label>
              <Select value={category} onValueChange={(val) => setCategory(val || "")}>
                <SelectTrigger className="h-11 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] text-sm focus:ring-[#9E5739] data-placeholder:text-[#2D241E]/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#EFECE6]">
                  {categoryNames.map((name) => (
                    <SelectItem key={name} value={name} className="cursor-pointer">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
                Status *
              </label>
              <Select
                value={status}
                onValueChange={(val) => setStatus((val as "active" | "inactive") || "active")}
              >
                <SelectTrigger className="h-11 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] text-sm focus:ring-[#9E5739]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#EFECE6]">
                  <SelectItem value="active" className="cursor-pointer text-emerald-700 font-medium">
                    Active (Visible to customers)
                  </SelectItem>
                  <SelectItem value="inactive" className="cursor-pointer text-neutral-600 font-medium">
                    Inactive (Hidden from booking)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Field 4 & 5: Price & Duration in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Price ($) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
                Price ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#9E5739] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-11 pl-10 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] text-sm focus-visible:ring-[#9E5739]"
                  required
                />
              </div>
            </div>

            {/* Duration (minutes) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
                Duration (minutes) *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#9E5739] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="number"
                  min="5"
                  step="5"
                  placeholder="e.g. 60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-11 pl-10 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] text-sm focus-visible:ring-[#9E5739]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Field 6: Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
              Service Description *
            </label>
            <Textarea
              rows={4}
              placeholder="Describe the consultation protocol, techniques, botanical ingredients, and aftercare..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] text-sm focus-visible:ring-[#9E5739] resize-none leading-relaxed"
              required
            />
          </div>

          {/* Field 7: Service Image (FILE UPLOAD only, with preview) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
              Service Image * {isEditMode && "(Optional if keeping current image)"}
            </label>

            {/* File Upload Box */}
            <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#EFECE6]">
              {/* File Input */}
              <div className="flex-1 w-full">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="h-11 bg-white border-[#EFECE6] text-xs text-[#2D241E] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#9E5739] file:text-white cursor-pointer"
                />
                <p className="mt-1 text-[11px] text-[#2D241E]/60">
                  Select a PNG, JPG, or WebP photo (high resolution recommended).
                </p>
              </div>

              {/* Image Preview Thumbnail */}
              {previewUrl && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#EFECE6] bg-neutral-100 shrink-0">
                  <Image
                    src={previewUrl}
                    alt="Service preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-xs font-medium">
                    Preview
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/admin/services")}
              disabled={saving}
              className="h-11 px-5 border-[#EFECE6] text-[#2D241E] hover:bg-[#FAF6F0]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-11 px-6 bg-[#9E5739] hover:bg-[#8B4A2F] text-white font-medium"
            >
              {saving ? (
                <span>Saving Service...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {isEditMode ? "Update Service" : "Create Service"}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
