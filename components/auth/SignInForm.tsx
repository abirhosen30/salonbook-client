"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // TODO(me): Replace this with your real signIn logic
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- basic validation ---
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    // Log the data so you can inspect it in DevTools
    console.log("📋 Sign In Data:", { email: email.trim(), password });

    try {
      setLoading(true);

      // TODO(me): call signIn.email here — example:
      // const { data, error } = await signIn.email({
      //   email: email.trim(),
      //   password: password,
      // });
      //
      // if (error) {
      //   toast.error(error.message || "Invalid credentials");
      //   return;
      // }
      //
      // // check blocked
      // if (data?.user?.isBlocked) {
      //   toast.error("Your account is blocked");
      //   return;
      // }
      //
      // toast.success("Signed in successfully!");
      //
      // // redirect logic
      // if (redirectUrl) {
      //   router.push(redirectUrl);
      // } else if (data?.user?.role === "admin") {
      //   router.push("/dashboard/admin");
      // } else {
      //   router.push("/dashboard/customer");
      // }

      toast.info("Sign in function is not implemented yet — check console for data");
    } catch (error: unknown) {
      console.error("❌ Sign In Error:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Sign in failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      const callbackURL = redirectUrl || "/dashboard/customer";

      await signIn.social({
        provider: "google",
        callbackURL: callbackURL,
      });
    } catch (error: unknown) {
      console.error("❌ Google Sign In Error:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Google sign in failed";
      toast.error(errorMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-[#EFECE6] bg-white p-8 text-[#2D241E] shadow-sm sm:p-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold tracking-wider text-[#9E5739] uppercase">
          Welcome Back
        </span>
        <h1 className="mt-1.5 font-serif text-3xl font-bold text-[#2D241E]">
          Sign In
        </h1>
        <p className="mt-2 text-sm text-[#2D241E]/70">
          Continue to your luxurious salon experience.
        </p>
      </div>

      {/* Google Sign In Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
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
        {googleLoading ? "Connecting Google..." : "Sign in with Google"}
      </Button>

      {/* Divider */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="w-full border-t border-[#EFECE6]" />
        <span className="absolute bg-white px-3 text-xs tracking-wider text-[#2D241E]/50 uppercase">
          or sign in with email
        </span>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSignIn} className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#2D241E] uppercase">
            Email Address
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
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || googleLoading}
          className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-[#9E5739] text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#8B4A2F]"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Link to Sign Up */}
      <div className="mt-6 text-center text-xs text-[#2D241E]/70">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#9E5739] hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
