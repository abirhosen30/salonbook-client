"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarCheck,
  User as UserIcon,
  Scissors,
  PlusCircle,
  Users,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/lib/api";

type Props = {
  // Optional callback to close the mobile drawer/sheet when a link is clicked
  onItemClick?: () => void;
};

export default function DashboardSidebar({ onItemClick }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();

  // Navigation items for Customer role
  const customerLinks = [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Appointments", href: "/dashboard/customer/appointments", icon: CalendarCheck },
    { label: "My Profile", href: "/dashboard/customer/profile", icon: UserIcon },
  ];

  // Navigation items for Admin role
  const adminLinks = [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Services", href: "/dashboard/admin/services", icon: Scissors },
    { label: "Add Service", href: "/dashboard/admin/services/new", icon: PlusCircle },
    { label: "Manage Appointments", href: "/dashboard/admin/appointments", icon: CalendarCheck },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { label: "My Profile", href: "/dashboard/admin/profile", icon: UserIcon },
  ];

  // Pick the link set based on current user's role
  const links = user?.role === "admin" ? adminLinks : customerLinks;

  // Function 1: Check if a given link is currently active
  const isLinkActive = (href: string) => {
    // For root overview pages, check exact match
    if (href === "/dashboard/customer" || href === "/dashboard/admin") {
      return pathname === href;
    }
    // For other links, match exact or starting subpath
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Function 2: Handle user logout
  const handleLogout = async () => {
    try {
      if (onItemClick) onItemClick();
      await logout();
      toast.success("Logged out successfully");
      router.push("/signin");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-white border-r border-[#EFECE6]">
      {/* Top 1: SalonBook Brand Logo */}
      <div className="p-6 border-b border-[#EFECE6]">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-2 group"
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-[#2D241E]">
            Salon<span className="text-[#9E5739]">Book</span>
          </span>
          <Sparkles className="w-4 h-4 text-[#9E5739] group-hover:rotate-12 transition-transform" />
        </Link>

        {/* Top 2: User profile info & role badge */}
        <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6F0] border border-[#EFECE6]">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-[#9E5739]/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#9E5739] text-white flex items-center justify-center font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}

          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#2D241E] truncate">
              {user?.name || "Loading..."}
            </p>
            <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white border border-[#EFECE6] text-[#9E5739]">
              {user?.role || "user"}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Scrollable navigation links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isLinkActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[#9E5739] text-white shadow-xs font-semibold"
                  : "text-[#2D241E]/75 hover:bg-[#FAF6F0] hover:text-[#9E5739]"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-white" : "text-[#9E5739]"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Logout button */}
      <div className="p-4 border-t border-[#EFECE6]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
