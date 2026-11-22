import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

type Props = {
  children: React.ReactNode;
};

// Main layout wrapper for all /dashboard pages
export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      {/* 1. Mobile Topbar (visible only on mobile screens) */}
      <DashboardTopbar />

      {/* 2. Desktop Sidebar (fixed/sticky on the left, hidden on mobile) */}
      <div className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        <DashboardSidebar />
      </div>

      {/* 3. Main Page Content (scrollable content container) */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] md:min-h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
