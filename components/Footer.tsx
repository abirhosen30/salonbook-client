import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FAF6F0] text-[#2D241E] border-t border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2D241E]">
                Salon<span className="text-[#9E5739]">Book</span>
              </span>
            </Link>
            <p className="text-sm text-[#2D241E]/75 leading-relaxed">
              Premier online destination for luxury salon, hair, skincare, and spa appointments. Hand-picked stylists and seamless booking.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center text-[#2D241E]/80 hover:text-[#9E5739] hover:border-[#9E5739]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center text-[#2D241E]/80 hover:text-[#9E5739] hover:border-[#9E5739]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center text-[#2D241E]/80 hover:text-[#9E5739] hover:border-[#9E5739]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#2D241E]">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#2D241E]/75 hover:text-[#9E5739] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#2D241E]/75 hover:text-[#9E5739] transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/signin" className="text-[#2D241E]/75 hover:text-[#9E5739] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-[#2D241E]/75 hover:text-[#9E5739] transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Opening Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#2D241E]">
              Opening Hours
            </h4>
            <div className="space-y-3 text-sm text-[#2D241E]/75">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#9E5739] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#2D241E]">Mon – Sat</p>
                  <p>9:00 am – 8:00 pm</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#9E5739] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#2D241E]">Sunday</p>
                  <p>10:00 am – 6:00 pm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Salon Location & Contact Info */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#2D241E]">
              Salon Location
            </h4>
            <ul className="space-y-3 text-sm text-[#2D241E]/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9E5739] mt-0.5 shrink-0" />
                <span>450 Maison Promenade, Suite 120, Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9E5739] shrink-0" />
                <a href="tel:+18004272665" className="hover:text-[#9E5739] transition-colors">
                  +1 (800) 427-BOOK
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9E5739] shrink-0" />
                <a href="mailto:concierge@salonbook.com" className="hover:text-[#9E5739] transition-colors">
                  concierge@salonbook.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#EFECE6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2D241E]/60">
          <p>© 2026 SalonBook Inc. All rights reserved. Crafted for modern luxury wellness.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-[#9E5739] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#9E5739] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
