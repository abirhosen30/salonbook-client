"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { Eye, EyeOff, Check, X, Upload, Link as LinkIcon } from "lucide-react"
import { uploadImage } from "@/lib/api"
import { signUp, signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignUpForm() {
  const router = useRouter()

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [imageMode, setImageMode] = useState<"file" | "url">("file")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const [loading, setLoading] = useState<boolean>(false)
  const [googleLoading, setGoogleLoading] = useState<boolean>(false)

  // Password rules
  const hasMinLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    setPreviewUrl(url)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter your full name")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    if (!isPasswordValid) {
      toast.error("Please ensure your password meets all requirements")
      return
    }

    try {
      setLoading(true)

      let finalImage = ""

      if (imageMode === "file" && imageFile) {
        finalImage = await uploadImage(imageFile)
      } else if (imageMode === "url" && imageUrl.trim()) {
        finalImage = imageUrl.trim()
      }

      const signUpData = {
        name: name.trim(),
        email: email.trim(),
        password,
        image: finalImage || undefined,
      }

      const { error } = await signUp.email({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        image: signUpData.image,
      })

      if (error) {
        toast.error(error.message || "Failed to create account")
        return
      }

      toast.success("Account created successfully!")
      router.push("/dashboard/customer")
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to create account"
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true)
      console.log("🔵 Starting Google Sign In...")

      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      })
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Google sign in failed"
      toast.error(errorMsg)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-[#EFECE6] bg-white p-8 text-[#2D241E] shadow-sm sm:p-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold tracking-wider text-[#9E5739] uppercase">
          Welcome to SalonBook
        </span>
        <h1 className="mt-1.5 font-serif text-3xl font-bold text-[#2D241E]">
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
        className="mb-6 flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-[#EFECE6] font-medium text-[#2D241E] hover:bg-[#FAF6F0]"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
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
      <div className="relative mb-6 flex items-center justify-center">
        <div className="w-full border-t border-[#EFECE6]" />
        <span className="absolute bg-white px-3 text-xs tracking-wider text-[#2D241E]/50 uppercase">
          or sign up with email
        </span>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#2D241E] uppercase">
            Full Name *
          </label>
          <Input
            type="text"
            placeholder="e.g. Elena Rostova"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full border-[#EFECE6] bg-[#FAF6F0] px-3.5 text-sm font-medium text-[#2D241E] placeholder:text-[#2D241E]/40 focus-visible:ring-[#9E5739]"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#2D241E] uppercase">
            Email Address *
          </label>
          <Input
            type="email"
            placeholder="elena@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full border-[#EFECE6] bg-[#FAF6F0] px-3.5 text-sm font-medium text-[#2D241E] placeholder:text-[#2D241E]/40 focus-visible:ring-[#9E5739]"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#2D241E] uppercase">
            Password *
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full border-[#EFECE6] bg-[#FAF6F0] px-3.5 pr-11 text-sm font-medium text-[#2D241E] placeholder:text-[#2D241E]/40 focus-visible:ring-[#9E5739]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-[#2D241E]/60 transition-colors hover:text-[#2D241E]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Rules Checklist */}
          <div className="mt-2.5 space-y-1.5 rounded-xl border border-[#EFECE6] bg-[#FAF6F0] p-3 text-xs">
            <div
              className={`flex items-center gap-2 ${
                hasMinLength
                  ? "font-medium text-emerald-700"
                  : "text-[#2D241E]/60"
              }`}
            >
              {hasMinLength ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>At least 6 characters</span>
            </div>

            <div
              className={`flex items-center gap-2 ${
                hasUppercase
                  ? "font-medium text-emerald-700"
                  : "text-[#2D241E]/60"
              }`}
            >
              {hasUppercase ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>At least one uppercase letter (A-Z)</span>
            </div>

            <div
              className={`flex items-center gap-2 ${
                hasLowercase
                  ? "font-medium text-emerald-700"
                  : "text-[#2D241E]/60"
              }`}
            >
              {hasLowercase ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" />
              )}
              <span>At least one lowercase letter (a-z)</span>
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#2D241E] uppercase">
            Profile Image (Optional)
          </label>

          <div className="mb-2.5 flex rounded-xl border border-[#EFECE6] bg-[#FAF6F0] p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setImageMode("file")
                setPreviewUrl(imageFile ? URL.createObjectURL(imageFile) : "")
              }}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 transition-colors ${
                imageMode === "file"
                  ? "bg-white text-[#9E5739] shadow-xs"
                  : "text-[#2D241E]/70 hover:text-[#2D241E]"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => {
                setImageMode("url")
                setPreviewUrl(imageUrl)
              }}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 transition-colors ${
                imageMode === "url"
                  ? "bg-white text-[#9E5739] shadow-xs"
                  : "text-[#2D241E]/70 hover:text-[#2D241E]"
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Image URL
            </button>
          </div>

          {imageMode === "file" ? (
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="h-11 w-full cursor-pointer border-[#EFECE6] bg-[#FAF6F0] px-3.5 text-xs text-[#2D241E] file:mr-3 file:rounded-md file:border-0 file:bg-[#9E5739] file:px-3 file:py-1 file:text-xs file:font-medium file:text-white focus-visible:ring-[#9E5739]"
            />
          ) : (
            <Input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
              className="h-11 w-full border-[#EFECE6] bg-[#FAF6F0] px-3.5 text-sm font-medium text-[#2D241E] placeholder:text-[#2D241E]/40 focus-visible:ring-[#9E5739]"
            />
          )}

          {previewUrl && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#EFECE6] bg-[#FAF6F0] p-2.5">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#9E5739]/30 bg-neutral-100">
                <Image
                  src={previewUrl}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="overflow-hidden text-xs text-[#2D241E]/70">
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || googleLoading}
          className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-[#9E5739] text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#8B4A2F]"
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
  )
}
