"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  // Whether desktop sidebar is open or collapsed
  sidebarOpen?: boolean;
  // Callback to toggle desktop sidebar back and forward
  onToggleSidebar?: () => void;
};

export default function DashboardTopbar({ sidebarOpen = true, onToggleSidebar }: Props) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user } = useCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-[#EFECE6] shadow-xs">
      {/* Left Area: Toggle controls */}
      <div className="flex items-center gap-3">
        {/* 1. Mobile Menu Button (opens slide-out Sheet drawer on mobile screens) */}
        <div className="md:hidden">
          <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="p-2 rounded-xl text-[#2D241E] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                  aria-label="Open mobile navigation"
                >
                  <Menu className="w-5 h-5 text-[#2D241E]" />
                </button>
              }
            />

            <SheetContent side="left" className="p-0 w-72 bg-white border-r border-[#EFECE6]">
              <SheetTitle className="sr-only">Mobile Dashboard Navigation</SheetTitle>
              <DashboardSidebar onItemClick={() => setMobileDrawerOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* 2. Desktop Toggle Button: click to slide sidebar back, click again to bring forward */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title={sidebarOpen ? "Slide menu back" : "Bring menu forward"}
            aria-label={sidebarOpen ? "Slide menu back" : "Bring menu forward"}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#2D241E]/80 hover:text-[#9E5739] hover:bg-[#FAF6F0] border border-[#EFECE6] transition-colors cursor-pointer"
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose className="w-4 h-4 text-[#9E5739]" />
                <span>Hide Sidebar</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="w-4 h-4 text-[#9E5739]" />
                <span>Show Sidebar</span>
              </>
            )}
          </button>
        )}

        {/* 3. Brand Logo (visible on mobile or when desktop sidebar is collapsed) */}
        {(!sidebarOpen || true) && (
          <Link
            href="/"
            className={`flex items-center gap-1.5 font-serif text-xl font-bold text-[#2D241E] ${
              sidebarOpen ? "md:hidden" : "flex"
            }`}
          >
            <span>
              Salon<span className="text-[#9E5739]">Book</span>
            </span>
            <Sparkles className="w-4 h-4 text-[#9E5739]" />
          </Link>
        )}
      </div>

      {/* Right Area: User preview info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-[#2D241E]">{user?.name || "User"}</p>
          <span className="text-[10px] uppercase font-bold text-[#9E5739] tracking-wider">
            {user?.role || "customer"}
          </span>
        </div>

        {user?.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-[#9E5739]/30"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#9E5739] text-white flex items-center justify-center font-semibold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>
    </header>
  );
}
