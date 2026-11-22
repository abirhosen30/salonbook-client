"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

type Props = {
  children: React.ReactNode;
};

// Main layout wrapper for all /dashboard pages with collapsible sidebar support
export default function DashboardLayout({ children }: Props) {
  // State: Controls whether the desktop sidebar is open (forward) or collapsed (back)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      {/* 1. Desktop Collapsible Sidebar (slides back to w-0, comes forward to w-64) */}
      <aside
        className={`hidden md:block shrink-0 h-screen sticky top-0 bg-white border-r border-[#EFECE6] transition-all duration-300 ease-in-out overflow-hidden z-20 ${
          sidebarOpen ? "w-64" : "w-0 border-r-0"
        }`}
      >
        <div className="w-64 h-full">
          <DashboardSidebar
            onToggleCollapse={() => setSidebarOpen(false)}
          />
        </div>
      </aside>

      {/* 2. Main Area: Topbar + Page Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar: has the toggle button to slide sidebar back / forward */}
        <DashboardTopbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
