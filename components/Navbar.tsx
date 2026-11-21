"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useCurrentUser } from "@/lib/auth-client";
import { logout } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dashboardUrl = user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const res = await logout();
      toast.success(res.message);
      setDropdownOpen(false);
      setMenuOpen(false);
      router.push("/");
    } catch {
      toast.error("Failed to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2D241E]">
              Salon<span className="text-[#9E5739]">Book</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-[#9E5739] font-semibold"
                  : "text-[#2D241E]/80 hover:text-[#9E5739]"
              }`}
            >
              Home
            </Link>

            <Link
              href="/services"
              className={`text-sm font-medium transition-colors ${
                isActive("/services")
                  ? "text-[#9E5739] font-semibold"
                  : "text-[#2D241E]/80 hover:text-[#9E5739]"
              }`}
            >
              Browse Services
            </Link>

            {user && (
              <Link
                href={dashboardUrl}
                className={`text-sm font-medium transition-colors ${
                  isActive(dashboardUrl)
                    ? "text-[#9E5739] font-semibold"
                    : "text-[#2D241E]/80 hover:text-[#9E5739]"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop User / Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-medium text-[#2D241E] hover:text-[#9E5739] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-[#9E5739] rounded-full hover:bg-[#8B4A2F] shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-full hover:bg-[#EFECE6]/60 transition-colors"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#9E5739]/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#9E5739] text-white flex items-center justify-center text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="text-sm font-medium text-[#2D241E]">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#2D241E]/60" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-[#EFECE6] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#EFECE6]">
                      <p className="text-sm font-semibold text-[#2D241E] truncate">{user.name}</p>
                      <p className="text-xs text-[#2D241E]/60 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-[#FAF6F0] text-[#9E5739] rounded-md border border-[#9E5739]/20">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={dashboardUrl}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2D241E] hover:bg-[#FAF6F0] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#9E5739]" />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-[#2D241E] hover:bg-[#EFECE6]/60 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#EFECE6] bg-[#FAF6F0] px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`block py-2 text-base font-medium rounded-md px-3 ${
              isActive("/") ? "bg-white text-[#9E5739] font-semibold" : "text-[#2D241E]"
            }`}
          >
            Home
          </Link>

          <Link
            href="/services"
            onClick={() => setMenuOpen(false)}
            className={`block py-2 text-base font-medium rounded-md px-3 ${
              isActive("/services") ? "bg-white text-[#9E5739] font-semibold" : "text-[#2D241E]"
            }`}
          >
            Browse Services
          </Link>

          {user && (
            <Link
              href={dashboardUrl}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 text-base font-medium rounded-md px-3 ${
                isActive(dashboardUrl) ? "bg-white text-[#9E5739] font-semibold" : "text-[#2D241E]"
              }`}
            >
              Dashboard ({user.role})
            </Link>
          )}

          <div className="pt-3 border-t border-[#EFECE6]">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-[#2D241E] border border-[#EFECE6] rounded-xl bg-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-white bg-[#9E5739] rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-[#EFECE6]">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#9E5739] text-white flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-[#2D241E] truncate">{user.name}</p>
                    <p className="text-xs text-[#2D241E]/60 truncate">{user.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
