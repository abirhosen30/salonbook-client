"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Loader from "@/components/Loader";

// Main component: Redirects /dashboard to role-specific dashboard (/dashboard/admin or /dashboard/customer)
export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  // Function 1: Handle routing based on user session and role
  useEffect(() => {
    // Wait until user session check completes
    if (loading) return;

    // If user is not logged in, redirect to signin
    if (!user) {
      router.push("/signin?redirect=/dashboard");
      return;
    }

    // Redirect to the correct dashboard based on role
    if (user.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/customer");
    }
  }, [user, loading, router]);

  // Section 2: Show loader while determining the redirect destination
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center">
      <Loader size="lg" />
      <p className="mt-4 text-sm text-[#2D241E]/60">Redirecting to your dashboard...</p>
    </div>
  );
}
