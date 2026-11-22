"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert, LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/lib/api";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

type Props = {
  allowedRoles: ("customer" | "admin")[];
  children: React.ReactNode;
};

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();

  // Function 1: Check authentication & role authorization, then redirect if needed
  useEffect(() => {
    // Wait until user data has finished loading
    if (loading) return;

    // Check 1: User is not logged in -> redirect to signin with return URL
    if (!user) {
      router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check 2: User is blocked -> do not redirect, we will show the blocked UI below
    if (user.isBlocked) {
      return;
    }

    // Check 3: User has the wrong role -> toast error and redirect to their own dashboard
    const hasAllowedRole = allowedRoles.includes(user.role);
    if (!hasAllowedRole) {
      toast.error("Unauthorized: You do not have permission to view this page");

      // Send admin to admin dashboard, customer to customer dashboard
      const targetDashboard =
        user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
      router.push(targetDashboard);
    }
  }, [user, loading, allowedRoles, pathname, router]);

  // Section 2: Show loading spinner while verifying session
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
        <p className="mt-4 text-sm text-[#2D241E]/60">Checking permissions...</p>
      </div>
    );
  }

  // Section 3: If not logged in, keep showing loader while the redirect runs
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Section 4: If user account is blocked, display blocked screen
  if (user.isBlocked) {
    const handleLogout = async () => {
      await logout();
      router.push("/signin");
    };

    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-red-100 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#2D241E] mb-2">
            Your account is blocked
          </h1>

          <p className="text-sm text-[#2D241E]/70 mb-6 leading-relaxed">
            Your access has been temporarily suspended by an administrator.
            Please reach out to support@salonbook.com if you believe this is a mistake.
          </p>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-11 border-[#EFECE6] text-[#2D241E] hover:bg-[#FAF6F0] flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-[#9E5739]" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Section 5: If user role is not allowed, show loader while the redirect completes
  const hasAllowedRole = allowedRoles.includes(user.role);
  if (!hasAllowedRole) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Section 6: All checks passed -> render protected child content
  return <>{children}</>;
}
