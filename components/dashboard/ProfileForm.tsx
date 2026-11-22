"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Upload,
  Link as LinkIcon,
  ShieldCheck,
  ShieldAlert,
  Save,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getCustomerProfile, updateCustomerProfile, uploadImage } from "@/lib/api";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProfileForm() {
  const { user: sessionUser } = useCurrentUser();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");

  const [imageMode, setImageMode] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const profile = await getCustomerProfile();
        if (isMounted) {
          setName(profile.name || "");
          setEmail(profile.email || "");
          setRole(profile.role || "customer");
          setIsBlocked(Boolean(profile.isBlocked));
          setPhone(profile.phone || "");
          if (profile.image) {
            setPreviewUrl(profile.image);
            setImageUrl(profile.image);
          }
          setLoading(false);
        }
      } catch {
        // Fallback to session user
        if (isMounted) {
          if (sessionUser) {
            setName(sessionUser.name || "");
            setEmail(sessionUser.email || "");
            setRole(sessionUser.role || "customer");
            setIsBlocked(Boolean(sessionUser.isBlocked));
            if (sessionUser.image) {
              setPreviewUrl(sessionUser.image);
              setImageUrl(sessionUser.image);
            }
          }
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [sessionUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setImageUrl(val);
    setPreviewUrl(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      setSaving(true);

      let finalImage = previewUrl;

      // If a new file was chosen, upload to ImgBB first
      if (imageMode === "file" && imageFile) {
        try {
          toast.info("Uploading image to server...");
          finalImage = await uploadImage(imageFile);
        } catch (uploadErr: unknown) {
          const errorMsg =
            uploadErr instanceof Error
              ? uploadErr.message
              : "Failed to upload profile image";
          toast.error(errorMsg);
          setSaving(false);
          return;
        }
      } else if (imageMode === "url" && imageUrl.trim()) {
        finalImage = imageUrl.trim();
      }

      const updated = await updateCustomerProfile({
        name: name.trim(),
        image: finalImage,
        phone: phone.trim(),
      });

      setName(updated.name);
      setPreviewUrl(updated.image || "");
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-[#2D241E]/60">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
          Account Settings
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-0.5">
          Profile Management
        </h1>
        <p className="text-xs sm:text-sm text-[#2D241E]/70 mt-1">
          Manage your personal information, contact phone, and avatar.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EFECE6] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar & Badges Header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#EFECE6]">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center font-serif text-3xl font-bold border-2 border-[#EFECE6] shrink-0">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={name || "User Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                (name ? name.charAt(0) : "U").toUpperCase()
              )}
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="font-serif text-xl font-bold text-[#2D241E]">
                {name || "Your Name"}
              </h3>
              <p className="text-xs text-[#2D241E]/60 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{email}</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 capitalize">
                  {role} Account
                </Badge>
                {isBlocked ? (
                  <Badge className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Suspended</span>
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Active Standing</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D241E] uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#2D241E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                className="pl-10 h-11 rounded-xl border-[#EFECE6] bg-[#FAF6F0]/30 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Email Address (Read Only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D241E] uppercase tracking-wider flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[11px] text-[#2D241E]/40 normal-case font-normal">
                (Primary account identifier)
              </span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#2D241E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                value={email}
                disabled
                className="pl-10 h-11 rounded-xl border-[#EFECE6] bg-[#FAF6F0] text-[#2D241E]/60 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D241E] uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#2D241E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="pl-10 h-11 rounded-xl border-[#EFECE6] bg-[#FAF6F0]/30 focus:bg-white"
              />
            </div>
          </div>

          {/* Profile Image Upload / URL Mode (PDF Page 10 & 18) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2D241E] uppercase tracking-wider block">
              Profile Avatar
            </label>

            {/* Mode switch */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className={`flex-1 py-2 px-3 text-xs rounded-xl border font-medium flex items-center justify-center gap-2 transition-colors ${
                  imageMode === "file"
                    ? "bg-[#9E5739] text-white border-[#9E5739]"
                    : "bg-[#FAF6F0] text-[#2D241E]/70 border-[#EFECE6] hover:bg-[#FAF6F0]/80"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New File</span>
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex-1 py-2 px-3 text-xs rounded-xl border font-medium flex items-center justify-center gap-2 transition-colors ${
                  imageMode === "url"
                    ? "bg-[#9E5739] text-white border-[#9E5739]"
                    : "bg-[#FAF6F0] text-[#2D241E]/70 border-[#EFECE6] hover:bg-[#FAF6F0]/80"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image Web URL</span>
              </button>
            </div>

            {imageMode === "file" ? (
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="h-11 rounded-xl border-[#EFECE6] file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#FAF6F0] file:text-[#9E5739] cursor-pointer"
              />
            ) : (
              <Input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="h-11 rounded-xl border-[#EFECE6] bg-[#FAF6F0]/30 focus:bg-white"
              />
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full h-11 bg-[#9E5739] hover:bg-[#8B4A2F] text-white font-medium rounded-xl flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
