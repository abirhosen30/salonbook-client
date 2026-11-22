"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function DashboardTopbar() {
  const [open, setOpen] = useState(false);
  const { user } = useCurrentUser();

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white border-b border-[#EFECE6]">
      {/* Left 1: Mobile drawer button opening shadcn Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <button
              type="button"
              className="p-2 rounded-xl text-[#2D241E] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              aria-label="Open dashboard navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          }
        />

        <SheetContent side="left" className="p-0 w-72 bg-white border-r border-[#EFECE6]">
          {/* Accessible title for screen readers */}
          <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>

          {/* Render the sidebar inside the mobile drawer */}
          <DashboardSidebar onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Center 2: SalonBook brand */}
      <Link href="/" className="flex items-center gap-1.5 font-serif text-xl font-bold text-[#2D241E]">
        <span>
          Salon<span className="text-[#9E5739]">Book</span>
        </span>
        <Sparkles className="w-4 h-4 text-[#9E5739]" />
      </Link>

      {/* Right 3: Quick user preview avatar */}
      <div className="flex items-center gap-2">
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-[#9E5739]/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#9E5739] text-white flex items-center justify-center font-semibold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>
    </header>
  );
}
