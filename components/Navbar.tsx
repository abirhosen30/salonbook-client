"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { logout } from "@/lib/api"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const dashboardUrl =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      const res = await logout()
      toast.success(res.message)
      setDropdownOpen(false)
      setMenuOpen(false)
      router.push("/")
    } catch {
      toast.error("Failed to log out. Please try again.")
    } finally {
      setLoggingOut(false)
    }
  }

  // Hide main Navbar on /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[#EFECE6] bg-[#FAF6F0]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2D241E]">
              Salon<span className="text-[#9E5739]">Book</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "font-semibold text-[#9E5739]"
                  : "text-[#2D241E]/80 hover:text-[#9E5739]"
              }`}
            >
              Home
            </Link>

            <Link
              href="/services"
              className={`text-sm font-medium transition-colors ${
                isActive("/services")
                  ? "font-semibold text-[#9E5739]"
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
                    ? "font-semibold text-[#9E5739]"
                    : "text-[#2D241E]/80 hover:text-[#9E5739]"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop User / Auth Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-medium text-[#2D241E] transition-colors hover:text-[#9E5739]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-[#9E5739] px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#8B4A2F]"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 rounded-full p-1.5 transition-colors hover:bg-[#EFECE6]/60"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-9 w-9 rounded-full border border-[#9E5739]/20 object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9E5739] text-sm font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="text-sm font-medium text-[#2D241E]">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#2D241E]/60" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[#EFECE6] bg-white py-2 shadow-lg">
                    <div className="border-b border-[#EFECE6] px-4 py-2">
                      <p className="truncate text-sm font-semibold text-[#2D241E]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#2D241E]/60">
                        {user.email}
                      </p>
                      <span className="mt-1 inline-block rounded-md border border-[#9E5739]/20 bg-[#FAF6F0] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#9E5739] uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={dashboardUrl}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2D241E] transition-colors hover:bg-[#FAF6F0]"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#9E5739]" />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-[#2D241E] transition-colors hover:bg-[#EFECE6]/60"
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="space-y-3 border-t border-[#EFECE6] bg-[#FAF6F0] px-4 pt-3 pb-5 md:hidden">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              isActive("/")
                ? "bg-white font-semibold text-[#9E5739]"
                : "text-[#2D241E]"
            }`}
          >
            Home
          </Link>

          <Link
            href="/services"
            onClick={() => setMenuOpen(false)}
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              isActive("/services")
                ? "bg-white font-semibold text-[#9E5739]"
                : "text-[#2D241E]"
            }`}
          >
            Browse Services
          </Link>

          {user && (
            <Link
              href={dashboardUrl}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(dashboardUrl)
                  ? "bg-white font-semibold text-[#9E5739]"
                  : "text-[#2D241E]"
              }`}
            >
              Dashboard ({user.role})
            </Link>
          )}

          <div className="border-t border-[#EFECE6] pt-3">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="w-full rounded-xl border border-[#EFECE6] bg-white py-2.5 text-center text-sm font-medium text-[#2D241E]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="w-full rounded-xl bg-[#9E5739] py-2.5 text-center text-sm font-medium text-white"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-[#EFECE6] bg-white px-3 py-2">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9E5739] text-sm font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-semibold text-[#2D241E]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#2D241E]/60">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-sm font-medium text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
