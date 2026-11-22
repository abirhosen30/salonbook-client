"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, EyeOff, Check, X, Upload, Link as LinkIcon } from "lucide-react";
import { uploadImage } from "@/lib/api";
import { signUp, signInWithGoogle } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpForm() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Profile image mode and values
  const [imageMode, setImageMode] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  // Password rules validation
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle image URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
  };

  // Regular Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Please ensure your password meets all requirements");
      return;
    }

    try {
      setLoading(true);

      let finalImage = "";

      // Upload file if selected, otherwise use image URL
      if (imageMode === "file" && imageFile) {
        finalImage = await uploadImage(imageFile);
      } else if (imageMode === "url" && imageUrl.trim()) {
        finalImage = imageUrl.trim();
      }

      await signUp({
        name: name.trim(),
        email: email.trim(),
        password: password,
        image: finalImage || undefined,
      });

      toast.success("Account created successfully!");
      router.push("/dashboard/customer");
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to create account";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      toast.success("Signed in with Google!");
      router.push("/dashboard/customer");
    } catch (error: any) {
      const errorMsg = error?.message || "Google sign in failed";
      toast.error(errorMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-[#EFECE6] shadow-sm text-[#2D241E]">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
          Welcome to SalonBook
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#2D241E] mt-1.5">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-[#2D241E]/70">
          Join us to reserve luxurious salon experiences tailored to you.
        </p>
      </div>

      {/* Google Sign Up Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignUp}
        disabled={googleLoading || loading}
        className="w-full h-11 border-[#EFECE6] hover:bg-[#FAF6F0] text-[#2D241E] font-medium flex items-center justify-center gap-3 rounded-xl mb-6 cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        {googleLoading ? "Connecting Google..." : "Sign up with Google"}
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-[#EFECE6] w-full" />
        <span className="bg-white px-3 text-xs uppercase tracking-wider text-[#2D241E]/50 absolute">
          or sign up with email
        </span>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
            Full Name *
          </label>
          <Input
            type="text"
            placeholder="e.g. Elena Rostova"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-3.5 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] font-medium text-sm focus-visible:ring-[#9E5739] placeholder:text-[#2D241E]/40"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
            Email Address *
          </label>
          <Input
            type="email"
            placeholder="elena@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3.5 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] font-medium text-sm focus-visible:ring-[#9E5739] placeholder:text-[#2D241E]/40"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
            Password *
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 pr-11 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] font-medium text-sm focus-visible:ring-[#9E5739] placeholder:text-[#2D241E]/40"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D241E]/60 hover:text-[#2D241E] p-1 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password Rules Checklist */}
          <div className="mt-2.5 p-3 rounded-xl bg-[#FAF6F0] border border-[#EFECE6] space-y-1.5 text-xs">
            <div
              className={`flex items-center gap-2 ${
                hasMinLength ? "text-emerald-700 font-medium" : "text-[#2D241E]/60"
              }`}
            >
              {hasMinLength ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <X className="w-3.5 h-3.5 text-red-500" />
              )}
              <span>At least 6 characters</span>
            </div>

            <div
              className={`flex items-center gap-2 ${
                hasUppercase ? "text-emerald-700 font-medium" : "text-[#2D241E]/60"
              }`}
            >
              {hasUppercase ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <X className="w-3.5 h-3.5 text-red-500" />
              )}
              <span>At least one uppercase letter (A-Z)</span>
            </div>

            <div
              className={`flex items-center gap-2 ${
                hasLowercase ? "text-emerald-700 font-medium" : "text-[#2D241E]/60"
              }`}
            >
              {hasLowercase ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <X className="w-3.5 h-3.5 text-red-500" />
              )}
              <span>At least one lowercase letter (a-z)</span>
            </div>
          </div>
        </div>

        {/* Profile Image (File upload OR image URL) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D241E] mb-1.5">
            Profile Image (Optional)
          </label>

          {/* Image Mode Switcher */}
          <div className="flex rounded-xl bg-[#FAF6F0] p-1 border border-[#EFECE6] mb-2.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setImageMode("file");
                setPreviewUrl(imageFile ? URL.createObjectURL(imageFile) : "");
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                imageMode === "file"
                  ? "bg-white text-[#9E5739] shadow-xs"
                  : "text-[#2D241E]/70 hover:text-[#2D241E]"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => {
                setImageMode("url");
                setPreviewUrl(imageUrl);
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                imageMode === "url"
                  ? "bg-white text-[#9E5739] shadow-xs"
                  : "text-[#2D241E]/70 hover:text-[#2D241E]"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Image URL
            </button>
          </div>

          {/* File Upload Input */}
          {imageMode === "file" ? (
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full h-11 px-3.5 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] text-xs focus-visible:ring-[#9E5739] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-[#9E5739] file:text-white cursor-pointer"
            />
          ) : (
            <Input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
              className="w-full h-11 px-3.5 bg-[#FAF6F0] border-[#EFECE6] text-[#2D241E] font-medium text-sm focus-visible:ring-[#9E5739] placeholder:text-[#2D241E]/40"
            />
          )}

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-3 flex items-center gap-3 p-2.5 bg-[#FAF6F0] rounded-xl border border-[#EFECE6]">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#9E5739]/30 bg-neutral-100 shrink-0">
                <Image
                  src={previewUrl}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="text-xs text-[#2D241E]/70 overflow-hidden">
                <p className="font-semibold text-[#2D241E]">Preview selected</p>
                <p className="truncate">
                  {imageMode === "file" && imageFile
                    ? imageFile.name
                    : previewUrl}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full h-11 mt-2 bg-[#9E5739] hover:bg-[#8B4A2F] text-white font-medium text-sm rounded-xl cursor-pointer shadow-xs transition-colors"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Link to Sign In */}
      <div className="mt-6 text-center text-xs text-[#2D241E]/70">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-[#9E5739] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
